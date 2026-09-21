import { getCustomRequestStatusMeta } from "@/lib/customRequests/status";
import type { CustomRequestStatus } from "@/lib/customRequests/types";

interface CustomRequestStatusBadgeProps {
  id: string;
  status: CustomRequestStatus;
}

export default function CustomRequestStatusBadge({
  id,
  status,
}: Readonly<CustomRequestStatusBadgeProps>) {
  const meta = getCustomRequestStatusMeta(status);

  return (
    <span
      id={id}
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs tracking-wide uppercase ${meta.badgeClassName}`}
    >
      <span
        id={`${id}-dot`}
        className={`w-1.5 h-1.5 rounded-full ${meta.dotClassName}`}
      />
      {meta.label}
    </span>
  );
}
