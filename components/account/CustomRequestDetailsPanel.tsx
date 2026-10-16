import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import CustomRequestStatusBadge from "@/components/account/CustomRequestStatusBadge";
import {
  formatCustomRequestDate,
  getCustomRequestImages,
  getCustomRequestTitle,
} from "@/lib/customRequests/status";
import { getCustomRequestTimeline } from "@/lib/customRequests/timeline";
import { translations } from "@/lib/constants/translations";
import type { CustomRequest } from "@/lib/customRequests/types";

interface CustomRequestDetailsPanelProps {
  request: CustomRequest;
}

export default function CustomRequestDetailsPanel({
  request,
}: Readonly<CustomRequestDetailsPanelProps>) {
  const { account, footer } = translations;
  const t = account.customRequestDetails;
  const requestCode = request.id.slice(0, 8).toUpperCase();
  const timeline = getCustomRequestTimeline(request);
  const title = getCustomRequestTitle(request);
  const images = getCustomRequestImages(request);

  return (
    <div id="custom-request-details-panel">
      <Heading
        id="custom-request-details-panel-title"
        variant="cart"
        className="border-b border-black inline-block pb-2 mb-6 uppercase"
      >
        {t.title}
      </Heading>

      <div className="flex items-start justify-between mb-6">
        <div>
          <Text
            id="custom-request-details-panel-request-number"
            variant="body"
            className="font-medium"
          >
            {t.requestNumber}
            {requestCode}
          </Text>
          <Text
            id="custom-request-details-panel-requested-on"
            variant="caption"
          >
            {t.requestedOn} {formatCustomRequestDate(request.created_at)}
          </Text>
        </div>
        <CustomRequestStatusBadge
          id="custom-request-details-panel-status"
          status={request.status}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          id="custom-request-details-panel-product"
          className="md:col-span-2 border border-gray-200 p-6"
        >
          <Text variant="label" className="font-medium text-black mb-4">
            {t.productTitle}
          </Text>

          <div className="flex gap-4">
            {images.length > 0 && (
              <div
                id="custom-request-details-panel-images"
                className="flex flex-wrap gap-2 shrink-0"
              >
                {images.map((url, index) => (
                  <div
                    key={url}
                    className="relative w-20 h-20 bg-gray-50 overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`${title} reference ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            <div>
              <Text variant="body" className="font-medium">
                {title}
              </Text>
              <Text variant="caption">
                {t.productType} {request.product_type}
              </Text>
            </div>
          </div>

          <div
            id="custom-request-details-panel-message"
            className="border-t border-gray-100 pt-4 mt-4"
          >
            <Text variant="label" className="font-medium text-black mb-2">
              {t.messageTitle}
            </Text>
            <Text variant="muted" className="italic">
              &ldquo;{request.message}&rdquo;
            </Text>
          </div>
        </div>

        <div
          id="custom-request-details-panel-timeline"
          className="border border-gray-200 p-6"
        >
          <Text variant="label" className="font-medium text-black mb-4">
            {t.timelineTitle}
          </Text>
          <ol id="custom-request-details-panel-timeline-list">
            {timeline.map((step, index) => (
              <li key={step.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      step.isComplete ? "bg-[#5f1631]" : "bg-gray-200"
                    }`}
                  />
                  {index < timeline.length - 1 && (
                    <span
                      className={`w-px flex-1 ${
                        step.isComplete ? "bg-[#5f1631]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-6">
                  <Text
                    variant="body"
                    className={
                      step.isComplete ? "font-medium" : "text-gray-400"
                    }
                  >
                    {step.label}
                  </Text>
                  {step.timestamp && (
                    <Text variant="caption">{step.timestamp}</Text>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {request.status === "DECLINED" && request.decline_reason && (
        <div
          id="custom-request-details-panel-decline-reason"
          className="border border-red-200 bg-red-50 p-6 mb-6"
        >
          <Text variant="label" className="font-medium text-red-700 mb-2">
            {t.declineReasonTitle}
          </Text>
          <Text variant="caption" className="text-red-700">
            {request.decline_reason}
          </Text>
        </div>
      )}

      <div
        id="custom-request-details-panel-help"
        className="border border-gray-200 p-6"
      >
        <Text variant="label" className="font-medium text-black mb-2">
          {t.needHelpTitle}
        </Text>
        <Text variant="caption" className="mb-4">
          {t.needHelpMessage}
        </Text>
        <Button
          id="custom-request-details-panel-help-contact"
          variant="primary"
          size="sm"
          href={`mailto:${footer.contactUs.email}`}
        >
          {t.contactUs}
        </Button>
      </div>
    </div>
  );
}
