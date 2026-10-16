import { createAdminClient } from "@/lib/supabase/admin";
import AdminCustomRequestsTable from "@/components/admin/AdminCustomRequestsTable";
import { CUSTOM_REQUEST_STATUSES } from "@/lib/customRequests/types";
import type {
  CustomRequest,
  CustomRequestStatus,
} from "@/lib/customRequests/types";

interface AdminCustomRequestsPageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

function toStatusFilter(
  value: string | undefined,
): CustomRequestStatus | "ALL" {
  return (CUSTOM_REQUEST_STATUSES as readonly string[]).includes(value ?? "")
    ? (value as CustomRequestStatus)
    : "ALL";
}

export default async function AdminCustomRequestsPage({
  searchParams,
}: Readonly<AdminCustomRequestsPageProps>) {
  const resolved = await searchParams;
  const statusFilter = toStatusFilter(resolved?.status);
  const query = resolved?.q?.trim() ?? "";

  const admin = createAdminClient();
  let request = admin
    .from("custom_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (statusFilter !== "ALL") {
    request = request.eq("status", statusFilter);
  }

  const { data } = await request;
  const customRequests = (data ?? []) as CustomRequest[];

  // Filtered in JS rather than via PostgREST `.or()` to avoid building raw filter
  // strings out of free-text admin input (query syntax injection into the filter).
  const filteredRequests = query
    ? customRequests.filter((req) => {
        const needle = query.toLowerCase();
        return (
          (req.full_name ?? "").toLowerCase().includes(needle) ||
          (req.email ?? "").toLowerCase().includes(needle) ||
          req.product_type.toLowerCase().includes(needle) ||
          req.id.toLowerCase().includes(needle)
        );
      })
    : customRequests;

  return (
    <AdminCustomRequestsTable
      requests={filteredRequests}
      statusFilter={statusFilter}
      query={query}
    />
  );
}
