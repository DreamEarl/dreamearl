"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { translations } from "@/lib/constants/translations";

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50 mb-4">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Add to Cart Button on Hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/5 flex items-end justify-center p-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Add to cart logic here
                  console.log("Add to cart:", id);
                }}
                className="w-full py-3 bg-black text-white text-sm font-light tracking-wider hover:bg-gray-900 transition-colors"
              >
                {translations.product.addToCart}
              </button>
            </div>
          )}
        </div>
      </Link>

      <div className="text-center">
        <p className="text-xs tracking-widest text-gray-600 mb-1">{brand}</p>
        <Link href={href}>
          <h3 className="text-base font-light tracking-wide mb-2 hover:text-gray-600 transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-gray-900">
          {currency} {price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
