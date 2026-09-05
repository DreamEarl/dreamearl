import { getShippingPolicy } from "@/lib/sanity/queries";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default async function ShippingPolicyPage() {
  const page = await getShippingPolicy();

  if (!page) return null;

  return (
    <LegalPageLayout
      title={page.title}
      intro={page.intro}
      sections={page.sections}
    />
  );
}
