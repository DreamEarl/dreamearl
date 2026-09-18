import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFullName } from "@/lib/account/getFullName";
import { getInitials } from "@/lib/account/getInitials";
import AccountShell from "@/components/account/AccountShell";
import OrderDetailsPanel from "@/components/account/OrderDetailsPanel";
import type { Order } from "@/lib/orders/types";

interface OrderDetailsPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailsPage({
  params,
}: Readonly<OrderDetailsPageProps>) {
  const { orderId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
    return null;
  }

  // Fetched fresh from Supabase (never trust the URL alone) — RLS also enforces ownership.
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    notFound();
    return null;
  }

  const name = getFullName(user);

  return (
    <AccountShell
      name={name}
      email={user.email ?? ""}
      initials={getInitials(name)}
      activeTab="orders"
    >
      <OrderDetailsPanel order={data as Order} />
    </AccountShell>
  );
}
