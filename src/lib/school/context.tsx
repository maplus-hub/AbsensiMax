import { createContext, useContext } from "react";
import type { Role, SessionProfile } from "./types";

export type SchoolCtx = {
  profile: SessionProfile;
  role: Role;
  setRole: (role: Role) => void;
  reload: () => void;
};

export const SchoolContext = createContext<SchoolCtx | null>(null);

export function useSchool() {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error("useSchool must be used inside the app shell");
  return ctx;
}
