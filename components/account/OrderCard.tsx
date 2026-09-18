import Image from "next/image";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import { getOrderStatusMeta, getOrderStatusDate } from "@/lib/orders/status";
import { translations } from "@/lib/constants/translations";
import type { Order } from "@/lib/orders/types";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: Readonly<OrderCardProps>) {
  const { orders: t } = translations.account;
  const [firstItem] = order.items;
  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const heading =
    order.items.length === 1 ? firstItem.name : `${order.items.length} Items`;
  const subtitle = [
    `${totalQty} item${totalQty === 1 ? "" : "s"}`,
    order.items.length === 1 ? firstItem.subtitle : undefined,
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <div
      id={`order-card-${order.id}`}
      className="flex flex-col sm:flex-row sm:items-center gap-4 py-6 border-b border-gray-100 last:border-b-0"
    >
      <div
        id={`order-card-${order.id}-image`}
        className="relative w-20 h-20 bg-gray-50 overflow-hidden shrink-0"
      >
        {firstItem && (
          <Image
            src={firstItem.image}
            alt={heading}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div id={`order-card-${order.id}-details`} className="flex-1 min-w-0">
        <Text
          id={`order-card-${order.id}-heading`}
          variant="body"
          className="font-medium tracking-wide uppercase"
        >
          {heading}
        </Text>
        {subtitle && (
          <Text id={`order-card-${order.id}-subtitle`} variant="caption">
            {subtitle}
          </Text>
        )}
      </div>

      <div id={`order-card-${order.id}-price`} className="sm:w-28 shrink-0">
        <Text variant="body">
          {order.currency} {order.total.toLocaleString()}
        </Text>
      </div>

      <div
        id={`order-card-${order.id}-status`}
        className="flex flex-col items-start gap-1 sm:w-44 shrink-0"
      >
        <OrderStatusBadge
          id={`order-card-${order.id}-badge`}
          status={order.status}
        />
        <Text id={`order-card-${order.id}-date`} variant="caption">
          {getOrderStatusMeta(order.status).dateLabel}{" "}
          {getOrderStatusDate(order)}
        </Text>
      </div>

      <div id={`order-card-${order.id}-action`} className="shrink-0">
        <Button
          id={`order-card-${order.id}-view-details`}
          variant="outline"
          size="sm"
          className="uppercase tracking-wide"
          href={`/account/orders/${order.id}`}
        >
          {t.viewDetails}
        </Button>
      </div>
    </div>
  );
}
