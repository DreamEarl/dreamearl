import ProductCard from "@/components/products/ProductCard";
import { sampleProducts } from "@/lib/data/products";
import { translations } from "@/lib/constants/translations";

const products = sampleProducts.map((product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  href: `/products/${product.slug}`,
}));

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-32 px-6 md:px-12 max-w-7xl mx-auto pb-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-wider text-center mb-12">
          {translations.shop.title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              href={product.href}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
