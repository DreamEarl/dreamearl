import type { User } from "@supabase/supabase-js";

// Prefers the sign-up first name, then falls back to OAuth/profile data
export function getDisplayName(user: User): string {
  const metadata = user.user_metadata as Record<string, unknown>;

  const firstName = metadata.first_name;
  if (typeof firstName === "string" && firstName.trim()) {
    return firstName.trim();
  }

  const fullName = metadata.full_name ?? metadata.name;
  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim().split(" ")[0];
  }

  return user.email?.split("@")[0] ?? "there";
}
