import Text from "@/components/ui/Text";
import { translations } from "@/lib/constants/translations";

export default function AuthDivider() {
  return (
    <div className="relative mb-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center">
        <Text variant="caption" as="span" className="px-4 bg-white">
          {translations.login.orDivider}
        </Text>
      </div>
    </div>
  );
}
