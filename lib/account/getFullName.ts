import type { User } from "@supabase/supabase-js";

// Combines first/last name metadata for the full name shown in the account sidebar
export function getFullName(user: User): string {
  const metadata = user.user_metadata as Record<string, unknown>;

  const firstName =
    typeof metadata.first_name === "string" ? metadata.first_name.trim() : "";
  const lastName =
    typeof metadata.last_name === "string" ? metadata.last_name.trim() : "";
  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(" ");
  }

  const fullName = metadata.full_name ?? metadata.name;
  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim();
  }

  return user.email?.split("@")[0] ?? "there";
}
