/**
 * @jest-environment node
 */
import { createSupabaseMock } from "@/__tests__/utils/supabase-mock";

const mockCreateClient = jest.fn();
jest.mock("@/lib/supabase/server", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

const mockCreateAdminClient = jest.fn();
jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: (...args: unknown[]) => mockCreateAdminClient(...args),
}));

import { PATCH } from "@/app/api/admin/orders/[orderId]/route";

function buildRequest(body?: unknown) {
  return new Request("http://localhost/api/admin/orders/order-1", {
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

function buildParams() {
  return { params: Promise.resolve({ orderId: "order-1" }) };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("PATCH /api/admin/orders/[orderId]", () => {
  it("returns 403 when there is no authenticated user", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({ user: null }));
    const res = await PATCH(buildRequest({ status: "SHIPPED" }), buildParams());
    expect(res.status).toBe(403);
    expect(mockCreateAdminClient).not.toHaveBeenCalled();
  });

  it("returns 403 when the signed-in user is not an admin", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        user: { id: "user-1", email: "customer@example.com" },
      }),
    );
    mockCreateAdminClient.mockReturnValue(
      createSupabaseMock({ selectResult: { data: null, error: null } }),
    );
    const res = await PATCH(buildRequest({ status: "SHIPPED" }), buildParams());
    expect(res.status).toBe(403);
  });

  it("returns 400 for an invalid status value", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        user: { id: "admin-1", email: "owner@example.com" },
      }),
    );
    mockCreateAdminClient.mockReturnValue(
      createSupabaseMock({
        selectResult: { data: { user_id: "admin-1" }, error: null },
      }),
    );
    const res = await PATCH(
      buildRequest({ status: "NOT_REAL" }),
      buildParams(),
    );
    expect(res.status).toBe(400);
  });

  it("updates the order status for an admin", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        user: { id: "admin-1", email: "owner@example.com" },
      }),
    );
    mockCreateAdminClient.mockReturnValue(
      createSupabaseMock({
        selectResult: { data: { user_id: "admin-1" }, error: null },
        updateResult: {
          data: { id: "order-1", status: "SHIPPED" },
          error: null,
        },
      }),
    );
    const res = await PATCH(buildRequest({ status: "SHIPPED" }), buildParams());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.order).toEqual({ id: "order-1", status: "SHIPPED" });
  });

  it("returns 404 when the order doesn't exist", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        user: { id: "admin-1", email: "owner@example.com" },
      }),
    );
    mockCreateAdminClient.mockReturnValue(
      createSupabaseMock({
        selectResult: { data: { user_id: "admin-1" }, error: null },
        updateResult: { data: null, error: { message: "not found" } },
      }),
    );
    const res = await PATCH(buildRequest({ status: "SHIPPED" }), buildParams());
    expect(res.status).toBe(404);
  });
});
