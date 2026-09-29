import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY wajib diatur.");
}

export const authEnabled = import.meta.env.VITE_AUTH_ENABLED !== "false";

export const authClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    persistSession: true,
  },
});

export async function getAccessToken(): Promise<string | null> {
  const { data, error } = await authClient.auth.getSession();
  if (error) throw error;
  return data.session?.access_token ?? null;
}

export async function signOut(redirectTo = "/login"): Promise<void> {
  const { error } = await authClient.auth.signOut();
  if (error) throw error;
  if (typeof window !== "undefined") window.location.assign(redirectTo);
}
