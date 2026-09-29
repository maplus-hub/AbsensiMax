import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { authClient, authEnabled } from "./client";

export type AppUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  profileImageUrl: string | null;
  isDevFallback: false;
};

export type CurrentUserState = {
  user: AppUser | null;
  isPending: boolean;
};

function appUser(user: User | null): AppUser | null {
  if (!user) return null;
  const metadata = user.user_metadata;
  return {
    id: user.id,
    displayName:
      (typeof metadata.full_name === "string" && metadata.full_name) ||
      (typeof metadata.name === "string" && metadata.name) ||
      user.email?.split("@")[0] ||
      null,
    primaryEmail: user.email ?? null,
    profileImageUrl:
      (typeof metadata.avatar_url === "string" && metadata.avatar_url) ||
      (typeof metadata.picture === "string" && metadata.picture) ||
      null,
    isDevFallback: false,
  };
}

export function useCurrentUserState(): CurrentUserState {
  const [state, setState] = useState<CurrentUserState>({
    user: null,
    isPending: authEnabled,
  });

  useEffect(() => {
    if (!authEnabled) {
      setState({ user: null, isPending: false });
      return;
    }

    let revision = 0;
    const {
      data: { subscription },
    } = authClient.auth.onAuthStateChange((_event, session) => {
      revision += 1;
      setState({ user: appUser(session?.user ?? null), isPending: false });
    });
    const initialRevision = revision;
    void authClient.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("[auth] failed to read Supabase session:", error);
        setState({ user: null, isPending: false });
        return;
      }
      if (revision === initialRevision) {
        setState({ user: appUser(data.session?.user ?? null), isPending: false });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export function useCurrentUser(): AppUser | null {
  return useCurrentUserState().user;
}
