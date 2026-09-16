/**
 * @jest-environment node
 */
import { createSupabaseMock } from "@/__tests__/utils/supabase-mock";

const mockCreateClient = jest.fn();
jest.mock("@/lib/supabase/server", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

import { GET } from "@/app/api/orders/[orderId]/status/route";

function buildRequest() {
  return new Request("http://localhost/api/orders/order-1/status");
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/orders/[orderId]/status", () => {
  it("returns 401 when there is no authenticated user", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({ user: null }));
    const res = await GET(buildRequest(), {
      params: Promise.resolve({ orderId: "order-1" }),
    });
    expect(res.status).toBe(401);
  });

  it("returns 404 when the order isn't found for this user", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        selectResult: { data: null, error: { message: "not found" } },
      }),
    );
    const res = await GET(buildRequest(), {
      params: Promise.resolve({ orderId: "order-1" }),
    });
    expect(res.status).toBe(404);
  });

  it("returns the current status, payment status, and total", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        selectResult: {
          data: {
            status: "CONFIRMED",
            payment_status: "PAID",
            total: 1000,
            currency: "INR",
          },
          error: null,
        },
      }),
    );
    const res = await GET(buildRequest(), {
      params: Promise.resolve({ orderId: "order-1" }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      status: "CONFIRMED",
      paymentStatus: "PAID",
      total: 1000,
      currency: "INR",
    });
  });
});
