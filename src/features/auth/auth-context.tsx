"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthUser = {
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  isGoogleReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
};
const SESSION_KEY = "onpoint_auth_session";
const GOOGLE_SCRIPT_ID = "google-identity-services-auth";

type GoogleCredentialResponse = {
  credential?: string;
};

type GooglePromptNotification = {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
};

type GoogleIdWindow = Window & {
  google?: {
    accounts: {
      id: {
        initialize: (options: {
          client_id: string;
          callback: (response: GoogleCredentialResponse) => void;
        }) => void;
        prompt: (momentListener?: (notification: GooglePromptNotification) => void) => void;
      };
    };
  };
};

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const chunks = token.split(".");
  if (chunks.length < 2) {
    return null;
  }

  try {
    const base64 = chunks[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = window.atob(base64);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const rawSession = localStorage.getItem(SESSION_KEY);
    return rawSession ? { email: rawSession } : null;
  });
  const [isReady] = useState(true);
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  useEffect(() => {
    const googleWindow = window as GoogleIdWindow;
    if (googleWindow.google?.accounts.id) {
      setIsGoogleReady(true);
      return;
    }

    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => setIsGoogleReady(true), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleReady(true);
    document.head.appendChild(script);
  }, []);

  async function signInWithGoogle() {
    if (!googleClientId) {
      throw new Error("Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable Google sign-in.");
    }

    const googleWindow = window as GoogleIdWindow;
    if (!googleWindow.google?.accounts.id) {
      throw new Error("Google sign-in is still loading. Try again in a moment.");
    }

    await new Promise<void>((resolve, reject) => {
      googleWindow.google?.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          try {
            if (!response.credential) {
              throw new Error("Google sign-in failed.");
            }

            const payload = decodeJwtPayload(response.credential);
            const email = typeof payload?.email === "string" ? payload.email.toLowerCase() : null;

            if (!email) {
              throw new Error("Could not read Google account email.");
            }

            localStorage.setItem(SESSION_KEY, email);
            setUser({ email });
            resolve();
          } catch (caughtError) {
            reject(caughtError instanceof Error ? caughtError : new Error("Google authentication failed."));
          }
        },
      });

      googleWindow.google?.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error("Google prompt was dismissed or blocked by the browser."));
        }
      });
    });
  }

  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    isReady,
    isGoogleReady,
    signInWithGoogle,
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
