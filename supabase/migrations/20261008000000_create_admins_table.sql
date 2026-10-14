-- Table of users allowed to access /admin and manage orders. There is no
-- self-service way to become an admin — rows are added manually (Supabase
-- Dashboard -> Table Editor, or another admin via SQL), same convention as
-- custom_requests.status.
--
-- HOW TO APPLY:
--   Run this file's contents in the Supabase Dashboard -> SQL Editor for your project,
--   or via `supabase db push` if you have the Supabase CLI linked to this project.

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- No policies are defined on purpose: this table is only ever read via the
-- service-role client (lib/supabase/admin.ts's createAdminClient(), which
-- bypasses RLS). Regular authenticated/anon roles get zero access by default.

-- Seed the first admin from the account that was previously allowlisted via
-- the ADMIN_EMAILS env var. Safe to re-run; does nothing if the user doesn't
-- exist yet or is already seeded.
insert into public.admins (user_id, email)
select id, email
from auth.users
where email = 'saloniagrawal250797@gmail.com'
on conflict (user_id) do nothing;

-- To grant admin access to someone else later, run:
--   insert into public.admins (user_id, email)
--   select id, email from auth.users where email = 'new-owner@example.com';
