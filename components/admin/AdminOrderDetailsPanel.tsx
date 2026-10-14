"use client";

import { useState } from "react";
import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import { formatOrderDate } from "@/lib/orders/status";
import { ORDER_STATUSES } from "@/lib/orders/types";
import type { Order, OrderStatus } from "@/lib/orders/types";

interface AdminOrderDetailsPanelProps {
  order: Order;
}

export default function AdminOrderDetailsPanel({
  order: initialOrder,
}: Readonly<AdminOrderDetailsPanelProps>) {
  const [order, setOrder] = useState(initialOrder);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    initialOrder.status,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const orderCode = order.id.slice(0, 8).toUpperCase();
  const address = order.shipping_address;

  const handleUpdateStatus = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setOrder(data.order);
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="admin-order-details-panel">
      <Heading
        id="admin-order-details-title"
        variant="cart"
        className="border-b border-black inline-block pb-2 mb-6 uppercase"
      >
        Order Details
      </Heading>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <Text
            id="admin-order-details-order-number"
            variant="body"
            className="font-medium"
          >
            Order #{orderCode}
          </Text>
          <Text id="admin-order-details-placed-on" variant="caption">
            Placed on {formatOrderDate(order.created_at)}
          </Text>
        </div>
        <OrderStatusBadge
          id="admin-order-details-status"
          status={order.status}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          id="admin-order-details-items"
          className="md:col-span-2 border border-gray-200 p-6"
        >
          <Text variant="label" className="font-medium text-black mb-4">
            Items
          </Text>
          <ul className="divide-y divide-gray-100">
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
                  <Text variant="caption">Quantity: {item.quantity}</Text>
                  {item.color && (
                    <Text variant="caption">Colour: {item.color}</Text>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 pt-4 mt-2 space-y-2">
            <div className="flex justify-between">
              <Text variant="caption">Subtotal</Text>
              <Text variant="caption">
                {order.currency} {order.subtotal.toLocaleString()}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text variant="caption">Shipping</Text>
              <Text variant="caption">
                {order.shipping_fee > 0
                  ? `${order.currency} ${order.shipping_fee.toLocaleString()}`
                  : "Free"}
              </Text>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <Text variant="caption">Discount</Text>
                <Text variant="caption">
                  -{order.currency} {order.discount.toLocaleString()}
                </Text>
              </div>
            )}
            <div className="flex justify-between">
              <Text variant="body" className="font-medium">
                Total
              </Text>
              <Text variant="body" className="font-medium">
                {order.currency} {order.total.toLocaleString()}
              </Text>
            </div>
          </div>
        </div>

        <div
          id="admin-order-details-update-status"
          className="border border-gray-200 p-6"
        >
          <Text variant="label" className="font-medium text-black mb-4">
            Update Status
          </Text>
          <select
            id="admin-order-details-status-select"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value as OrderStatus)
            }
            className="w-full border border-gray-300 px-3 py-2 text-sm mb-4"
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <Button
            id="admin-order-details-status-save"
            variant="primary"
            size="sm"
            fullWidth
            disabled={isSaving || selectedStatus === order.status}
            onClick={handleUpdateStatus}
          >
            {isSaving ? "Updating..." : "Update Status"}
          </Button>
          {error && (
            <Text
              id="admin-order-details-status-error"
              variant="caption"
              className="text-red-600 mt-2"
            >
              {error}
            </Text>
          )}
          {success && (
            <Text
              id="admin-order-details-status-success"
              variant="caption"
              className="text-green-700 mt-2"
            >
              Status updated.
            </Text>
          )}

          <div className="border-t border-gray-100 mt-6 pt-6 space-y-1">
            <Text variant="label" className="font-medium text-black mb-2">
              Payment
            </Text>
            <Text variant="caption">
              Payment status: {order.payment_status}
            </Text>
            {order.razorpay_order_id && (
              <Text variant="caption">
                Razorpay order: {order.razorpay_order_id}
              </Text>
            )}
            {order.razorpay_payment_id && (
              <Text variant="caption">
                Razorpay payment: {order.razorpay_payment_id}
              </Text>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          id="admin-order-details-customer"
          className="border border-gray-200 p-6"
        >
          <Text variant="label" className="font-medium text-black mb-4">
            Customer
          </Text>
          <Text variant="body" className="text-gray-700">
            {order.customer_name}
            <br />
            {order.customer_email}
            <br />
            {order.customer_phone}
          </Text>
        </div>

        <div
          id="admin-order-details-address"
          className="border border-gray-200 p-6"
        >
          <Text variant="label" className="font-medium text-black mb-4">
            Shipping Address
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
      </div>
    </div>
  );
}
