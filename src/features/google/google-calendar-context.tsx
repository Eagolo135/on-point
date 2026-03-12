"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { useAuth } from "@/features/auth/auth-context";

export type GoogleCalendarEvent = {
  id: string;
  summary: string;
  start: string;
  end: string;
  description?: string;
};

type GoogleCalendarContextValue = {
  events: GoogleCalendarEvent[];
  isLoading: boolean;
  error: string | null;
  refreshEvents: () => Promise<void>;
  createEvent: (input: { summary: string; description?: string; startIso: string; endIso: string }) => Promise<void>;
  updateEvent: (eventId: string, input: { summary?: string; description?: string; startIso?: string; endIso?: string }) => Promise<void>;
};

const GoogleCalendarContext = createContext<GoogleCalendarContextValue | null>(null);

export function GoogleCalendarProvider({ children }: { children: React.ReactNode }) {
  const { googleAccessToken, isCalendarScopeGranted } = useAuth();

  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calendarRequest = useCallback(async <T,>(url: string, init?: RequestInit): Promise<T> => {
    if (!googleAccessToken) {
      throw new Error("Google Calendar access token is missing. Sign in again to grant calendar access.");
    }

    const response = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Google Calendar API request failed (${response.status}): ${details}`);
    }

    return (await response.json()) as T;
  }, [googleAccessToken]);

  const refreshEvents = useCallback(async () => {
    if (!isCalendarScopeGranted) {
      setEvents([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const timeMin = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
      const data = await calendarRequest<{
        items?: Array<{
          id: string;
          summary?: string;
          description?: string;
          start?: { dateTime?: string; date?: string };
          end?: { dateTime?: string; date?: string };
        }>;
      }>(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(timeMin)}&maxResults=100`,
      );

      const mapped: GoogleCalendarEvent[] = (data.items ?? []).map((item) => ({
        id: item.id,
        summary: item.summary ?? "Untitled event",
        description: item.description,
        start: item.start?.dateTime ?? item.start?.date ?? "",
        end: item.end?.dateTime ?? item.end?.date ?? "",
      }));

      setEvents(mapped);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to load Google Calendar events.");
    } finally {
      setIsLoading(false);
    }
  }, [calendarRequest, isCalendarScopeGranted]);

  const createEvent = useCallback(async (input: { summary: string; description?: string; startIso: string; endIso: string }) => {
    await calendarRequest("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        start: { dateTime: input.startIso },
        end: { dateTime: input.endIso },
      }),
    });

    await refreshEvents();
  }, [calendarRequest, refreshEvents]);

  const updateEvent = useCallback(async (
    eventId: string,
    input: { summary?: string; description?: string; startIso?: string; endIso?: string },
  ) => {
    const body: Record<string, unknown> = {};
    if (input.summary) {
      body.summary = input.summary;
    }
    if (typeof input.description !== "undefined") {
      body.description = input.description;
    }
    if (input.startIso) {
      body.start = { dateTime: input.startIso };
    }
    if (input.endIso) {
      body.end = { dateTime: input.endIso };
    }

    await calendarRequest(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    await refreshEvents();
  }, [calendarRequest, refreshEvents]);

  useEffect(() => {
    if (!isCalendarScopeGranted) {
      setEvents([]);
      return;
    }

    void refreshEvents();
  }, [isCalendarScopeGranted, googleAccessToken, refreshEvents]);

  const value: GoogleCalendarContextValue = {
    events,
    isLoading,
    error,
    refreshEvents,
    createEvent,
    updateEvent,
  };

  return <GoogleCalendarContext.Provider value={value}>{children}</GoogleCalendarContext.Provider>;
}

export function useGoogleCalendar() {
  const context = useContext(GoogleCalendarContext);
  if (!context) {
    throw new Error("useGoogleCalendar must be used within GoogleCalendarProvider.");
  }
  return context;
}
