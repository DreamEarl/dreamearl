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
        const url = new URL(buttonLink, "https://x");
        url.searchParams.set("type", subcategory);
        return `${url.pathname}${url.search}`;
      })()
    : buttonLink;

  return (
    <section id="view-collection" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
            imagePosition === "right" ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Image */}
          <div
            id="view-collection-image"
            className={`relative aspect-4/5 max-h-[90vh] overflow-hidden bg-gray-50 ${
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
            id="view-collection-content"
            className={`flex flex-col justify-start gap-4 ${
              imagePosition === "right" ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <Heading
              variant="section"
              className="flex-1 text-3xl! font-semibold text-left uppercase"
            >
              {title}
            </Heading>
            {description && (
              <Text
                variant="body"
                className="max-w-420 pt-4 text-left text-lg!"
              >
                {description}
              </Text>
            )}
            <div className="flex justify-start pt-2">
              <Link href={href}>
                <Button
                  variant="primary"
                  size="sm"
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
