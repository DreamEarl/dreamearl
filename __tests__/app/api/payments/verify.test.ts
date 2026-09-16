/**
 * @jest-environment node
 */
import { createSupabaseMock } from "@/__tests__/utils/supabase-mock";

const mockCreateClient = jest.fn();
jest.mock("@/lib/supabase/server", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

const mockVerifyPaymentSignature = jest.fn();
jest.mock("@/lib/razorpay/signature", () => ({
  verifyPaymentSignature: (...args: unknown[]) =>
    mockVerifyPaymentSignature(...args),
}));

import { POST } from "@/app/api/payments/verify/route";

function buildRequest(body: unknown) {
  return new Request("http://localhost/api/payments/verify", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const validBody = {
  orderId: "order-1",
  razorpay_order_id: "rzp_order_1",
  razorpay_payment_id: "pay_1",
  razorpay_signature: "sig_1",
};

const pendingOrder = {
  id: "order-1",
  user_id: "user-1",
  payment_status: "PENDING",
  razorpay_order_id: "rzp_order_1",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/payments/verify", () => {
  it("returns 401 when there is no authenticated user", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({ user: null }));
    const res = await POST(buildRequest(validBody));
    expect(res.status).toBe(401);
  });

  it("returns 400 when required fields are missing", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({}));
    const res = await POST(buildRequest({ orderId: "order-1" }));
    expect(res.status).toBe(400);
  });

  it("returns 404 when the order does not belong to the user", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        selectResult: { data: null, error: { message: "not found" } },
      }),
    );
    const res = await POST(buildRequest(validBody));
    expect(res.status).toBe(404);
  });

  it("is idempotent and short-circuits when the order is already PAID", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        selectResult: {
          data: { ...pendingOrder, payment_status: "PAID" },
          error: null,
        },
      }),
    );
    const res = await POST(buildRequest(validBody));
    expect(res.status).toBe(200);
    expect(mockVerifyPaymentSignature).not.toHaveBeenCalled();
  });

  it("rejects a payment for a razorpay order id that doesn't match the order", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        selectResult: {
          data: { ...pendingOrder, razorpay_order_id: "rzp_other" },
          error: null,
        },
      }),
    );
    const res = await POST(buildRequest(validBody));
    expect(res.status).toBe(400);
    expect(mockVerifyPaymentSignature).not.toHaveBeenCalled();
  });

  it("marks the order FAILED (not PAID) when signature verification fails", async () => {
    mockVerifyPaymentSignature.mockReturnValue(false);
    const supabase = createSupabaseMock({
      selectResult: { data: pendingOrder, error: null },
    });
    mockCreateClient.mockResolvedValue(supabase);

    const res = await POST(buildRequest(validBody));

    expect(res.status).toBe(400);
    const updateCalls = supabase.from.mock.results.flatMap(
      (r) => (r.value as { update: jest.Mock }).update.mock.calls,
    );
    expect(updateCalls.length).toBeGreaterThan(0);
    expect(updateCalls[0][0]).toEqual({ payment_status: "FAILED" });
  });

  it("marks the order PAID + CONFIRMED when the signature is valid", async () => {
    mockVerifyPaymentSignature.mockReturnValue(true);
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        selectResult: { data: pendingOrder, error: null },
        updateResult: {
          data: { id: "order-1", status: "CONFIRMED", payment_status: "PAID" },
          error: null,
        },
      }),
    );

    const res = await POST(buildRequest(validBody));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      success: true,
      orderId: "order-1",
      status: "CONFIRMED",
    });
  });
});
