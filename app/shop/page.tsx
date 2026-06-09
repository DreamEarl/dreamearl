import { Suspense } from "react";
import ProductCard from "@/components/products/ProductCard";
import FilterSortBar from "@/components/products/FilterSortBar";
import type {
  SortOption,
  AvailableFilters,
} from "@/components/products/FilterSortBar";
import { getAllProducts, getProductsByCategory, urlFor } from "@/lib/sanity";
import type { SanityProduct } from "@/lib/sanity";
import Heading from "@/components/ui/Heading";

function distinct(values: (string | undefined | null)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v)))].sort(
    (a, b) => a.localeCompare(b),
  );
}

function deriveAvailableFilters(products: SanityProduct[]): AvailableFilters {
  const prices = products.map((p) => p.price ?? 0).filter((p) => p > 0);
  return {
    pearlTypes: distinct(products.map((p) => p.pearlType)),
    pearlColours: distinct(products.map((p) => p.pearlColour)),
    craftTechniques: distinct(products.map((p) => p.craftTechnique)),
    minPrice: prices.length > 0 ? Math.min(...prices) : 0,
    maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
  };
}

function applyFilters(
  products: SanityProduct[],
  filters: {
    pearlTypes: string[];
    pearlColours: string[];
    craftTechniques: string[];
    priceMin?: number;
    priceMax?: number;
  },
): SanityProduct[] {
  return products.filter((p) => {
    if (
      filters.pearlTypes.length > 0 &&
      !filters.pearlTypes.includes(p.pearlType ?? "")
    )
      return false;
    if (
      filters.pearlColours.length > 0 &&
      !filters.pearlColours.includes(p.pearlColour ?? "")
    )
      return false;
    if (
      filters.craftTechniques.length > 0 &&
      !filters.craftTechniques.includes(p.craftTechnique ?? "")
    )
      return false;
    if (filters.priceMin !== undefined && (p.price ?? 0) < filters.priceMin)
      return false;
    if (filters.priceMax !== undefined && (p.price ?? 0) > filters.priceMax)
      return false;
    return true;
  });
}

function sortProducts(
  products: SanityProduct[],
  sort: SortOption,
): SanityProduct[] {
  const sorted = [...products];
  if (sort === "price_asc") {
    sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  } else if (sort === "price_desc") {
    sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  }
  return sorted;
}

function mapProduct(product: SanityProduct) {
  return {
    id: product._id,
    name: product.name,
    price: product.price,
    image: urlFor(product.images?.[0]).width(800).url(),
    href: `/products/${product.slug?.current}`,
    brand: product.brand,
    currency: product.currency,
  };
}

export default async function ShopPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    category?: string;
    sort?: SortOption;
    pearlType?: string;
    pearlColour?: string;
    craftTechnique?: string;
    priceMin?: string;
    priceMax?: string;
  }>;
}>) {
  const {
    category: categorySlug,
    sort = "newest",
    pearlType,
    pearlColour,
    craftTechnique,
    priceMin,
    priceMax,
  } = await searchParams;

  const sanityProducts = categorySlug
    ? await getProductsByCategory(categorySlug)
    : await getAllProducts();

  // Derive options from the full unfiltered set so the panel always shows all choices
  const availableFilters = deriveAvailableFilters(sanityProducts);

  const filtered = applyFilters(sanityProducts, {
    pearlTypes: pearlType?.split(",").filter(Boolean) ?? [],
    pearlColours: pearlColour?.split(",").filter(Boolean) ?? [],
    craftTechniques: craftTechnique?.split(",").filter(Boolean) ?? [],
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
  });

  const products = sortProducts(filtered, sort).map(mapProduct);

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-32 px-6 md:px-12 max-w-7xl mx-auto pb-16">
        <Heading variant="page" className="text-center mb-12">
          {categorySlug
            ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
            : "Shop"}
        </Heading>

        <Suspense fallback={null}>
          <FilterSortBar
            productCount={products.length}
            availableFilters={availableFilters}
          />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              href={product.href}
              brand={product.brand}
              currency={product.currency}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
