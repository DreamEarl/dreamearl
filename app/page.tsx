import Hero from "@/components/home/Hero";
import CustomizeSection from "@/components/home/CustomizeSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ViewCollection from "@/components/home/ViewCollection";
import Text from "@/components/ui/Text";
import { translations } from "@/lib/constants/translations";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />

      <div
        id="main-content"
        className="flex flex-1 gap-12 px-4 sm:px-8 md:px-16 lg:px-32 flex-col"
      >
        <div
          id="brand-description"
          className="bg-white px-4 py-6 gap-2 text-center"
        >
          <Text
            variant="price"
            className="font-glacial font-light text-lg sm:text-2xl"
          >
            {translations.brandDescription.line1}
          </Text>
          <Text
            variant="price"
            className="font-glacial font-light text-lg sm:text-2xl"
          >
            {translations.brandDescription.line2}
          </Text>
        </div>
        <FeaturedProducts />

        <ViewCollection />

        <CustomizeSection />
      </div>
    </div>
  );
}
