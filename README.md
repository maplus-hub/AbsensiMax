# AbsensiMax

AbsensiMax uses Supabase Auth for email/password accounts and PostgreSQL for
school and attendance data. The school API verifies each Supabase access token
on the server before loading or changing a user's school profile.

## Supabase configuration

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are public client settings.
  The local app-builder preview reads them from `.grok/app-env.json`.
- Set `DATABASE_URL` in the deployment environment to the Supabase PostgreSQL
  pooler connection string. Keep it private; the application uses it only on
  the server to run migrations and execute authorized queries.
- Configure the Supabase Auth site URL and allowed redirect URLs for the
  deployed app origin. Email confirmation and SMTP delivery are controlled in
  the Supabase project settings.

`npm run build` applies the SQL migrations to `DATABASE_URL`. The migration
enables row-level security and revokes direct table access from the Supabase
`anon` and `authenticated` API roles; app data is accessed through the
authenticated server functions.

Accounts must be created again in Supabase Auth. Existing school and attendance
records are not copied; the Supabase database starts with a fresh schema.
