import type { Role, SessionProfile } from "./types";

const KEY = "absensimax.role";

export function readStoredRole(profile: SessionProfile): Role {
  const allowed = profile.roles;
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(KEY) as Role | null;
    if (stored && allowed.includes(stored)) return stored;
  }
  return allowed[0] ?? "guru";
}

export function storeRole(role: Role) {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, role);
}

export function homeForRole(role: Role): string {
  if (role === "admin") return "/admin";
  if (role === "wali") return "/wali";
  return "/guru";
}
