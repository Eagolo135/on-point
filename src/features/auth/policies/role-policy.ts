import type { AuthSession } from "@/features/auth/model/session";
import type { Role } from "@/features/auth/model/roles";

export type RolePolicy = {
  resolveRole: (session: AuthSession | null) => Role;
  hasRole: (session: AuthSession | null, roles: Role[]) => boolean;
};

export const rolePolicy: RolePolicy = {
  resolveRole(session) {
    return session?.role ?? "anonymous";
  },
  hasRole(session, roles) {
    const role = session?.role ?? "anonymous";
    return roles.includes(role);
  },
};
