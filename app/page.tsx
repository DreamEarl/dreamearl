import Hero from "@/components/home/Hero";
import ShopByCategory from "@/components/home/ShopByCategory";
import CustomizeSection from "@/components/home/CustomizeSection";
import Text from "@/components/ui/Text";
import { translations } from "@/lib/constants/translations";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="bg-white py-10 px-6 text-center">
        <Text variant="body">{translations.brandDescription.line1}</Text>
        <Text variant="body">{translations.brandDescription.line2}</Text>
      </div>
      <ShopByCategory />
      <CustomizeSection />
    </div>
  );
}
