import type {
  CustomRequest,
  CustomRequestStatus,
} from "@/lib/customRequests/types";

export interface CustomRequestTimelineStep {
  key: string;
  label: string;
  timestamp: string | null;
  isComplete: boolean;
}

const PIPELINE: CustomRequestStatus[] = [
  "PENDING",
  "IN_DISCUSSION",
  "CONFIRMED",
  "IN_PRODUCTION",
  "COMPLETED",
];

const STEP_LABELS: Record<CustomRequestStatus, string> = {
  PENDING: "Request Placed",
  IN_DISCUSSION: "In Discussion",
  CONFIRMED: "Design Finalised",
  IN_PRODUCTION: "In Production",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

// We only store the current status (not a full history), so only the placed
// step and the current step have real timestamps; steps in between are shown
// as complete without a specific time.
export function getCustomRequestTimeline(
  request: CustomRequest,
): CustomRequestTimelineStep[] {
  if (request.status === "CANCELLED") {
    return [
      {
        key: "PENDING",
        label: STEP_LABELS.PENDING,
        timestamp: formatDateTime(request.created_at),
        isComplete: true,
      },
      {
        key: "CANCELLED",
        label: STEP_LABELS.CANCELLED,
        timestamp: formatDateTime(request.updated_at),
        isComplete: true,
      },
    ];
  }

  const currentIndex = PIPELINE.indexOf(request.status);

  return PIPELINE.map((status, index) => {
    const isComplete = index <= currentIndex;
    let timestamp: string | null = null;
    if (isComplete) {
      if (index === 0) timestamp = formatDateTime(request.created_at);
      else if (index === currentIndex)
        timestamp = formatDateTime(request.updated_at);
    }

    return {
      key: status,
      label: STEP_LABELS[status],
      isComplete,
      timestamp,
    };
  });
}
