"use client";

import Image from "next/image";
import Link from "next/link";
import { translations } from "@/lib/constants/translations";
import { useCart } from "@/lib/cart/CartContext";
import SidePanel from "@/components/ui/SidePanel";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Heading from "@/components/ui/Heading";

const { hero, emptyMessage, miniCart } = translations.cart;

export default function MiniCart() {
  const {
    state,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
  } = useCart();
  const { items } = state;

  return (
    <SidePanel
      isOpen={isCartOpen}
      onClose={closeCart}
      closeButtonClassName="text-white"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-[#5f1631] text-white px-8 py-8 pr-16">
          <Heading variant="cart" className="text-white mb-2">
            {hero.title}
          </Heading>
          <Text variant="body" className="text-white/90">
            {hero.subtitle}
          </Text>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <Text variant="body" className="text-gray-500">
              {emptyMessage}
            </Text>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto divide-y divide-gray-100 px-8">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-6">
                <Link href={item.href} className="shrink-0">
                  <div className="relative w-20 h-20 bg-gray-50 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={item.href}>
                        <Heading variant="card" className="hover:text-gray-600">
                          {item.name}
                        </Heading>
                      </Link>
                      {item.subtitle && (
                        <Text variant="small" className="text-gray-500">
                          {item.subtitle}
                        </Text>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      className="text-gray-400 hover:text-gray-700 transition-colors text-lg font-light"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ✕
                    </button>
                  </div>

                  {item.color && (
                    <Text variant="small" className="text-gray-500">
                      Color: {item.color}
                    </Text>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-300 w-fit">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        className="px-2 py-1 text-base leading-none hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-sm min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        className="px-2 py-1 text-base leading-none hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <Text variant="body">
                      {item.currency}{" "}
                      {(item.price * item.quantity).toLocaleString()}
                    </Text>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <Text variant="body" className="font-medium">
                Subtotal
              </Text>
              <Text variant="body">
                {translations.common.currency} {subtotal.toLocaleString()}
              </Text>
            </div>
            <div className="flex gap-4 align-center justify-between">
              <Button variant="outline" size="sm" fullWidth onClick={closeCart}>
                {miniCart.continueShopping}
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                href="/cart"
                onClick={closeCart}
              >
                {miniCart.checkoutCart}
              </Button>
            </div>
          </div>
        )}
      </div>
    </SidePanel>
  );
}
