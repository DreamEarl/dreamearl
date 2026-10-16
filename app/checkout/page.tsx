import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDisplayName } from "@/lib/account/getDisplayName";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import type { Address } from "@/lib/addresses/types";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  return (
    <CheckoutClient
      defaultName={getDisplayName(user)}
      defaultEmail={user.email ?? ""}
      addresses={(addresses ?? []) as Address[]}
    />
  );
}
