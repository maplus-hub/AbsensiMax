import { createClient, type User } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./supabase-config";

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export class UnauthorizedError extends Error {
  readonly status = 401;

  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export async function verifyAccessToken(token: string | null | undefined): Promise<User> {
  if (!token) throw new UnauthorizedError();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new UnauthorizedError();
  return data.user;
}
