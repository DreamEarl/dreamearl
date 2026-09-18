import { ShoppingBag } from "lucide-react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import OrderCard from "@/components/account/OrderCard";
import { translations } from "@/lib/constants/translations";
import type { Order } from "@/lib/orders/types";

interface OrdersPanelProps {
  orders: Order[];
}

export default function OrdersPanel({ orders }: Readonly<OrdersPanelProps>) {
  const { orders: t } = translations.account;

  return (
    <div id="orders-panel">
      <Heading
        id="orders-panel-title"
        variant="cart"
        className="border-b border-black inline-block pb-2 mb-6 uppercase"
      >
        {t.title}
      </Heading>

      {orders.length === 0 ? (
        <div
          id="orders-panel-empty"
          className="flex flex-col items-center text-center py-16 px-6"
        >
          <ShoppingBag
            id="orders-panel-empty-icon"
            className="w-16 h-16 text-[#5f1631] mb-4"
            strokeWidth={1.25}
          />
          <Heading
            id="orders-panel-empty-title"
            variant="product"
            className="mb-3 font-glacial"
          >
            {t.emptyTitle}
          </Heading>
          <Text
            id="orders-panel-empty-message"
            variant="muted"
            className="mb-8"
          >
            {t.empty}
            <br />
            {t.emptySubtitle}
          </Text>
          <Button
            id="orders-panel-empty-cta"
            variant="primary"
            size="sm"
            href="/shop"
          >
            {t.exploreNow}
          </Button>
        </div>
      ) : (
        <div id="orders-panel-list">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
