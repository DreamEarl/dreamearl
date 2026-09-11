"use client";

import Link from "next/link";
import { translations } from "@/lib/constants/translations";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Heading from "@/components/ui/Heading";
import ProductImage from "@/components/ui/ProductImage";
import { CartIcon } from "@/components/ui/icons";
import { useCart } from "@/lib/cart/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  href: string;
  brand?: string;
  currency?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  href,
  brand = translations.common.brand,
  currency = translations.common.currency,
}: Readonly<ProductCardProps>) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(id);
  const cartLabel = inCart
    ? translations.product.addedToCart
    : translations.product.addToCart;

  const handleAddToCart = () => addToCart(id);

  return (
    <div className="group">
      <div className="relative aspect-square overflow-hidden bg-gray-50 mb-4">
        <ProductImage
          src={image}
          alt={name}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Mobile: tap image to navigate, tap round icon to add to cart */}
        <Link
          href={href}
          aria-label={name}
          className="absolute inset-0 block md:hidden"
        />
        <button
          type="button"
          aria-label={cartLabel}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart();
          }}
          className="absolute bottom-3 right-3 z-10 w-6 h-6 rounded-full bg-[#5f1631] shadow-md flex items-center justify-center active:scale-90 transition-transform md:hidden"
        >
          <CartIcon className="w-4 h-4 text-white" />
        </button>

        {/* Desktop: whole image links to product, hover reveals full-width add to cart button */}
        <Link href={href} className="hidden md:block absolute inset-0">
          <div className="absolute inset-0 bg-black/5 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
            >
              {cartLabel}
            </Button>
          </div>
        </Link>
      </div>

      <div className="text-center">
        <Text variant="small" className="mb-1">
          {brand}
        </Text>
        <Link href={href}>
          <Heading variant="card" className="mb-2">
            {name}
          </Heading>
        </Link>
        <Text variant="body" className="text-gray-900">
          {currency} {price.toLocaleString()}
        </Text>
      </div>
    </div>
  );
}
