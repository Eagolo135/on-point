import type { Role } from "@/features/auth/model/roles";

export type AuthUserIdentity = {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
};

type SessionBase = {
  sessionId: string;
  createdAtIso: string;
  role: Role;
};

export type AnonymousSession = SessionBase & {
  role: "anonymous";
  anonymousId: string;
};

export type AuthenticatedSession = SessionBase & {
  role: "user" | "admin";
  user: AuthUserIdentity;
};

export type AuthSession = AnonymousSession | AuthenticatedSession;

export type SessionTransitionInput = {
  user: AuthUserIdentity;
  role?: "user" | "admin";
};
