import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { translations } from "@/lib/constants/translations";

interface OverviewPanelProps {
  firstName: string;
  fullName: string;
  email: string;
  phone: string;
}

export default function OverviewPanel({
  firstName,
  fullName,
  email,
  phone,
}: Readonly<OverviewPanelProps>) {
  const { account } = translations;
  const t = account.overview;

  return (
    <div id="overview-panel">
      <Heading
        id="overview-panel-title"
        variant="cart"
        className="border-b border-black inline-block pb-2 mb-6 uppercase"
      >
        {account.title}
      </Heading>

      <Heading id="overview-panel-greeting" variant="product" className="mb-2">
        {account.greeting} {firstName}
      </Heading>
      <Text id="overview-panel-welcome" variant="muted" className="mb-8">
        {t.welcome}
      </Text>

      <div
        id="overview-panel-personal-info"
        className="border border-gray-200 p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <Text
            id="overview-panel-personal-info-title"
            variant="label"
            className="font-medium text-black"
          >
            {t.personalInfo.title}
          </Text>
          <Button
            id="overview-panel-personal-info-edit"
            variant="outline"
            size="sm"
          >
            {t.edit}
          </Button>
        </div>
        <div
          id="overview-panel-personal-info-rows"
          className="divide-y divide-gray-100"
        >
          <div
            id="overview-panel-personal-info-full-name"
            className="flex justify-between py-3"
          >
            <Text variant="caption">{t.personalInfo.fullName}</Text>
            <Text variant="body">{fullName}</Text>
          </div>
          <div
            id="overview-panel-personal-info-email"
            className="flex justify-between py-3"
          >
            <Text variant="caption">{t.personalInfo.email}</Text>
            <Text variant="body">{email}</Text>
          </div>
          <div
            id="overview-panel-personal-info-phone"
            className="flex justify-between py-3"
          >
            <Text variant="caption">{t.personalInfo.phone}</Text>
            <Text variant="body">{phone || "—"}</Text>
          </div>
        </div>
      </div>

      <div
        id="overview-panel-change-password"
        className="border border-gray-200 p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-1">
          <Text
            id="overview-panel-change-password-title"
            variant="label"
            className="font-medium text-black"
          >
            {t.changePassword.title}
          </Text>
          <Button
            id="overview-panel-change-password-edit"
            variant="outline"
            size="sm"
          >
            {t.edit}
          </Button>
        </div>
        <Text
          id="overview-panel-change-password-description"
          variant="caption"
          className="mb-4"
        >
          {t.changePassword.description}
        </Text>
        <div
          id="overview-panel-change-password-row"
          className="flex justify-between py-3 border-t border-gray-100"
        >
          <Text variant="caption">{t.changePassword.password}</Text>
          <Text variant="body">••••••••••</Text>
        </div>
      </div>

      <div id="overview-panel-promo" className="relative overflow-hidden">
        <Image
          src="/images/hero/background.jpeg"
          alt=""
          fill
          className="object-cover"
        />
        <div
          id="overview-panel-promo-content"
          className="relative bg-black/40 p-8"
        >
          <Heading
            id="overview-panel-promo-heading"
            variant="section"
            className="text-left! text-white mb-2"
          >
            {t.promo.heading}
          </Heading>
          <Text
            id="overview-panel-promo-subtitle"
            variant="body"
            className="text-white/90 mb-4"
          >
            {t.promo.subtitle}
          </Text>
          <Button
            id="overview-panel-promo-cta"
            variant="primary"
            size="sm"
            href="/shop"
          >
            {t.promo.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}
