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

const mockSendDeclineEmail = jest.fn().mockResolvedValue(undefined);
jest.mock("@/lib/customRequests/notifyDecline", () => ({
  sendCustomRequestDeclineEmail: (...args: unknown[]) =>
    mockSendDeclineEmail(...args),
}));

import { PATCH } from "@/app/api/admin/custom-requests/[requestId]/route";

function buildRequest(body?: unknown) {
  return new Request("http://localhost/api/admin/custom-requests/req-1", {
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

function buildParams() {
  return { params: Promise.resolve({ requestId: "req-1" }) };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("PATCH /api/admin/custom-requests/[requestId]", () => {
  it("returns 403 when there is no authenticated user", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({ user: null }));
    const res = await PATCH(
      buildRequest({ status: "IN_DISCUSSION" }),
      buildParams(),
    );
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
    const res = await PATCH(
      buildRequest({ status: "IN_DISCUSSION" }),
      buildParams(),
    );
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

  it("returns 400 when declining without a reason", async () => {
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
      buildRequest({ status: "DECLINED" }),
      buildParams(),
    );
    expect(res.status).toBe(400);
    expect(mockSendDeclineEmail).not.toHaveBeenCalled();
  });

  it("updates the status for an admin", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        user: { id: "admin-1", email: "owner@example.com" },
      }),
    );
    mockCreateAdminClient.mockReturnValue(
      createSupabaseMock({
        selectResult: { data: { user_id: "admin-1" }, error: null },
        updateResult: {
          data: { id: "req-1", status: "IN_DISCUSSION", decline_reason: null },
          error: null,
        },
      }),
    );
    const res = await PATCH(
      buildRequest({ status: "IN_DISCUSSION" }),
      buildParams(),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.customRequest.status).toBe("IN_DISCUSSION");
    expect(mockSendDeclineEmail).not.toHaveBeenCalled();
  });

  it("declines with a reason and notifies the customer", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        user: { id: "admin-1", email: "owner@example.com" },
      }),
    );
    const declinedRow = {
      id: "req-1",
      email: "jane@example.com",
      full_name: "Jane Doe",
      product_type: "Necklace",
      status: "DECLINED",
      decline_reason: "We can't source this material right now.",
    };
    mockCreateAdminClient.mockReturnValue(
      createSupabaseMock({
        selectResult: { data: { user_id: "admin-1" }, error: null },
        updateResult: { data: declinedRow, error: null },
      }),
    );
    const res = await PATCH(
      buildRequest({
        status: "DECLINED",
        declineReason: "We can't source this material right now.",
      }),
      buildParams(),
    );
    expect(res.status).toBe(200);
    expect(mockSendDeclineEmail).toHaveBeenCalledWith(
      declinedRow,
      "We can't source this material right now.",
    );
  });

  it("returns 404 when the custom request doesn't exist", async () => {
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
    const res = await PATCH(
      buildRequest({ status: "IN_DISCUSSION" }),
      buildParams(),
    );
    expect(res.status).toBe(404);
  });
});
