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
      <div className="bg-white py-10 px-6 gap-2 text-center">
        <Text variant="price">{translations.brandDescription.line1}</Text>
        <Text variant="price">{translations.brandDescription.line2}</Text>
      </div>

      <FeaturedProducts />

      <ViewCollection />

      <CustomizeSection />
    </div>
  );
}
