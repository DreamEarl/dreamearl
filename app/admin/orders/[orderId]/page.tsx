import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminOrderDetailsPanel from "@/components/admin/AdminOrderDetailsPanel";
import type { Order } from "@/lib/orders/types";

interface AdminOrderPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function AdminOrderPage({
  params,
}: Readonly<AdminOrderPageProps>) {
  const { orderId } = await params;
  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order) {
    notFound();
  }

  return <AdminOrderDetailsPanel order={order as Order} />;
}
