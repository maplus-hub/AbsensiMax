import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useSchool } from "./context";
import { homeForRole } from "./role";
import type { Role } from "./types";

export function RoleGuard({ role, children }: { role: Role; children: ReactNode }) {
  const { profile } = useSchool();
  if (!profile.roles.includes(role)) {
    return <Navigate to={homeForRole(profile.roles[0] ?? "guru")} />;
  }
  return <>{children}</>;
}
