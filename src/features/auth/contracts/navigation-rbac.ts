import type { Role } from "@/features/auth/model/roles";

export type NavigationAccessRule = {
  href: string;
  visibleTo: Role[];
};

export type NavigationAccessPolicy = {
  canView: (href: string, role: Role) => boolean;
};
