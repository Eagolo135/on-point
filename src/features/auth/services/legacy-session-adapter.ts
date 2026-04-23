import type { AuthUserIdentity, AuthSession } from "@/features/auth/model/session";

export const LEGACY_SESSION_KEY = "onpoint_auth_session";

type LegacySessionUser = {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
};

function isLegacySessionUser(value: unknown): value is LegacySessionUser {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.uid === "string" && typeof candidate.email === "string";
}

function toIdentity(user: LegacySessionUser): AuthUserIdentity {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
  };
}

export function readLegacySession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(LEGACY_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isLegacySessionUser(parsed)) {
      localStorage.removeItem(LEGACY_SESSION_KEY);
      return null;
    }

    return {
      sessionId: `legacy-${parsed.uid}`,
      createdAtIso: new Date().toISOString(),
      role: "user",
      user: toIdentity(parsed),
    };
  } catch {
    localStorage.removeItem(LEGACY_SESSION_KEY);
    return null;
  }
}

export function clearLegacySession(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(LEGACY_SESSION_KEY);
}
