"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { translations } from "@/lib/constants/translations";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/orders/types";

const POLL_INTERVAL_MS = 2500;
const MAX_POLL_ATTEMPTS = 12; // ~30s

interface OrderStatusViewProps {
  order: Order;
}

interface LiveStatus {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  currency: string;
}

export default function OrderStatusView({ order }: Readonly<OrderStatusViewProps>) {
  const t = translations.orderSuccess;
  const [live, setLive] = useState<LiveStatus>({
    status: order.status,
    paymentStatus: order.payment_status,
    total: order.total,
    currency: order.currency,
  });
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (live.paymentStatus !== "PENDING") return;

    const interval = setInterval(async () => {
      attemptsRef.current += 1;
      try {
        const res = await fetch(`/api/orders/${order.id}/status`);
        if (res.ok) {
          const data = await res.json();
          setLive({
            status: data.status,
            paymentStatus: data.paymentStatus,
            total: data.total,
            currency: data.currency,
          });
        }
      } catch {
        // ignore transient network errors, next tick will retry
      }
      if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
        clearInterval(interval);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [live.paymentStatus, order.id]);

  const address = order.shipping_address;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-16 px-6">
      <div className="w-full max-w-2xl">
        {live.paymentStatus === "PAID" && (
          <div className="text-center mb-10">
            <Heading variant="page" className="mb-3">
              {t.confirmed.title}
            </Heading>
            <Text variant="body" className="text-gray-600">
              {t.confirmed.message}
            </Text>
          </div>
        )}

        {live.paymentStatus === "PENDING" && (
          <div className="text-center mb-10">
            <Heading variant="page" className="mb-3">
              {t.pending.title}
            </Heading>
            <Text variant="body" className="text-gray-600">
              {t.pending.message}
            </Text>
          </div>
        )}

        {live.paymentStatus === "FAILED" && (
          <div className="text-center mb-10">
            <Heading variant="page" className="mb-3">
              {t.failed.title}
            </Heading>
            <Text variant="body" className="text-gray-600 mb-6">
              {t.failed.message}
            </Text>
            <Button variant="primary" size="sm" href="/checkout">
              {t.failed.retry}
            </Button>
          </div>
        )}

        <div className="bg-[#faf7f4] p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <Text variant="label">
              {t.orderNumber}
              {order.id.slice(0, 8).toUpperCase()}
            </Text>
            <Text variant="label">
              {t.paymentStatus}: {live.paymentStatus}
            </Text>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-4">
            <Text variant="body" className="font-medium">
              {t.items}
            </Text>
            <Text variant="price">
              {live.currency} {live.total.toLocaleString()}
            </Text>
          </div>
        </div>

        <ul className="divide-y divide-gray-100 mb-8">
          {order.items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-4">
              <div className="relative w-16 h-16 bg-gray-50 overflow-hidden shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <Text variant="body">{item.name}</Text>
                {item.color && <Text variant="caption">Color: {item.color}</Text>}
                <Text variant="caption">Qty: {item.quantity}</Text>
              </div>
              <Text variant="body">
                {item.currency} {(item.price * item.quantity).toLocaleString()}
              </Text>
            </li>
          ))}
        </ul>

        <div className="mb-10">
          <Text variant="small" className="font-medium tracking-widest mb-2">
            {t.deliveryAddress}
          </Text>
          <Text variant="body" className="text-gray-700">
            {address.fullName}
            <br />
            {address.line1}
            {address.line2 ? <>, {address.line2}</> : null}
            <br />
            {address.city}, {address.state} {address.pincode}
            <br />
            {address.phone}
          </Text>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="primary" size="sm" fullWidth href="/shop">
            {t.continueShopping}
          </Button>
          <Link
            href={`/order-success/${order.id}`}
            className="w-full py-3 px-6 text-sm border border-black bg-white text-black font-light tracking-wide hover:bg-gray-50 transition-colors text-center"
          >
            {t.viewOrder}
          </Link>
        </div>
      </div>
    </div>
  );
}
