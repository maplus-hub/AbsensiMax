import { createMiddleware } from "@tanstack/react-start";

export const authMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { getAccessToken } = await import("./client");
    return next({ sendContext: { supabaseAccessToken: await getAccessToken() } });
  })
  .server(async ({ next, context }) => {
    const { assertSameSiteRequest } = await import("./isolation.server");
    const { verifyAccessToken } = await import("./verify.server");
    assertSameSiteRequest();
    const user = await verifyAccessToken(context.supabaseAccessToken);
    const sql = await (await import("@/lib/db")).getSql();
    const email = user.email ?? "";
    const metadataName = user.user_metadata?.name ?? user.user_metadata?.full_name;
    const name =
      (typeof metadataName === "string" && metadataName.trim()) ||
      email.split("@")[0] ||
      "Pengguna";
    await sql`
      insert into app_users (id, name, email)
      values (${user.id}, ${name}, ${email})
      on conflict (id) do update
      set name = excluded.name, email = excluded.email, updated_at = now()
      where app_users.name is distinct from excluded.name
        or app_users.email is distinct from excluded.email
    `;
    return next({ context: { userId: user.id } });
  });
