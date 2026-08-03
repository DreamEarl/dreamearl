import { getCustomizationSection, urlFor } from "@/lib/sanity";
import { translations } from "@/lib/constants/translations";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import CustomizeGalleryCarousel from "@/components/home/CustomizeGalleryCarousel";

export default async function CustomizeSection() {
  const data = await getCustomizationSection();

  const heading = data?.heading ?? translations.customization.heading;
  const subtitle = data?.subtitle ?? translations.customization.subtitle;
  const buttonText = data?.buttonText ?? translations.customization.buttonText;
  const images = (data?.images ?? []).map((img) => ({
    _key: img._key,
    src: urlFor(img).width(600).url(),
    alt: img.alt,
  }));

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

        {/* Inspiration image carousel */}
        {images.length > 0 && <CustomizeGalleryCarousel images={images} />}
      </div>
    </section>
  );
}
