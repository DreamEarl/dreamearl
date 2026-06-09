"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { FilterSortIcon } from "@/components/ui/icons";
import SidePanel from "@/components/ui/SidePanel";

export type SortOption = "newest" | "price_asc" | "price_desc";

export interface AvailableFilters {
  pearlTypes: string[];
  pearlColours: string[];
  craftTechniques: string[];
  minPrice: number;
  maxPrice: number;
}

interface FilterSortBarProps {
  productCount: number;
  availableFilters: AvailableFilters;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function FilterSortBar({
  productCount,
  availableFilters,
}: Readonly<FilterSortBarProps>) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = (searchParams.get("sort") as SortOption) ?? "newest";
  const currentPearlTypes =
    searchParams.get("pearlType")?.split(",").filter(Boolean) ?? [];
  const currentPearlColours =
    searchParams.get("pearlColour")?.split(",").filter(Boolean) ?? [];
  const currentCraftTechniques =
    searchParams.get("craftTechnique")?.split(",").filter(Boolean) ?? [];

  const [localMinPrice, setLocalMinPrice] = useState(() =>
    searchParams.get("priceMin")
      ? Number(searchParams.get("priceMin"))
      : availableFilters.minPrice,
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(() =>
    searchParams.get("priceMax")
      ? Number(searchParams.get("priceMax"))
      : availableFilters.maxPrice,
  );

  const hasPriceFilter =
    searchParams.has("priceMin") || searchParams.has("priceMax");
  const activeFilterCount =
    currentPearlTypes.length +
    currentPearlColours.length +
    currentCraftTechniques.length +
    (hasPriceFilter ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );

  const handleSortChange = (value: SortOption) => {
    updateParams({ sort: value });
    setIsPanelOpen(false);
  };

  const toggleMultiValue = (
    param: string,
    value: string,
    current: string[],
  ) => {
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParams({ [param]: updated.length > 0 ? updated.join(",") : null });
  };

  const commitPriceRange = () => {
    const priceMin =
      localMinPrice === availableFilters.minPrice
        ? null
        : String(localMinPrice);
    const priceMax =
      localMaxPrice === availableFilters.maxPrice
        ? null
        : String(localMaxPrice);
    updateParams({ priceMin, priceMax });
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("pearlType");
    params.delete("pearlColour");
    params.delete("craftTechnique");
    params.delete("priceMin");
    params.delete("priceMax");
    setLocalMinPrice(availableFilters.minPrice);
    setLocalMaxPrice(availableFilters.maxPrice);
    router.push(`${pathname}?${params.toString()}`);
  };

  const showPriceRange =
    availableFilters.maxPrice > availableFilters.minPrice &&
    availableFilters.maxPrice > 0;

  return (
    <>
      <div className="flex items-center justify-between mb-8 border-t border-b border-gray-200 py-4">
        <button
          onClick={() => setIsPanelOpen(true)}
          className="flex items-center gap-2 text-sm tracking-wider text-gray-800 hover:text-black transition-colors"
          aria-label="Open filter and sort panel"
        >
          <FilterSortIcon />
          <span>Filter and sort</span>
          {hasActiveFilters && (
            <span className="ml-1 w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-medium">
              {activeFilterCount}
            </span>
          )}
        </button>
        <span className="text-sm tracking-wider text-gray-600">
          {productCount} {productCount === 1 ? "product" : "products"}
        </span>
      </div>

      <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)}>
        <div className="px-8 pt-20 pb-24">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-base font-medium tracking-widest uppercase">
              Filter and sort
            </h2>
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="text-xs tracking-wider text-gray-500 hover:text-black underline transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="mb-8 pb-8 border-b border-gray-100">
            <h3 className="text-xs tracking-widest uppercase text-gray-400 mb-4">
              Sort by
            </h3>
            <div className="flex flex-col gap-1">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`text-left text-sm py-2 tracking-wide transition-colors ${
                    currentSort === option.value
                      ? "text-black font-medium"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {currentSort === option.value && (
                    <span className="mr-2">✓</span>
                  )}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          {showPriceRange && (
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="text-xs tracking-widest uppercase text-gray-400 mb-4">
                Price range
              </h3>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label
                    htmlFor="price-min"
                    className="text-xs text-gray-400 mb-1 block"
                  >
                    Min (Rs.)
                  </label>
                  <input
                    id="price-min"
                    type="number"
                    value={localMinPrice}
                    min={availableFilters.minPrice}
                    max={localMaxPrice}
                    onChange={(e) => setLocalMinPrice(Number(e.target.value))}
                    onBlur={commitPriceRange}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <span className="text-gray-400 pb-2.5">—</span>
                <div className="flex-1">
                  <label
                    htmlFor="price-max"
                    className="text-xs text-gray-400 mb-1 block"
                  >
                    Max (Rs.)
                  </label>
                  <input
                    id="price-max"
                    type="number"
                    value={localMaxPrice}
                    min={localMinPrice}
                    max={availableFilters.maxPrice}
                    onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
                    onBlur={commitPriceRange}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pearl Type */}
          {availableFilters.pearlTypes.length > 0 && (
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="text-xs tracking-widest uppercase text-gray-400 mb-4">
                Pearl type
              </h3>
              <div className="flex flex-col gap-3">
                {availableFilters.pearlTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={currentPearlTypes.includes(type)}
                      onChange={() =>
                        toggleMultiValue("pearlType", type, currentPearlTypes)
                      }
                      className="w-4 h-4 border-gray-300 accent-black cursor-pointer"
                    />
                    <span className="text-sm tracking-wide text-gray-700 group-hover:text-black transition-colors">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Pearl Colour */}
          {availableFilters.pearlColours.length > 0 && (
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="text-xs tracking-widest uppercase text-gray-400 mb-4">
                Pearl colour
              </h3>
              <div className="flex flex-col gap-3">
                {availableFilters.pearlColours.map((colour) => (
                  <label
                    key={colour}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={currentPearlColours.includes(colour)}
                      onChange={() =>
                        toggleMultiValue(
                          "pearlColour",
                          colour,
                          currentPearlColours,
                        )
                      }
                      className="w-4 h-4 border-gray-300 accent-black cursor-pointer"
                    />
                    <span className="text-sm tracking-wide text-gray-700 group-hover:text-black transition-colors">
                      {colour}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Craft Technique */}
          {availableFilters.craftTechniques.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs tracking-widest uppercase text-gray-400 mb-4">
                Craft technique
              </h3>
              <div className="flex flex-col gap-3">
                {availableFilters.craftTechniques.map((technique) => (
                  <label
                    key={technique}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={currentCraftTechniques.includes(technique)}
                      onChange={() =>
                        toggleMultiValue(
                          "craftTechnique",
                          technique,
                          currentCraftTechniques,
                        )
                      }
                      className="w-4 h-4 border-gray-300 accent-black cursor-pointer"
                    />
                    <span className="text-sm tracking-wide text-gray-700 group-hover:text-black transition-colors">
                      {technique}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </SidePanel>
    </>
  );
}
