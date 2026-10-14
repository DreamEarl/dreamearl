import { createAdminClient } from "@/lib/supabase/admin";

// Admin access is gated by rows in public.admins (not env config or a role claim), so there is
// no self-service way for a customer to grant themselves access — see the migration for how to
// add an admin. Uses the service-role client since regular users have no RLS grant to read it.
export async function isAdmin(
  userId: string | null | undefined,
): Promise<boolean> {
  if (!userId) return false;

  const admin = createAdminClient();
  const { data } = await admin
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  return data !== null;
}
