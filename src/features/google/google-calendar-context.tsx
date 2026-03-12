"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Task } from "@/types/domain";

const GOOGLE_SCRIPT_ID = "google-identity-services";
const GOOGLE_SCOPES =
  "openid profile email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
};

type GoogleTokenClient = {
  requestAccessToken: (options?: { prompt?: string }) => void;
};

type GoogleCalendarEvent = {
  id: string;
  summary: string;
  start: string;
  end: string;
  status?: string;
  onPointTaskId?: string;
};

type GoogleProfile = {
  name: string;
  email: string;
  picture?: string;
};

type GoogleSyncContextValue = {
  isReady: boolean;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  profile: GoogleProfile | null;
  events: GoogleCalendarEvent[];
  signIn: () => void;
  signOut: () => void;
  refreshEvents: () => Promise<void>;
  syncTaskToCalendar: (task: Task) => Promise<void>;
  syncAllTasksToCalendar: (tasks: Task[]) => Promise<void>;
};

type GoogleOAuthWindow = Window & {
  google?: {
    accounts: {
      oauth2: {
        initTokenClient: (options: {
          client_id: string;
          scope: string;
          callback: (response: GoogleTokenResponse) => void;
        }) => GoogleTokenClient;
        revoke: (token: string, done?: () => void) => void;
      };
    };
  };
};

const GoogleSyncContext = createContext<GoogleSyncContextValue | null>(null);

function toIsoTodayTime(minutesFromNow: number): string {
  const date = new Date(Date.now() + minutesFromNow * 60_000);
  return date.toISOString();
}

function taskToEventPayload(task: Task) {
  const start = toIsoTodayTime(15);
  const end = toIsoTodayTime(15 + task.estimatedMinutes);

  return {
    summary: task.title,
    description: `On Point Task\nType: ${task.type}\nPriority: ${task.priority}`,
    start: { dateTime: start },
    end: { dateTime: end },
    extendedProperties: {
      private: {
        onPointTaskId: task.id,
      },
    },
  };
}

export function GoogleCalendarProvider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<GoogleProfile | null>(null);
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const tokenClientRef = useRef<GoogleTokenClient | null>(null);

  const refreshEvents = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    try {
      const timeMin = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(timeMin)}&maxResults=100`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unable to fetch Google Calendar events.");
      }

      const data = (await response.json()) as {
        items?: Array<{
          id: string;
          summary?: string;
          status?: string;
          start?: { dateTime?: string; date?: string };
          end?: { dateTime?: string; date?: string };
          extendedProperties?: { private?: { onPointTaskId?: string } };
        }>;
      };

      const mappedEvents: GoogleCalendarEvent[] = (data.items ?? []).map((item) => ({
        id: item.id,
        summary: item.summary ?? "Untitled event",
        start: item.start?.dateTime ?? item.start?.date ?? "",
        end: item.end?.dateTime ?? item.end?.date ?? "",
        status: item.status,
        onPointTaskId: item.extendedProperties?.private?.onPointTaskId,
      }));

      setEvents(mappedEvents);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to refresh Google Calendar events.");
    }
  }, [accessToken]);

  const fetchProfile = useCallback(async (token: string) => {
    try {
      const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to fetch Google profile.");
      }

      const data = (await response.json()) as {
        name?: string;
        email?: string;
        picture?: string;
      };

      setProfile({
        name: data.name ?? "Google User",
        email: data.email ?? "",
        picture: data.picture,
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to fetch Google profile.");
    }
  }, []);

  const signIn = useCallback(() => {
    setError(null);

    if (!tokenClientRef.current) {
      setError("Google auth is not configured yet. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID.");
      return;
    }

    tokenClientRef.current.requestAccessToken({ prompt: "consent" });
  }, []);

  const signOut = useCallback(() => {
    if (!accessToken) {
      return;
    }

    const googleWindow = window as GoogleOAuthWindow;
    googleWindow.google?.accounts.oauth2.revoke(accessToken, () => {
      setAccessToken(null);
      setIsConnected(false);
      setProfile(null);
      setEvents([]);
      sessionStorage.removeItem("onpoint_google_access_token");
    });
  }, [accessToken]);

  const syncTaskToCalendar = useCallback(
    async (task: Task) => {
      if (!accessToken) {
        return;
      }

      const existing = events.find((event) => event.onPointTaskId === task.id);
      const method = existing ? "PATCH" : "POST";
      const endpoint = existing
        ? `https://www.googleapis.com/calendar/v3/calendars/primary/events/${existing.id}`
        : "https://www.googleapis.com/calendar/v3/calendars/primary/events";

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskToEventPayload(task)),
      });

      if (!response.ok) {
        throw new Error("Failed syncing task to Google Calendar.");
      }

      await refreshEvents();
    },
    [accessToken, events, refreshEvents],
  );

  const syncAllTasksToCalendar = useCallback(
    async (tasks: Task[]) => {
      for (const task of tasks) {
        await syncTaskToCalendar(task);
      }
    },
    [syncTaskToCalendar],
  );

  useEffect(() => {
    if (!clientId) {
      setError("Google sign-in requires NEXT_PUBLIC_GOOGLE_CLIENT_ID.");
      return;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      setIsReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setIsReady(true);
    script.onerror = () => setError("Failed to load Google Identity script.");
    document.head.appendChild(script);
  }, [clientId]);

  useEffect(() => {
    if (!isReady || !clientId) {
      return;
    }

    const googleWindow = window as GoogleOAuthWindow;
    if (!googleWindow.google?.accounts.oauth2) {
      return;
    }

    tokenClientRef.current = googleWindow.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GOOGLE_SCOPES,
      callback: async (response) => {
        if (response.error || !response.access_token) {
          setError(response.error ?? "Google sign-in failed.");
          return;
        }

        setIsLoading(true);
        setAccessToken(response.access_token);
        setIsConnected(true);
        sessionStorage.setItem("onpoint_google_access_token", response.access_token);
        await fetchProfile(response.access_token);
        setIsLoading(false);
      },
    });
  }, [clientId, fetchProfile, isReady]);

  useEffect(() => {
    const token = sessionStorage.getItem("onpoint_google_access_token");
    if (!token) {
      return;
    }

    setAccessToken(token);
    setIsConnected(true);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    void fetchProfile(accessToken);
    void refreshEvents();

    const interval = window.setInterval(() => {
      void refreshEvents();
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [accessToken, fetchProfile, refreshEvents]);

  const contextValue = useMemo<GoogleSyncContextValue>(
    () => ({
      isReady,
      isConnected,
      isLoading,
      error,
      profile,
      events,
      signIn,
      signOut,
      refreshEvents,
      syncTaskToCalendar,
      syncAllTasksToCalendar,
    }),
    [
      isReady,
      isConnected,
      isLoading,
      error,
      profile,
      events,
      signIn,
      signOut,
      refreshEvents,
      syncTaskToCalendar,
      syncAllTasksToCalendar,
    ],
  );

  return <GoogleSyncContext.Provider value={contextValue}>{children}</GoogleSyncContext.Provider>;
}

export function useGoogleCalendar() {
  const context = useContext(GoogleSyncContext);
  if (!context) {
    throw new Error("useGoogleCalendar must be used inside GoogleCalendarProvider.");
  }

  return context;
}
