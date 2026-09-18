import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import { formatOrderDate } from "@/lib/orders/status";
import { getOrderTimeline } from "@/lib/orders/timeline";
import { translations } from "@/lib/constants/translations";
import type { Order } from "@/lib/orders/types";

interface OrderDetailsPanelProps {
  order: Order;
}

export default function OrderDetailsPanel({
  order,
}: Readonly<OrderDetailsPanelProps>) {
  const { account, footer } = translations;
  const t = account.orderDetails;
  const orderCode = order.id.slice(0, 8).toUpperCase();
  const timeline = getOrderTimeline(order);
  const address = order.shipping_address;

  return (
    <div id="order-details-panel">
      <Heading
        id="order-details-panel-title"
        variant="cart"
        className="border-b border-black inline-block pb-2 mb-6 uppercase"
      >
        {t.title}
      </Heading>

      <div className="flex items-start justify-between mb-6">
        <div>
          <Text
            id="order-details-panel-order-number"
            variant="body"
            className="font-medium"
          >
            {t.orderNumber}
            {orderCode}
          </Text>
          <Text id="order-details-panel-placed-on" variant="caption">
            {t.placedOn} {formatOrderDate(order.created_at)}
          </Text>
        </div>
        <OrderStatusBadge
          id="order-details-panel-status"
          status={order.status}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          id="order-details-panel-items"
          className="md:col-span-2 border border-gray-200 p-6"
        >
          <Text variant="label" className="font-medium text-black mb-4">
            {t.itemsTitle}
          </Text>

          <ul
            id="order-details-panel-items-list"
            className="divide-y divide-gray-100"
          >
            {order.items.map((item) => (
              <li key={item.productId} className="flex gap-4 py-4 first:pt-0">
                <div className="relative w-20 h-20 bg-gray-50 overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <Text variant="body" className="font-medium">
                    {item.name}
                  </Text>
                  <Text variant="caption">
                    {item.currency} {item.price.toLocaleString()}
                  </Text>
                  <Text variant="caption">
                    {t.quantity} {item.quantity}
                  </Text>
                  {item.color && (
                    <Text variant="caption">
                      {t.colour} {item.color}
                    </Text>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div
            id="order-details-panel-totals"
            className="border-t border-gray-100 pt-4 mt-2 space-y-2"
          >
            <div className="flex justify-between">
              <Text variant="caption">{t.subtotal}</Text>
              <Text variant="caption">
                {order.currency} {order.subtotal.toLocaleString()}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text variant="caption">{t.shipping}</Text>
              <Text variant="caption">
                {order.shipping_fee > 0
                  ? `${order.currency} ${order.shipping_fee.toLocaleString()}`
                  : t.free}
              </Text>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <Text variant="caption">{t.discount}</Text>
                <Text variant="caption">
                  -{order.currency} {order.discount.toLocaleString()}
                </Text>
              </div>
            )}
            <div className="flex justify-between">
              <Text variant="body" className="font-medium">
                {t.totalPaid}
              </Text>
              <Text variant="body" className="font-medium">
                {order.currency} {order.total.toLocaleString()}
              </Text>
            </div>
          </div>
        </div>

        <div
          id="order-details-panel-timeline"
          className="border border-gray-200 p-6"
        >
          <Text variant="label" className="font-medium text-black mb-4">
            {t.timelineTitle}
          </Text>
          <ol id="order-details-panel-timeline-list">
            {timeline.map((step, index) => (
              <li key={step.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      step.isComplete ? "bg-[#5f1631]" : "bg-gray-200"
                    }`}
                  />
                  {index < timeline.length - 1 && (
                    <span
                      className={`w-px flex-1 ${
                        step.isComplete ? "bg-[#5f1631]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-6">
                  <Text
                    variant="body"
                    className={
                      step.isComplete ? "font-medium" : "text-gray-400"
                    }
                  >
                    {step.label}
                  </Text>
                  {step.timestamp && (
                    <Text variant="caption">{step.timestamp}</Text>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          id="order-details-panel-address"
          className="border border-gray-200 p-6"
        >
          <Text variant="label" className="font-medium text-black mb-4">
            {t.shippingAddressTitle}
          </Text>
          <Text variant="body" className="text-gray-700">
            {address.fullName}
            <br />
            {address.line1}
            {address.line2 ? <>, {address.line2}</> : null}
            <br />
            {address.city}, {address.state} &ndash; {address.pincode}
            <br />
            {address.phone}
          </Text>
        </div>

        <div
          id="order-details-panel-help"
          className="border border-gray-200 p-6"
        >
          <Text variant="label" className="font-medium text-black mb-2">
            {t.needHelpTitle}
          </Text>
          <Text variant="caption" className="mb-4">
            {t.needHelpMessage}
          </Text>
          <Button
            id="order-details-panel-help-contact"
            variant="primary"
            size="sm"
            href={`mailto:${footer.contactUs.email}`}
          >
            {t.contactUs}
          </Button>
        </div>
      </div>
    </div>
  );
}
