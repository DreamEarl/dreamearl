-- Enhances custom_requests to support multiple reference images, a contact-info
-- snapshot (so admins don't need to join auth.users to see who asked), and a
-- DECLINED status with a mandatory reason an admin must give when declining.
--
-- HOW TO APPLY:
--   Run this file's contents in the Supabase Dashboard -> SQL Editor for your project,
--   or via `supabase db push` if you have the Supabase CLI linked to this project.

alter table public.custom_requests
  add column if not exists full_name text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists image_urls text[] not null default '{}',
  add column if not exists decline_reason text;

-- Backfill the new array column from the old single-image column, then drop it.
update public.custom_requests
  set image_urls = array[image_url]
  where image_url is not null and image_urls = '{}';

alter table public.custom_requests drop column if exists image_url;

alter table public.custom_requests drop constraint if exists custom_requests_status_check;
alter table public.custom_requests add constraint custom_requests_status_check
  check (status in ('PENDING', 'IN_DISCUSSION', 'CONFIRMED', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED', 'DECLINED'));

-- A decline must always carry a reason; non-declined rows should not keep a stale one.
alter table public.custom_requests drop constraint if exists custom_requests_decline_reason_check;
alter table public.custom_requests add constraint custom_requests_decline_reason_check
  check (
    (status = 'DECLINED' and decline_reason is not null and length(trim(decline_reason)) > 0)
    or (status <> 'DECLINED' and decline_reason is null)
  );

-- Status (and decline_reason) are updated by an admin via the /admin/custom-requests
-- UI, which uses the service-role client (bypasses RLS, gated by the public.admins
-- check in application code) — no RLS update policy is added here, same as orders.
