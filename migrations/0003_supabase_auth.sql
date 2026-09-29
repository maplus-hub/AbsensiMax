-- Store verified Supabase user details for the school onboarding flow.
create table if not exists app_users (
  id text primary key,
  name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Application queries run in the authenticated Supabase Edge Function. Clients
-- do not receive direct table grants or a PostgreSQL connection string.
alter table schools enable row level security;
alter table staff enable row level security;
alter table classes enable row level security;
alter table subjects enable row level security;
alter table students enable row level security;
alter table schedules enable row level security;
alter table teacher_attendance enable row level security;
alter table leave_requests enable row level security;
alter table student_attendance enable row level security;
alter table app_users enable row level security;

do $$
declare
  role_name text;
begin
  foreach role_name in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = role_name) then
      execute format(
        'revoke all on all tables in schema public from %I',
        role_name
      );
      execute format(
        'revoke all on all sequences in schema public from %I',
        role_name
      );
      execute format(
        'alter default privileges in schema public revoke all on tables from %I',
        role_name
      );
      execute format(
        'alter default privileges in schema public revoke all on sequences from %I',
        role_name
      );
    end if;
  end loop;
end
$$;
