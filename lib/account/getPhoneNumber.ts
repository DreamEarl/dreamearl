import type { User } from "@supabase/supabase-js";

// Prefers the sign-up phone metadata, then falls back to the verified auth phone
export function getPhoneNumber(user: User): string {
  const metadata = user.user_metadata as Record<string, unknown>;
  const phone = metadata.phone;
  if (typeof phone === "string" && phone.trim()) return phone.trim();
  return user.phone ?? "";
}
