import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrderStatusView from "@/components/checkout/OrderStatusView";
import type { Order } from "@/lib/orders/types";

interface OrderSuccessPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderSuccessPage({ params }: Readonly<OrderSuccessPageProps>) {
  const { orderId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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
  }

  return <OrderStatusView order={data as Order} />;
}
