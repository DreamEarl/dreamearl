/**
 * @jest-environment node
 */
import crypto from "node:crypto";
import { createSupabaseMock } from "@/__tests__/utils/supabase-mock";

const mockCreateAdminClient = jest.fn();
jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: (...args: unknown[]) => mockCreateAdminClient(...args),
}));

import { POST } from "@/app/api/payments/webhook/route";

const WEBHOOK_SECRET = "test_webhook_secret";

function sign(rawBody: string) {
  return crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
}

function buildRequest(rawBody: string, signature?: string) {
  const headers: Record<string, string> = {};
  if (signature !== undefined) headers["x-razorpay-signature"] = signature;
  return new Request("http://localhost/api/payments/webhook", {
    method: "POST",
    body: rawBody,
    headers,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.RAZORPAY_WEBHOOK_SECRET = WEBHOOK_SECRET;
});

describe("POST /api/payments/webhook", () => {
  it("rejects a request with a missing signature header", async () => {
    const res = await POST(
      buildRequest(JSON.stringify({ event: "order.paid", payload: {} })),
    );
    expect(res.status).toBe(400);
    expect(mockCreateAdminClient).not.toHaveBeenCalled();
  });

  it("rejects a request with an invalid signature", async () => {
    const rawBody = JSON.stringify({ event: "order.paid", payload: {} });
    const res = await POST(buildRequest(rawBody, "not-the-right-signature"));
    expect(res.status).toBe(400);
    expect(mockCreateAdminClient).not.toHaveBeenCalled();
  });

  it("acknowledges but ignores events that aren't order.paid/payment.captured", async () => {
    const rawBody = JSON.stringify({
      event: "payment.authorized",
      payload: {
        payment: { entity: { id: "pay_1", order_id: "rzp_order_1" } },
      },
    });
    const res = await POST(buildRequest(rawBody, sign(rawBody)));
    expect(res.status).toBe(200);
    expect(mockCreateAdminClient).not.toHaveBeenCalled();
  });

  it("marks the matching order PAID + CONFIRMED for an order.paid event", async () => {
    const supabase = createSupabaseMock({
      updateResult: { data: [{ id: "order-1" }], error: null },
    });
    mockCreateAdminClient.mockReturnValue(supabase);

    const rawBody = JSON.stringify({
      event: "order.paid",
      payload: {
        order: { entity: { id: "rzp_order_1" } },
        payment: { entity: { id: "pay_1", order_id: "rzp_order_1" } },
      },
    });

    const res = await POST(buildRequest(rawBody, sign(rawBody)));

    expect(res.status).toBe(200);
    expect(supabase.from).toHaveBeenCalledWith("orders");
    const updateCalls = supabase.from.mock.results.flatMap(
      (r) => (r.value as { update: jest.Mock }).update.mock.calls,
    );
    expect(updateCalls[0][0]).toEqual(
      expect.objectContaining({ payment_status: "PAID", status: "CONFIRMED" }),
    );
  });

  it("still returns 200 when no matching pending order is found (already processed)", async () => {
    const supabase = createSupabaseMock({
      updateResult: { data: [], error: null },
    });
    mockCreateAdminClient.mockReturnValue(supabase);

    const rawBody = JSON.stringify({
      event: "order.paid",
      payload: { order: { entity: { id: "rzp_order_unknown" } } },
    });

    const res = await POST(buildRequest(rawBody, sign(rawBody)));
    expect(res.status).toBe(200);
  });
});
