import type { Order, OrderStatus } from "@/lib/orders/types";

export interface TimelineStep {
  key: string;
  label: string;
  timestamp: string | null;
  isComplete: boolean;
}

const PIPELINE: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

const STEP_LABELS: Record<OrderStatus, string> = {
  PENDING: "Order Placed",
  CONFIRMED: "Order Placed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

// We only store the current status (not a full history), so only the placed
// step and the current step have real timestamps; steps in between are shown
// as complete without a specific time.
export function getOrderTimeline(order: Order): TimelineStep[] {
  if (order.status === "CANCELLED") {
    return [
      {
        key: "PENDING",
        label: STEP_LABELS.PENDING,
        timestamp: formatDateTime(order.created_at),
        isComplete: true,
      },
      {
        key: "CANCELLED",
        label: STEP_LABELS.CANCELLED,
        timestamp: formatDateTime(order.updated_at),
        isComplete: true,
      },
    ];
  }

  const currentIndex = PIPELINE.indexOf(
    order.status === "CONFIRMED" ? "PENDING" : order.status,
  );

  return PIPELINE.map((status, index) => {
    const isComplete = index <= currentIndex;
    let timestamp: string | null = null;
    if (isComplete) {
      if (index === 0) timestamp = formatDateTime(order.created_at);
      else if (index === currentIndex)
        timestamp = formatDateTime(order.updated_at);
    }

    return {
      key: status,
      label: STEP_LABELS[status],
      isComplete,
      timestamp,
    };
  });
}
