import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminCustomRequestDetailsPanel from "@/components/admin/AdminCustomRequestDetailsPanel";
import type { CustomRequest } from "@/lib/customRequests/types";

interface AdminCustomRequestPageProps {
  params: Promise<{ requestId: string }>;
}

export default async function AdminCustomRequestPage({
  params,
}: Readonly<AdminCustomRequestPageProps>) {
  const { requestId } = await params;
  const admin = createAdminClient();
  const { data: customRequest } = await admin
    .from("custom_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (!customRequest) {
    notFound();
  }

  return (
    <AdminCustomRequestDetailsPanel
      customRequest={customRequest as CustomRequest}
    />
  );
}
