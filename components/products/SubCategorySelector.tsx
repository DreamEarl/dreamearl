"use client";

import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { SubCategory } from "@/lib/constants/shopConfig";

interface SubCategorySelectorProps {
  subcategories: SubCategory[];
}

export default function SubCategorySelector({
  subcategories,
}: Readonly<SubCategorySelectorProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = searchParams.get("type") ?? "";

  function select(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (active === slug) {
      params.delete("type");
    } else {
      params.set("type", slug);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex justify-center gap-10 md:gap-16 mb-10">
      {subcategories.map((sub) => {
        const isActive = active === sub.slug;
        return (
          <button
            key={sub.slug}
            onClick={() => select(sub.slug)}
            className="flex flex-col items-center gap-3 group focus:outline-none"
          >
            {/* Image container */}
            <div
              className={`relative w-28 h-28 md:w-36 md:h-36 overflow-hidden transition-all duration-200 ${
                isActive ? "ring-2 ring-offset-2" : ""
              }`}
            >
              {sub.image ? (
                <Image
                  src={sub.image}
                  alt={sub.label}
                  fill
                  sizes="(max-width: 768px) 112px, 144px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                /* Placeholder when no image is configured */
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-3xl text-gray-300">◻</span>
                </div>
              )}
            </div>

            {/* Label */}
            <span
              className={`text-xs md:text-sm tracking-wide text-center font-semibold uppercase transition-colors duration-200 ${
                isActive ? "text-black" : "text-gray-600 group-hover:text-black"
              }`}
            >
              {sub.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
