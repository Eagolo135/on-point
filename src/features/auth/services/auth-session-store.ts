import { isRole } from "@/features/auth/model/roles";
import type { AuthSession } from "@/features/auth/model/session";

export const SESSION_STORAGE_KEY = "onpoint_auth_session_v2";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!isObject(value)) {
    return false;
  }

  const role = value.role;
  if (!isRole(role)) {
    return false;
  }

  if (typeof value.sessionId !== "string" || typeof value.createdAtIso !== "string") {
    return false;
  }

  if (role === "anonymous") {
    return typeof value.anonymousId === "string";
  }

  if (!isObject(value.user)) {
    return false;
  }

  return typeof value.user.uid === "string" && typeof value.user.email === "string";
}

export function readStoredSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isAuthSession(parsed)) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function writeStoredSession(session: AuthSession): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(SESSION_STORAGE_KEY);
}
