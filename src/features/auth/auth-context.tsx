"use client";

import { createContext, useContext, useState } from "react";

import type { AuthSession, AuthUserIdentity } from "@/features/auth/model/session";
import type { Role } from "@/features/auth/model/roles";
import { rolePolicy } from "@/features/auth/policies/role-policy";
import { clearAuthSession, persistAuthSession, readAuthSession, transitionToAuthenticated } from "@/features/auth/services/auth-session-service";

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
  session: AuthSession | null;
  role: Role;
  user: AuthUser | null;
  appUserData: OnPointUserData | null;
  signIn: (input: { email: string; displayName?: string }) => void;
  updateAppUserData: (patch: Partial<OnPointUserData>) => void;
  signOut: () => void;
};

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
      session: null as AuthSession | null,
      user: null as AuthUser | null,
      appUserData: null as OnPointUserData | null,
    };
  }

  const session = readAuthSession();

  let user: AuthUser | null = null;
  let appUserData: OnPointUserData | null = null;

  if (session.role !== "anonymous") {
    user = session.user;

    const rawStored = localStorage.getItem(appDataKey(session.user.uid));
    if (rawStored) {
      try {
        appUserData = JSON.parse(rawStored) as OnPointUserData;
      } catch {
        const created = defaultAppUserData();
        localStorage.setItem(appDataKey(session.user.uid), JSON.stringify(created));
        appUserData = created;
      }
    } else {
      const created = defaultAppUserData();
      localStorage.setItem(appDataKey(session.user.uid), JSON.stringify(created));
      appUserData = created;
    }
  }

  return {
    session,
    user,
    appUserData,
  };
}

function toLocalUser(input: { email: string; displayName?: string }): AuthUserIdentity {
  const normalizedEmail = input.email.trim().toLowerCase();
  return {
    uid: `local-${normalizedEmail.replace(/[^a-z0-9]/g, "-")}`,
    email: normalizedEmail,
    displayName: input.displayName?.trim() || normalizedEmail.split("@")[0] || "User",
    photoURL: null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initial] = useState(readInitialAuthState);

  const [session, setSession] = useState<AuthSession | null>(initial.session);
  const [user, setUser] = useState<AuthUser | null>(initial.user);
  const [appUserData, setAppUserData] = useState<OnPointUserData | null>(initial.appUserData);

  const role = rolePolicy.resolveRole(session);

  function signIn(input: { email: string; displayName?: string }) {
    const identity = toLocalUser(input);
    const nextSession = transitionToAuthenticated({ user: identity, role: "user" });
    persistAuthSession(nextSession);

    const rawStored = localStorage.getItem(appDataKey(identity.uid));
    if (rawStored) {
      try {
        setAppUserData(JSON.parse(rawStored) as OnPointUserData);
      } catch {
        const created = defaultAppUserData();
        localStorage.setItem(appDataKey(identity.uid), JSON.stringify(created));
        setAppUserData(created);
      }
    } else {
      const created = defaultAppUserData();
      localStorage.setItem(appDataKey(identity.uid), JSON.stringify(created));
      setAppUserData(created);
    }

    setSession(nextSession);
    setUser(identity);
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
    clearAuthSession();
    const anonymous = readAuthSession();
    setSession(anonymous);
    setUser(null);
    setAppUserData(null);
  }

  const value: AuthContextValue = {
    session,
    role,
    user,
    appUserData,
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
