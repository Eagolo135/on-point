import type { AuthUserIdentity, AuthSession, SessionTransitionInput } from "@/features/auth/model/session";
import { clearLegacySession, readLegacySession } from "@/features/auth/services/legacy-session-adapter";
import { clearStoredSession, readStoredSession, writeStoredSession } from "@/features/auth/services/auth-session-store";

function createAnonymousSession(): AuthSession {
  const sessionId = `anon-${crypto.randomUUID()}`;
  return {
    sessionId,
    createdAtIso: new Date().toISOString(),
    role: "anonymous",
    anonymousId: sessionId,
  };
}

export function readAuthSession(): AuthSession {
  const current = readStoredSession();
  if (current) {
    return current;
  }

  const legacy = readLegacySession();
  if (legacy) {
    writeStoredSession(legacy);
    clearLegacySession();
    return legacy;
  }

  const anonymous = createAnonymousSession();
  writeStoredSession(anonymous);
  return anonymous;
}

export function persistAuthSession(session: AuthSession): void {
  writeStoredSession(session);
}

export function clearAuthSession(): void {
  clearStoredSession();
  clearLegacySession();
}

export function transitionToAuthenticated(input: SessionTransitionInput): AuthSession {
  const role = input.role ?? "user";

  return {
    sessionId: `auth-${input.user.uid}`,
    createdAtIso: new Date().toISOString(),
    role,
    user: normalizeIdentity(input.user),
  };
}

function normalizeIdentity(user: AuthUserIdentity): AuthUserIdentity {
  return {
    uid: user.uid.trim(),
    email: user.email.trim().toLowerCase(),
    displayName: user.displayName?.trim() || null,
    photoURL: user.photoURL ?? null,
  };
}
