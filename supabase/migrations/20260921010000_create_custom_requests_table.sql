-- Custom requests submitted from the "Custom Order" form, tracked on the
-- "Custom Requests" account screen.
--
-- HOW TO APPLY:
--   Run this file's contents in the Supabase Dashboard -> SQL Editor for your project,
--   or via `supabase db push` if you have the Supabase CLI linked to this project.
--
-- Status is updated manually by an admin (e.g. via the Supabase Dashboard) as a
-- request progresses — there is no in-app admin UI for this yet.

create table if not exists public.custom_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

  product_type text not null,
  message text not null,
  image_url text,

  status text not null default 'PENDING'
    check (status in ('PENDING', 'IN_DISCUSSION', 'CONFIRMED', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists custom_requests_user_id_idx on public.custom_requests (user_id);

create or replace function public.set_custom_requests_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists custom_requests_set_updated_at on public.custom_requests;
create trigger custom_requests_set_updated_at
  before update on public.custom_requests
  for each row execute function public.set_custom_requests_updated_at();

alter table public.custom_requests enable row level security;

drop policy if exists "Users can view their own custom requests" on public.custom_requests;
create policy "Users can view their own custom requests"
  on public.custom_requests for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own custom requests" on public.custom_requests;
create policy "Users can create their own custom requests"
  on public.custom_requests for insert
  with check (auth.uid() = user_id);
