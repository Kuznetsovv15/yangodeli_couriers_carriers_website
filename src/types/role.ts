export const ROLES = ["pickers", "couriers", "support", "manager"] as const;

export type Role = (typeof ROLES)[number];

export function isRole(value: string | null | undefined): value is Role {
  return ROLES.includes(value as Role);
}
