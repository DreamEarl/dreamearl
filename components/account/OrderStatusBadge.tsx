import { getOrderStatusMeta } from "@/lib/orders/status";
import type { OrderStatus } from "@/lib/orders/types";

interface OrderStatusBadgeProps {
  id: string;
  status: OrderStatus;
}

export default function OrderStatusBadge({
  id,
  status,
}: Readonly<OrderStatusBadgeProps>) {
  const meta = getOrderStatusMeta(status);

  return (
    <span
      id={id}
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs tracking-wide uppercase ${meta.badgeClassName}`}
    >
      <span
        id={`${id}-dot`}
        className={`w-1.5 h-1.5 rounded-full ${meta.dotClassName}`}
      />
      {meta.label}
    </span>
  );
}
