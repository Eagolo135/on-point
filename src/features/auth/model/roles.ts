export const ROLE_VALUES = ["anonymous", "user", "admin"] as const;

export type Role = (typeof ROLE_VALUES)[number];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && ROLE_VALUES.includes(value as Role);
}
