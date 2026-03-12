"use client";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type Auth,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getFirebaseAuthClient } from "@/lib/firebase/firebase-client";

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
  isCalendarScopeGranted: boolean;
  googleAccessToken: string | null;
  signInWithGoogle: () => Promise<void>;
  refreshGoogleAccessToken: () => Promise<void>;
  updateAppUserData: (patch: Partial<OnPointUserData>) => void;
  signOut: () => void;
};

const SESSION_KEY = "onpoint_auth_session";
const ACCESS_TOKEN_KEY = "onpoint_google_access_token";

function appDataKey(uid: string) {
  return `onpoint_app_user_data_${uid}`;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email ?? "",
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

function defaultAppUserData(): OnPointUserData {
  return {
    theme: "dark-gold",
    createdAtIso: new Date().toISOString(),
    preferences: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const firebaseAuth = useMemo<Auth | null>(() => {
    try {
      return getFirebaseAuthClient();
    } catch {
      return null;
    }
  }, []);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [appUserData, setAppUserData] = useState<OnPointUserData | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(() => !firebaseAuth);
  const [isCalendarScopeGranted, setIsCalendarScopeGranted] = useState(false);

  useEffect(() => {
    if (!firebaseAuth) {
      return;
    }

    const unsub = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setAppUserData(null);
        setGoogleAccessToken(null);
        setIsCalendarScopeGranted(false);
        setIsReady(true);
        return;
      }

      const mappedUser = toAuthUser(firebaseUser);
      setUser(mappedUser);

      const rawStored = localStorage.getItem(appDataKey(mappedUser.uid));
      if (rawStored) {
        try {
          setAppUserData(JSON.parse(rawStored) as OnPointUserData);
        } catch {
          const fallback = defaultAppUserData();
          localStorage.setItem(appDataKey(mappedUser.uid), JSON.stringify(fallback));
          setAppUserData(fallback);
        }
      } else {
        const created = defaultAppUserData();
        localStorage.setItem(appDataKey(mappedUser.uid), JSON.stringify(created));
        setAppUserData(created);
      }

      const storedAccessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
      setGoogleAccessToken(storedAccessToken);
      setIsCalendarScopeGranted(Boolean(storedAccessToken));
      localStorage.setItem(SESSION_KEY, mappedUser.email);
      setIsReady(true);
    });

    return () => unsub();
  }, [firebaseAuth]);

  async function signInWithGoogle() {
    if (!firebaseAuth) {
      throw new Error("Firebase auth is not configured. Add NEXT_PUBLIC_FIREBASE_* variables.");
    }

    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/calendar");
    provider.setCustomParameters({ prompt: "consent" });

    const result = await signInWithPopup(firebaseAuth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken ?? null;

    if (!token) {
      throw new Error("Google sign-in succeeded, but Calendar scope token was not returned.");
    }

    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    setGoogleAccessToken(token);
    setIsCalendarScopeGranted(true);
  }

  async function refreshGoogleAccessToken() {
    if (!firebaseAuth) {
      throw new Error("Firebase auth is not configured.");
    }

    if (!firebaseAuth.currentUser) {
      throw new Error("No active user session.");
    }

    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/calendar");
    provider.setCustomParameters({ prompt: "consent" });

    const result = await signInWithPopup(firebaseAuth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken ?? null;

    if (!token) {
      throw new Error("Calendar token refresh failed.");
    }

    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    setGoogleAccessToken(token);
    setIsCalendarScopeGranted(true);
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
    if (firebaseAuth) {
      void firebaseSignOut(firebaseAuth);
    }
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    setUser(null);
    setAppUserData(null);
    setGoogleAccessToken(null);
    setIsCalendarScopeGranted(false);
  }

  const value: AuthContextValue = {
    user,
    appUserData,
    isReady,
    isCalendarScopeGranted,
    googleAccessToken,
    signInWithGoogle,
    refreshGoogleAccessToken,
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
