import { getCustomRequestTimeline } from "@/lib/customRequests/timeline";
import type { CustomRequest } from "@/lib/customRequests/types";

const base: CustomRequest = {
  id: "req-1",
  user_id: "user-1",
  full_name: "Jane Doe",
  email: "jane@example.com",
  phone: "+91 9876543210",
  product_type: "Necklace",
  message: "Pearl bag in pastel pink.",
  image_urls: [],
  status: "PENDING",
  decline_reason: null,
  created_at: "2025-09-05T00:00:00.000Z",
  updated_at: "2025-09-06T00:00:00.000Z",
};

describe("getCustomRequestTimeline", () => {
  it("marks steps up to the current status as complete for an in-progress pipeline status", () => {
    const steps = getCustomRequestTimeline({ ...base, status: "CONFIRMED" });
    expect(steps.map((s) => s.key)).toEqual([
      "PENDING",
      "IN_DISCUSSION",
      "CONFIRMED",
      "IN_PRODUCTION",
      "COMPLETED",
    ]);
    expect(steps.find((s) => s.key === "CONFIRMED")?.isComplete).toBe(true);
    expect(steps.find((s) => s.key === "IN_PRODUCTION")?.isComplete).toBe(
      false,
    );
  });

  it("returns a two-step placed/cancelled timeline for CANCELLED", () => {
    const steps = getCustomRequestTimeline({ ...base, status: "CANCELLED" });
    expect(steps.map((s) => s.key)).toEqual(["PENDING", "CANCELLED"]);
    expect(steps.every((s) => s.isComplete)).toBe(true);
  });

  it("returns a two-step placed/declined timeline for DECLINED", () => {
    const steps = getCustomRequestTimeline({
      ...base,
      status: "DECLINED",
      decline_reason: "Out of stock materials.",
    });
    expect(steps.map((s) => s.key)).toEqual(["PENDING", "DECLINED"]);
    expect(steps.every((s) => s.isComplete)).toBe(true);
  });
});
