import { getCustomizationSection, urlFor } from "@/lib/sanity";
import { translations } from "@/lib/constants/translations";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import ProductImage from "@/components/ui/ProductImage";

export default async function CustomizeSection() {
  const data = await getCustomizationSection();

  const heading = data?.heading ?? translations.customization.heading;
  const subtitle = data?.subtitle ?? translations.customization.subtitle;
  const buttonText = data?.buttonText ?? translations.customization.buttonText;
  const images = data?.images ?? [];

  return (
    <section id="customize" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Text content */}
        <div
          id="customize-text"
          className="flex flex-col items-center text-center mb-10 gap-4"
        >
          <Heading variant="section">{heading}</Heading>
          <Text variant="body">{subtitle}</Text>
          <Button
            variant="primary"
            href="/custom-order"
            className="mt-2 tracking-widest text-sm px-16 py-4"
          >
            {buttonText}
          </Button>
        </div>

        {/* Inspiration image strip */}
        {images.length > 0 && (
          <div id="customize-gallery" className="grid grid-cols-5 gap-2">
            {images.map((image, index) => (
              <div
                key={image._key}
                className="relative aspect-3/4 overflow-hidden"
              >
                <ProductImage
                  src={urlFor(image).width(600).url()}
                  alt={image.alt ?? `Custom order inspiration ${index + 1}`}
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
