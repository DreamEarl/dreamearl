"use client";

import Link from "next/link";
import { translations } from "@/lib/constants/translations";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Heading from "@/components/ui/Heading";
import ProductImage from "@/components/ui/ProductImage";
import { useCart } from "@/lib/cart/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  image: string;
  href: string;
  brand?: string;
  currency?: string;
  color?: string;
}

export default function ProductCard({
  id,
  name,
  subtitle,
  price,
  image,
  href,
  brand = translations.common.brand,
  currency = translations.common.currency,
  color,
}: Readonly<ProductCardProps>) {
  const { addToCart } = useCart();

  return (
    <div className="group">
      <Link href={href} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50 mb-4">
          <ProductImage
            src={image}
            alt={name}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/5 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={(e) => {
                e.preventDefault();
                addToCart({
                  id,
                  name,
                  subtitle,
                  price,
                  image,
                  href,
                  brand,
                  currency,
                  color,
                });
              }}
            >
              {translations.product.addToCart}
            </Button>
          </div>
        </div>
      </Link>

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
