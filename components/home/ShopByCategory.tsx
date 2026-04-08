import Link from "next/link";
import { getAllCategories, urlFor } from "@/lib/sanity";
import { translations } from "@/lib/constants/translations";
import Heading from "@/components/ui/Heading";
import ProductImage from "@/components/ui/ProductImage";

export default async function ShopByCategory() {
  const categories = await getAllCategories();

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Heading variant="section" className="mb-12">
          {translations.shopByCategory.title}
        </Heading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/shop?category=${category.slug.current}`}
              className="group relative aspect-3/4 overflow-hidden rounded-sm shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <ProductImage
                src={urlFor(category.image).width(800).url()}
                alt={category.name}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Heading variant="category">{category.name}</Heading>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
