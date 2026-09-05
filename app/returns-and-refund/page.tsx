import { getReturnsAndRefund } from "@/lib/sanity/queries";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default async function ReturnsAndRefundPage() {
  const page = await getReturnsAndRefund();

  if (!page) return null;

  return (
    <LegalPageLayout
      title={page.title}
      intro={page.intro}
      sections={page.sections}
    />
  );
}
