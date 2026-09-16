import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDisplayName } from "@/lib/account/getDisplayName";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <CheckoutClient defaultName={getDisplayName(user)} defaultEmail={user.email ?? ""} />
  );
}
