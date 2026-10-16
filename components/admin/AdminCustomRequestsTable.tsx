import Link from "next/link";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import CustomRequestStatusBadge from "@/components/account/CustomRequestStatusBadge";
import {
  formatCustomRequestDate,
  getCustomRequestImages,
} from "@/lib/customRequests/status";
import { CUSTOM_REQUEST_STATUSES } from "@/lib/customRequests/types";
import type {
  CustomRequest,
  CustomRequestStatus,
} from "@/lib/customRequests/types";

interface AdminCustomRequestsTableProps {
  requests: CustomRequest[];
  statusFilter: CustomRequestStatus | "ALL";
  query: string;
}

const STATUS_FILTERS: Array<CustomRequestStatus | "ALL"> = [
  "ALL",
  ...CUSTOM_REQUEST_STATUSES,
];

function filterHref(
  status: CustomRequestStatus | "ALL",
  query: string,
): string {
  const params = new URLSearchParams();
  if (status !== "ALL") params.set("status", status);
  if (query) params.set("q", query);
  const qs = params.toString();
  return qs ? `/admin/custom-requests?${qs}` : "/admin/custom-requests";
}

export default function AdminCustomRequestsTable({
  requests,
  statusFilter,
  query,
}: Readonly<AdminCustomRequestsTableProps>) {
  return (
    <div id="admin-custom-requests-page">
      <Heading
        id="admin-custom-requests-title"
        variant="cart"
        className="border-b border-black inline-block pb-2 mb-6 uppercase"
      >
        Custom Requests
      </Heading>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div
          id="admin-custom-requests-status-filters"
          className="flex flex-wrap gap-2"
        >
          {STATUS_FILTERS.map((status) => {
            const isActive = status === statusFilter;
            return (
              <Link
                key={status}
                id={`admin-custom-requests-filter-${status}`}
                href={filterHref(status, query)}
                className={`px-3 py-1 text-xs uppercase tracking-wide border ${
                  isActive
                    ? "bg-[#5f1631] text-white border-[#5f1631]"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {status === "ALL" ? "All" : status}
              </Link>
            );
          })}
        </div>

        <form
          id="admin-custom-requests-search"
          method="get"
          className="flex gap-2"
        >
          {statusFilter !== "ALL" && (
            <input type="hidden" name="status" value={statusFilter} />
          )}
          <input
            id="admin-custom-requests-search-input"
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search name, email, product or id"
            className="border border-gray-300 px-3 py-1.5 text-sm w-64"
          />
          <button
            id="admin-custom-requests-search-submit"
            type="submit"
            className="px-3 py-1.5 text-xs uppercase border border-black hover:bg-gray-50"
          >
            Search
          </button>
        </form>
      </div>

      {requests.length === 0 ? (
        <Text id="admin-custom-requests-empty" variant="muted">
          No custom requests found.
        </Text>
      ) : (
        <div
          id="admin-custom-requests-list"
          className="divide-y divide-gray-100 border border-gray-200"
        >
          <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-3 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <span className="col-span-2">Customer</span>
            <span>Product</span>
            <span>Requested On</span>
            <span>Images</span>
            <span>Status</span>
          </div>
          {requests.map((req) => (
            <Link
              key={req.id}
              id={`admin-custom-request-row-${req.id}`}
              href={`/admin/custom-requests/${req.id}`}
              className="grid grid-cols-2 md:grid-cols-6 gap-4 px-4 py-4 hover:bg-gray-50"
            >
              <div className="col-span-2">
                <Text variant="body" className="font-medium">
                  {req.full_name ?? "Unknown"}
                </Text>
                <Text variant="caption">{req.email ?? "—"}</Text>
                <Text variant="caption">
                  #{req.id.slice(0, 8).toUpperCase()}
                </Text>
              </div>
              <Text variant="caption" className="self-center">
                {req.product_type}
              </Text>
              <Text variant="caption" className="self-center">
                {formatCustomRequestDate(req.created_at)}
              </Text>
              <Text variant="caption" className="self-center">
                {getCustomRequestImages(req).length}
              </Text>
              <div className="self-center">
                <CustomRequestStatusBadge
                  id={`admin-custom-request-row-${req.id}-status`}
                  status={req.status}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
