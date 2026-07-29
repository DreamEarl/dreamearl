import Link from "next/link";
import { getCollectionSection, urlFor } from "@/lib/sanity";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import ProductImage from "@/components/ui/ProductImage";

export default async function ViewCollection() {
  const data = await getCollectionSection();

  if (!data?.isActive) {
    return null;
  }

  const {
    title,
    description,
    buttonText,
    buttonLink,
    subcategory,
    image,
    imagePosition,
  } = data;
  const imageUrl = urlFor(image).width(1200).url();

  const href = subcategory
    ? (() => {
        const url = new URL(buttonLink, "http://x");
        url.searchParams.set("type", subcategory);
        return `${url.pathname}${url.search}`;
      })()
    : buttonLink;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
            imagePosition === "right" ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Image */}
          <div
            className={`relative aspect-4/5 overflow-hidden bg-gray-50 ${
              imagePosition === "right" ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <ProductImage
              src={imageUrl}
              alt={image.alt || title}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div
            className={`flex flex-col justify-center gap-6 ${
              imagePosition === "right" ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <Heading
              variant="section"
              className="uppercase tracking-wider text-left font-bold"
            >
              {title}
            </Heading>
            {description && (
              <Text variant="body" className="text-gray-700">
                {description}
              </Text>
            )}
            <div>
              <Link href={href}>
                <Button
                  variant="primary"
                  size="md"
                  className="tracking-widest uppercase"
                >
                  {buttonText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
