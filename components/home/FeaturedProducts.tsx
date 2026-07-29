import Link from "next/link";
import { getFeaturedProductsByCategory, urlFor } from "@/lib/sanity";
import { translations } from "@/lib/constants/translations";
import Heading from "@/components/ui/Heading";
import ProductCard from "@/components/products/ProductCard";
import Button from "@/components/ui/Button";

export default async function FeaturedProducts() {
  const products = await getFeaturedProductsByCategory("handbags", 3);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="p-4 bg-white">
      <div className="flex flex-col max-w-7xl mx-auto gap-8 mb-4">
        <div className="flex items-center">
          <Heading variant="section" className="flex-1 text-3xl! font-semibold">
            {translations.featuredProducts.title}
          </Heading>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              image={urlFor(product?.images?.[0]).width(800).url()}
              href={`/products/${product.slug.current}`}
              brand={product.brand}
              currency={product.currency}
            />
          ))}
        </div>
        <div className="flex items-center justify-center">
          <Link href="/shop?category=handbags">
            <Button variant="primary" size="sm">
              {translations.featuredProducts.shopAll}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
