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
    <section
      id="view-collection"
      className="py-8 md:py-16 px-4 bg-[#5f1631] text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
            imagePosition === "right" ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Image */}
          <div
            id="view-collection-image"
            className={`relative aspect-[3/2] sm:aspect-[4/3] lg:aspect-4/5 max-h-[40vh] sm:max-h-[55vh] lg:max-h-[90vh] overflow-hidden bg-gray-50 ${
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
            className={`flex flex-col justify-start gap-2 sm:gap-4 ${
              imagePosition === "right" ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <Heading
              variant="section"
              className="flex-1 text-xl! sm:text-3xl! font-semibold text-left uppercase"
            >
              {title}
            </Heading>
            {description && (
              <Text
                variant="body"
                className="max-w-420 text-left text-sm! sm:text-lg!"
              >
                {description}
              </Text>
            )}
            <div className="flex justify-start pt-1 sm:pt-2">
              <Link href={href}>
                <Button
                  variant="secondary"
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
