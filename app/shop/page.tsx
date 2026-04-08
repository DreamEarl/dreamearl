import ProductCard from "@/components/products/ProductCard";
import { getProductsByCategory, urlFor } from "@/lib/sanity";
import Heading from "@/components/ui/Heading";

export default async function ShopPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ category?: string }>;
}>) {
  const { category: categorySlug } = await searchParams;
  console.log("🚀 ~ ShopPage ~ categorySlug:", categorySlug);

  // Fetch products based on category filter
  const sanityProducts = categorySlug
    ? await getProductsByCategory(categorySlug)
    : [];

  const products = sanityProducts.map((product) => ({
    id: product._id,
    name: product.name,
    price: product.price,
    image: urlFor(product.images[0]).width(800).url(),
    href: `/products/${product.slug.current}`,
    brand: product.brand,
    currency: product.currency,
  }));

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-32 px-6 md:px-12 max-w-7xl mx-auto pb-16">
        <Heading variant="page" className="text-center mb-12">
          {categorySlug
            ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
            : "Shop"}
        </Heading>
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
