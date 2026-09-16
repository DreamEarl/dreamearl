import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client for trusted server-only contexts (e.g. the Razorpay webhook,
// which has no user session to authenticate with). Bypasses Row Level Security.
// NEVER import this from a Client Component or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
