-- Saved shipping addresses for the "Manage Addresses" account screen.
--
-- HOW TO APPLY:
--   Run this file's contents in the Supabase Dashboard -> SQL Editor for your project,
--   or via `supabase db push` if you have the Supabase CLI linked to this project.

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text,

  is_default boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists addresses_user_id_idx on public.addresses (user_id);

-- Only one default address per user.
create unique index if not exists addresses_one_default_per_user_idx
  on public.addresses (user_id)
  where is_default;

create or replace function public.set_addresses_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists addresses_set_updated_at on public.addresses;
create trigger addresses_set_updated_at
  before update on public.addresses
  for each row execute function public.set_addresses_updated_at();

alter table public.addresses enable row level security;

drop policy if exists "Users can view their own addresses" on public.addresses;
create policy "Users can view their own addresses"
  on public.addresses for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own addresses" on public.addresses;
create policy "Users can create their own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own addresses" on public.addresses;
create policy "Users can update their own addresses"
  on public.addresses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own addresses" on public.addresses;
create policy "Users can delete their own addresses"
  on public.addresses for delete
  using (auth.uid() = user_id);
