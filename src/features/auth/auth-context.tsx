"use client";

import { createContext, useContext, useMemo, useState } from "react";

type AuthUser = {
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

type StoredUser = {
  email: string;
  password: string;
};

const USERS_KEY = "onpoint_auth_users";
const SESSION_KEY = "onpoint_auth_session";

const AuthContext = createContext<AuthContextValue | null>(null);

function readUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const rawSession = localStorage.getItem(SESSION_KEY);
    return rawSession ? { email: rawSession } : null;
  });
  const [isReady] = useState(true);

  async function signUpWithEmail(email: string, password: string) {
    const normalized = email.trim().toLowerCase();
    if (!normalized || password.length < 6) {
      throw new Error("Use a valid email and a password with at least 6 characters.");
    }

    const users = readUsers();
    if (users.some((candidate) => candidate.email === normalized)) {
      throw new Error("Email already exists. Please log in.");
    }

    const updated = [...users, { email: normalized, password }];
    writeUsers(updated);
    localStorage.setItem(SESSION_KEY, normalized);
    setUser({ email: normalized });
  }

  async function signInWithEmail(email: string, password: string) {
    const normalized = email.trim().toLowerCase();
    const users = readUsers();

    const found = users.find((candidate) => candidate.email === normalized);
    if (!found || found.password !== password) {
      throw new Error("Invalid email or password.");
    }

    localStorage.setItem(SESSION_KEY, normalized);
    setUser({ email: normalized });
  }

  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      signUpWithEmail,
      signInWithEmail,
      signOut,
    }),
    [user, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
