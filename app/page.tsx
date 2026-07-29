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
      <div className="flex flex-1 gap-12 flex-col">
        <div className="bg-white px-4 py-6 gap-2 text-center">
          <Text variant="price" className="font-glacial font-light">
            {translations.brandDescription.line1}
          </Text>
          <Text variant="price" className="font-glacial font-light">
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
