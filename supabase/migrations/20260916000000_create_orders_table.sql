-- Orders table for the checkout / Razorpay integration.
-- No orders table existed previously in this project, so this creates one from scratch.
--
-- HOW TO APPLY:
--   Run this file's contents in the Supabase Dashboard -> SQL Editor for your project,
--   or via `supabase db push` if you have the Supabase CLI linked to this project.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

  -- Customer contact info (may differ from the shipping recipient below)
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,

  -- Shipping recipient + address, stored as a single JSON blob:
  -- { fullName, line1, line2?, city, state, pincode, phone }
  shipping_address jsonb not null,

  -- Snapshot of the cart at order time (product id, name, image, unit price, qty, currency).
  -- Snapshotting protects the order record if Sanity product data changes/is removed later.
  items jsonb not null,

  subtotal numeric(10, 2) not null check (subtotal >= 0),
  shipping_fee numeric(10, 2) not null default 0 check (shipping_fee >= 0),
  discount numeric(10, 2) not null default 0 check (discount >= 0),
  total numeric(10, 2) not null check (total >= 0),
  currency text not null default 'INR',

  status text not null default 'PENDING'
    check (status in ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
  payment_status text not null default 'PENDING'
    check (payment_status in ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),

  razorpay_order_id text unique,
  razorpay_payment_id text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_razorpay_order_id_idx on public.orders (razorpay_order_id);

-- Keep updated_at current on every row update.
create or replace function public.set_orders_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_orders_updated_at();

alter table public.orders enable row level security;

-- Users can only ever see their own orders.
drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Users can create orders for themselves (order creation happens via the
-- authenticated Route Handler in app/api/payments/create-order).
drop policy if exists "Users can create their own orders" on public.orders;
create policy "Users can create their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Users can update their own orders (payment verification updates go through
-- the authenticated Route Handler in app/api/payments/verify). The Razorpay
-- webhook uses the service-role client instead, which bypasses RLS.
drop policy if exists "Users can update their own orders" on public.orders;
create policy "Users can update their own orders"
  on public.orders for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
