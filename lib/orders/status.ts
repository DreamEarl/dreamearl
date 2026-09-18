import type { Order, OrderStatus } from "@/lib/orders/types";

interface OrderStatusMeta {
  label: string;
  dotClassName: string;
  badgeClassName: string;
  dateLabel: string;
}

// Delivered/shipped/cancelled show when that happened (updated_at); everything else shows when it was placed.
const UPDATED_AT_STATUSES: Set<OrderStatus> = new Set([
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

const STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  PENDING: {
    label: "Pending",
    dotClassName: "bg-gray-400",
    badgeClassName: "bg-gray-100 text-gray-600",
    dateLabel: "Placed on",
  },
  CONFIRMED: {
    label: "Confirmed",
    dotClassName: "bg-amber-500",
    badgeClassName: "bg-amber-50 text-amber-700",
    dateLabel: "Placed on",
  },
  PROCESSING: {
    label: "Processing",
    dotClassName: "bg-rose-500",
    badgeClassName: "bg-rose-50 text-rose-700",
    dateLabel: "Placed on",
  },
  SHIPPED: {
    label: "Shipped",
    dotClassName: "bg-blue-500",
    badgeClassName: "bg-blue-50 text-blue-700",
    dateLabel: "Shipped on",
  },
  DELIVERED: {
    label: "Delivered",
    dotClassName: "bg-green-500",
    badgeClassName: "bg-green-50 text-green-700",
    dateLabel: "Delivered on",
  },
  CANCELLED: {
    label: "Cancelled",
    dotClassName: "bg-gray-400",
    badgeClassName: "bg-gray-100 text-gray-500",
    dateLabel: "Cancelled on",
  },
};

export function getOrderStatusMeta(status: OrderStatus): OrderStatusMeta {
  return STATUS_META[status];
}

export function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function getOrderStatusDate(order: Order): string {
  const iso = UPDATED_AT_STATUSES.has(order.status)
    ? order.updated_at
    : order.created_at;
  return formatOrderDate(iso);
}
