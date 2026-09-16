/**
 * @jest-environment node
 */
import { createSupabaseMock } from "@/__tests__/utils/supabase-mock";

const mockCreateClient = jest.fn();
jest.mock("@/lib/supabase/server", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

import { POST } from "@/app/api/payments/mark-failed/route";

function buildRequest(body: unknown) {
  return new Request("http://localhost/api/payments/mark-failed", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/payments/mark-failed", () => {
  it("returns 401 when there is no authenticated user", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({ user: null }));
    const res = await POST(buildRequest({ orderId: "order-1" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when orderId is missing", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({}));
    const res = await POST(buildRequest({}));
    expect(res.status).toBe(400);
  });

  it("marks the order FAILED for the owning user", async () => {
    const supabase = createSupabaseMock({});
    mockCreateClient.mockResolvedValue(supabase);

    const res = await POST(buildRequest({ orderId: "order-1" }));

    expect(res.status).toBe(200);
    const updateCalls = supabase.from.mock.results.flatMap(
      (r) => (r.value as { update: jest.Mock }).update.mock.calls,
    );
    expect(updateCalls[0][0]).toEqual({ payment_status: "FAILED" });
  });
});
