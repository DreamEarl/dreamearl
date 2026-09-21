import type {
  CustomRequest,
  CustomRequestStatus,
} from "@/lib/customRequests/types";

interface CustomRequestStatusMeta {
  label: string;
  dotClassName: string;
  badgeClassName: string;
  message: string;
}

const STATUS_META: Record<CustomRequestStatus, CustomRequestStatusMeta> = {
  PENDING: {
    label: "Pending",
    dotClassName: "bg-gray-400",
    badgeClassName: "bg-gray-100 text-gray-600",
    message: "Your request has been received.",
  },
  IN_DISCUSSION: {
    label: "In Discussion",
    dotClassName: "bg-amber-500",
    badgeClassName: "bg-amber-50 text-amber-700",
    message: "We'll get back to you soon!",
  },
  CONFIRMED: {
    label: "Confirmed",
    dotClassName: "bg-green-500",
    badgeClassName: "bg-green-50 text-green-700",
    message: "Design finalised. Production in progress.",
  },
  IN_PRODUCTION: {
    label: "In Production",
    dotClassName: "bg-blue-500",
    badgeClassName: "bg-blue-50 text-blue-700",
    message: "Your piece is being crafted with care.",
  },
  COMPLETED: {
    label: "Completed",
    dotClassName: "bg-green-500",
    badgeClassName: "bg-green-50 text-green-700",
    message: "Your custom piece is ready!",
  },
  CANCELLED: {
    label: "Cancelled",
    dotClassName: "bg-gray-400",
    badgeClassName: "bg-gray-100 text-gray-500",
    message: "This request was cancelled.",
  },
};

export function getCustomRequestStatusMeta(
  status: CustomRequestStatus,
): CustomRequestStatusMeta {
  return STATUS_META[status];
}

export function formatCustomRequestDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function getCustomRequestTitle(request: CustomRequest): string {
  return `Custom ${request.product_type}`;
}
