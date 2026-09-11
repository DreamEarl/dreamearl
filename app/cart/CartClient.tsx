"use client";

import Image from "next/image";
import Link from "next/link";
import { translations } from "@/lib/constants/translations";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { useCart } from "@/lib/cart/CartContext";

const { columns, summary } = translations.cart;

interface CartClientProps {
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  emptyMessage: string;
  returnToShop: string;
}

export default function CartClient({
  heroImageUrl,
  heroTitle,
  heroSubtitle,
  emptyMessage,
  returnToShop,
}: Readonly<CartClientProps>) {
  const { cartItems, itemCount, removeFromCart, updateQuantity, subtotal } =
    useCart();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-64 md:h-80 flex items-center px-8 md:px-16 overflow-hidden">
        <Image
          src={heroImageUrl}
          alt="Cart hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-light tracking-widest text-white">
            {heroTitle}
          </h1>
          <p className="mt-3 text-white/90 text-sm md:text-base font-light">
            {heroSubtitle}
          </p>
        </div>
      </div>

      {itemCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <Heading variant="cart" className="mb-8">
            {emptyMessage}
          </Heading>
          <Button variant="primary" size="sm" href="/shop">
            {returnToShop}
          </Button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Items table */}
            <div className="flex-1 overflow-x-auto">
              {/* Column headers */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-gray-200 pb-4 mb-6">
                {[
                  columns.product,
                  columns.price,
                  columns.quantity,
                  columns.total,
                ].map((col) => (
                  <Text
                    key={col}
                    variant="small"
                    className="font-medium tracking-widest text-gray-500"
                  >
                    {col}
                  </Text>
                ))}
                <span />
              </div>

              {/* Cart rows */}
              <ul className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center py-6"
                  >
                    {/* Product */}
                    <div className="flex gap-4 items-start">
                      <Link href={item.href} className="shrink-0">
                        <div className="relative w-24 h-24 bg-gray-50 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                      <div className="flex flex-col gap-1">
                        <Link href={item.href}>
                          <Heading
                            variant="card"
                            className="hover:text-gray-600"
                          >
                            {item.name}
                          </Heading>
                        </Link>
                        {item.subtitle && (
                          <Text variant="small" className="text-gray-500">
                            {item.subtitle}
                          </Text>
                        )}
                        {item.color && (
                          <Text variant="small" className="text-gray-500">
                            Color: {item.color}
                          </Text>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <Text variant="body">
                      {item.currency} {item.price.toLocaleString()}
                    </Text>

                    {/* Quantity */}
                    <div className="flex items-center border border-gray-300 w-fit">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        className="px-3 py-2 text-lg leading-none hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="px-4 py-2 text-sm min-w-10 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        className="px-3 py-2 text-lg leading-none hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    {/* Total */}
                    <Text variant="body">
                      {item.currency}{" "}
                      {(item.price * item.quantity).toLocaleString()}
                    </Text>

                    {/* Remove */}
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      className="text-gray-400 hover:text-gray-700 transition-colors text-lg font-light"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cart summary */}

            <div className="bg-[#faf7f4] p-6">
              <Text
                variant="small"
                className="font-medium tracking-widest mb-6"
              >
                {summary.title}
              </Text>
              <div className="flex justify-between items-center mb-3">
                <Text variant="body">{summary.subtotal}</Text>
                <Text variant="body">
                  {translations.common.currency} {subtotal.toLocaleString()}
                </Text>
              </div>
              <div className="flex justify-between items-start mb-8">
                <Text variant="body">{summary.shipping}</Text>
                <Text
                  variant="small"
                  className="text-gray-500 text-right max-w-32"
                >
                  {summary.shippingValue}
                </Text>
              </div>
              <Button variant="primary" size="sm" fullWidth href="/checkout">
                {summary.checkout}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
