import { Sparkles } from "lucide-react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import CustomRequestCard from "@/components/account/CustomRequestCard";
import { translations } from "@/lib/constants/translations";
import type { CustomRequest } from "@/lib/customRequests/types";

interface CustomRequestsPanelProps {
  requests: CustomRequest[];
}

export default function CustomRequestsPanel({
  requests,
}: Readonly<CustomRequestsPanelProps>) {
  const { customRequests: t } = translations.account;

  return (
    <div id="custom-requests-panel">
      <Heading
        id="custom-requests-panel-title"
        variant="cart"
        className="border-b border-black inline-block pb-2 mb-6 uppercase"
      >
        {t.title}
      </Heading>

      {requests.length === 0 ? (
        <div
          id="custom-requests-panel-empty"
          className="flex flex-col items-center text-center py-16 px-6"
        >
          <Sparkles
            id="custom-requests-panel-empty-icon"
            className="w-16 h-16 text-[#5f1631] mb-4"
            strokeWidth={1.25}
          />
          <Heading
            id="custom-requests-panel-empty-title"
            variant="product"
            className="mb-3 font-glacial"
          >
            {t.emptyTitle}
          </Heading>
          <Text
            id="custom-requests-panel-empty-message"
            variant="muted"
            className="mb-8"
          >
            {t.empty}
          </Text>
          <Button
            id="custom-requests-panel-empty-cta"
            variant="primary"
            size="sm"
            href="/custom-order"
          >
            {t.placeRequest}
          </Button>
        </div>
      ) : (
        <div id="custom-requests-panel-list">
          {requests.map((request) => (
            <CustomRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}
