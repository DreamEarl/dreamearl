import { getTermsConditions } from "@/lib/sanity/queries";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default async function TermsConditionsPage() {
  const page = await getTermsConditions();

  if (!page) return null;

  return (
    <LegalPageLayout
      title={page.title}
      intro={page.intro}
      sections={page.sections}
    />
  );
}
