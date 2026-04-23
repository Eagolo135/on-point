import type { Role } from "@/features/auth/model/roles";

export type MiddlewareSubject = {
  role: Role;
  uid?: string;
};

export type MiddlewareRouteRule = {
  routePattern: string;
  allow: Role[];
};

export type MiddlewareAuthorizationDecision = {
  allowed: boolean;
  reason?: "unauthenticated" | "forbidden";
  redirectTo?: string;
};
