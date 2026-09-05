import { getPrivacyPolicy } from "@/lib/sanity/queries";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default async function PrivacyPolicyPage() {
  const page = await getPrivacyPolicy();

  if (!page) return null;

  return (
    <LegalPageLayout
      title={page.title}
      intro={page.intro}
      sections={page.sections}
    />
  );
}
