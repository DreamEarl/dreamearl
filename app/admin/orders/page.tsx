import { createAdminClient } from "@/lib/supabase/admin";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import { ORDER_STATUSES } from "@/lib/orders/types";
import type { Order, OrderStatus } from "@/lib/orders/types";

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

function toStatusFilter(value: string | undefined): OrderStatus | "ALL" {
  return (ORDER_STATUSES as readonly string[]).includes(value ?? "")
    ? (value as OrderStatus)
    : "ALL";
}

export default async function AdminOrdersPage({
  searchParams,
}: Readonly<AdminOrdersPageProps>) {
  const resolved = await searchParams;
  const statusFilter = toStatusFilter(resolved?.status);
  const query = resolved?.q?.trim() ?? "";

  const admin = createAdminClient();
  let request = admin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (statusFilter !== "ALL") {
    request = request.eq("status", statusFilter);
  }

  const { data } = await request;
  const orders = (data ?? []) as Order[];

  // Filtered in JS rather than via PostgREST `.or()` to avoid building raw filter
  // strings out of free-text admin input (query syntax injection into the filter).
  const filteredOrders = query
    ? orders.filter((order) => {
        const needle = query.toLowerCase();
        return (
          order.customer_name.toLowerCase().includes(needle) ||
          order.customer_email.toLowerCase().includes(needle) ||
          order.id.toLowerCase().includes(needle)
        );
      })
    : orders;

  return (
    <AdminOrdersTable
      orders={filteredOrders}
      statusFilter={statusFilter}
      query={query}
    />
  );
}
