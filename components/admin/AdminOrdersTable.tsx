import Link from "next/link";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import { formatOrderDate } from "@/lib/orders/status";
import { ORDER_STATUSES } from "@/lib/orders/types";
import type { Order, OrderStatus } from "@/lib/orders/types";

interface AdminOrdersTableProps {
  orders: Order[];
  statusFilter: OrderStatus | "ALL";
  query: string;
}

const STATUS_FILTERS: Array<OrderStatus | "ALL"> = ["ALL", ...ORDER_STATUSES];

function filterHref(status: OrderStatus | "ALL", query: string): string {
  const params = new URLSearchParams();
  if (status !== "ALL") params.set("status", status);
  if (query) params.set("q", query);
  const qs = params.toString();
  return qs ? `/admin/orders?${qs}` : "/admin/orders";
}

export default function AdminOrdersTable({
  orders,
  statusFilter,
  query,
}: Readonly<AdminOrdersTableProps>) {
  return (
    <div id="admin-orders-page">
      <Heading
        id="admin-orders-title"
        variant="cart"
        className="border-b border-black inline-block pb-2 mb-6 uppercase"
      >
        Orders
      </Heading>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div id="admin-orders-status-filters" className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => {
            const isActive = status === statusFilter;
            return (
              <Link
                key={status}
                id={`admin-orders-filter-${status}`}
                href={filterHref(status, query)}
                className={`px-3 py-1 text-xs uppercase tracking-wide border ${
                  isActive
                    ? "bg-[#5f1631] text-white border-[#5f1631]"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {status === "ALL" ? "All" : status}
              </Link>
            );
          })}
        </div>

        <form id="admin-orders-search" method="get" className="flex gap-2">
          {statusFilter !== "ALL" && (
            <input type="hidden" name="status" value={statusFilter} />
          )}
          <input
            id="admin-orders-search-input"
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search name, email or order id"
            className="border border-gray-300 px-3 py-1.5 text-sm w-64"
          />
          <button
            id="admin-orders-search-submit"
            type="submit"
            className="px-3 py-1.5 text-xs uppercase border border-black hover:bg-gray-50"
          >
            Search
          </button>
        </form>
      </div>

      {orders.length === 0 ? (
        <Text id="admin-orders-empty" variant="muted">
          No orders found.
        </Text>
      ) : (
        <div
          id="admin-orders-list"
          className="divide-y divide-gray-100 border border-gray-200"
        >
          <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-3 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <span className="col-span-2">Customer</span>
            <span>Placed On</span>
            <span>Total</span>
            <span>Status</span>
            <span>Payment</span>
          </div>
          {orders.map((order) => (
            <Link
              key={order.id}
              id={`admin-order-row-${order.id}`}
              href={`/admin/orders/${order.id}`}
              className="grid grid-cols-2 md:grid-cols-6 gap-4 px-4 py-4 hover:bg-gray-50"
            >
              <div className="col-span-2">
                <Text variant="body" className="font-medium">
                  {order.customer_name}
                </Text>
                <Text variant="caption">{order.customer_email}</Text>
                <Text variant="caption">
                  #{order.id.slice(0, 8).toUpperCase()}
                </Text>
              </div>
              <Text variant="caption" className="self-center">
                {formatOrderDate(order.created_at)}
              </Text>
              <Text variant="caption" className="self-center">
                {order.currency} {order.total.toLocaleString()}
              </Text>
              <div className="self-center">
                <OrderStatusBadge
                  id={`admin-order-row-${order.id}-status`}
                  status={order.status}
                />
              </div>
              <Text variant="caption" className="self-center">
                {order.payment_status}
              </Text>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
