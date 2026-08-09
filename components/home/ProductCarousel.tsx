"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

interface CarouselProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  href: string;
  brand?: string;
  currency?: string;
}

export default function ProductCarousel({
  products,
}: {
  products: CarouselProduct[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateScrollState)
        : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro?.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "left" ? -el.clientWidth : el.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        id="featured-products-grid"
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="snap-start shrink-0 w-[calc(40%-1rem)] lg:w-[calc(33.333%-1.334rem)]"
          >
            <ProductCard
              id={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
              href={product.href}
              brand={product.brand}
              currency={product.currency}
            />
          </div>
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          aria-label="Previous products"
          className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Next products"
          className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
