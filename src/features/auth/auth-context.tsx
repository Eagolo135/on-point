"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthUser = {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
};

type OnPointUserData = {
  theme: "dark-gold";
  createdAtIso: string;
  preferences: {
    timezone: string;
  };
};

type AuthContextValue = {
  user: AuthUser | null;
  appUserData: OnPointUserData | null;
  isReady: boolean;
  signIn: (input: { email: string; displayName?: string }) => void;
  updateAppUserData: (patch: Partial<OnPointUserData>) => void;
  signOut: () => void;
};

const SESSION_KEY = "onpoint_auth_session";

function appDataKey(uid: string) {
  return `onpoint_app_user_data_${uid}`;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function defaultAppUserData(): OnPointUserData {
  return {
    theme: "dark-gold",
    createdAtIso: new Date().toISOString(),
    preferences: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
}

function readInitialAuthState() {
  if (typeof window === "undefined") {
    return {
      user: null as AuthUser | null,
      appUserData: null as OnPointUserData | null,
    };
  }

  let user: AuthUser | null = null;
  let appUserData: OnPointUserData | null = null;

  const storedUserRaw = localStorage.getItem(SESSION_KEY);
  if (storedUserRaw) {
    try {
      const parsed = JSON.parse(storedUserRaw) as AuthUser;
      user = parsed;

      const rawStored = localStorage.getItem(appDataKey(parsed.uid));
      if (rawStored) {
        appUserData = JSON.parse(rawStored) as OnPointUserData;
      } else {
        const created = defaultAppUserData();
        localStorage.setItem(appDataKey(parsed.uid), JSON.stringify(created));
        appUserData = created;
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  return {
    user,
    appUserData,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initial] = useState(readInitialAuthState);

  const [user, setUser] = useState<AuthUser | null>(initial.user);
  const [appUserData, setAppUserData] = useState<OnPointUserData | null>(initial.appUserData);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  function buildLocalUser(input: { email: string; displayName?: string }): AuthUser {
    const normalizedEmail = input.email.trim().toLowerCase();
    return {
      uid: `local-${normalizedEmail.replace(/[^a-z0-9]/g, "-")}`,
      email: normalizedEmail,
      displayName: input.displayName?.trim() || normalizedEmail.split("@")[0] || "User",
      photoURL: null,
    };
  }

  function signIn(input: { email: string; displayName?: string }) {
    const profile = buildLocalUser(input);

    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    const rawStored = localStorage.getItem(appDataKey(profile.uid));
    if (rawStored) {
      setAppUserData(JSON.parse(rawStored) as OnPointUserData);
    } else {
      const created = defaultAppUserData();
      localStorage.setItem(appDataKey(profile.uid), JSON.stringify(created));
      setAppUserData(created);
    }

    setUser(profile);
  }

  function updateAppUserData(patch: Partial<OnPointUserData>) {
    if (!user) {
      return;
    }

    setAppUserData((prev) => {
      const next: OnPointUserData = {
        ...(prev ?? defaultAppUserData()),
        ...patch,
        preferences: {
          ...(prev?.preferences ?? defaultAppUserData().preferences),
          ...(patch.preferences ?? {}),
        },
      };

      localStorage.setItem(appDataKey(user.uid), JSON.stringify(next));
      return next;
    });
  }

  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setAppUserData(null);
  }

  const value: AuthContextValue = {
    user,
    appUserData,
    isReady,
    signIn,
    updateAppUserData,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
