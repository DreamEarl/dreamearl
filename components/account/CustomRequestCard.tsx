import Image from "next/image";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import CustomRequestStatusBadge from "@/components/account/CustomRequestStatusBadge";
import {
  formatCustomRequestDate,
  getCustomRequestStatusMeta,
  getCustomRequestTitle,
} from "@/lib/customRequests/status";
import { translations } from "@/lib/constants/translations";
import type { CustomRequest } from "@/lib/customRequests/types";

interface CustomRequestCardProps {
  request: CustomRequest;
}

export default function CustomRequestCard({
  request,
}: Readonly<CustomRequestCardProps>) {
  const { customRequests: t } = translations.account;
  const title = getCustomRequestTitle(request);
  const statusMessage = getCustomRequestStatusMeta(request.status).message;

  return (
    <div
      id={`custom-request-card-${request.id}`}
      className="flex flex-col sm:flex-row sm:items-center gap-4 py-6 border-b border-gray-100 last:border-b-0"
    >
      <div
        id={`custom-request-card-${request.id}-image`}
        className="relative w-20 h-20 bg-gray-50 overflow-hidden shrink-0"
      >
        {request.image_url && (
          <Image
            src={request.image_url}
            alt={title}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div
        id={`custom-request-card-${request.id}-details`}
        className="flex-1 min-w-0"
      >
        <Text
          id={`custom-request-card-${request.id}-heading`}
          variant="body"
          className="font-medium tracking-wide uppercase"
        >
          {title}
        </Text>
        <Text id={`custom-request-card-${request.id}-date`} variant="caption">
          {t.requestedOn} {formatCustomRequestDate(request.created_at)}
        </Text>
      </div>

      <div
        id={`custom-request-card-${request.id}-status`}
        className="flex flex-col items-start gap-1 sm:w-56 shrink-0"
      >
        <CustomRequestStatusBadge
          id={`custom-request-card-${request.id}-badge`}
          status={request.status}
        />
        <Text
          id={`custom-request-card-${request.id}-status-message`}
          variant="caption"
        >
          {statusMessage}
        </Text>
      </div>

      <div id={`custom-request-card-${request.id}-action`} className="shrink-0">
        <Button
          id={`custom-request-card-${request.id}-view-details`}
          variant="outline"
          size="sm"
          className="uppercase tracking-wide"
          href={`/account/custom-requests/${request.id}`}
        >
          {t.viewDetails}
        </Button>
      </div>
    </div>
  );
}
