/**
 * @jest-environment node
 */
import { createSupabaseMock } from "@/__tests__/utils/supabase-mock";

const mockCreateClient = jest.fn();
jest.mock("@/lib/supabase/server", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

import { PATCH, DELETE } from "@/app/api/addresses/[addressId]/route";

const validInput = {
  fullName: "Sakshi Mandlik",
  phone: "9876543210",
  line1: "221B Baker Street",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560001",
};

function buildRequest(body?: unknown) {
  return new Request("http://localhost/api/addresses/addr-1", {
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

function buildParams() {
  return { params: Promise.resolve({ addressId: "addr-1" }) };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("PATCH /api/addresses/[addressId]", () => {
  it("returns 401 when there is no authenticated user", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({ user: null }));
    const res = await PATCH(buildRequest(validInput), buildParams());
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid input", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({}));
    const res = await PATCH(
      buildRequest({ ...validInput, phone: "" }),
      buildParams(),
    );
    expect(res.status).toBe(400);
  });

  it("updates the address with the given fields", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        updateResult: {
          data: { id: "addr-1", ...validInput, is_default: false },
          error: null,
        },
      }),
    );
    const res = await PATCH(buildRequest(validInput), buildParams());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.address.id).toBe("addr-1");
  });

  it("returns 404 when the address doesn't belong to the user", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        updateResult: { data: null, error: { message: "not found" } },
      }),
    );
    const res = await PATCH(buildRequest(validInput), buildParams());
    expect(res.status).toBe(404);
  });

  it("sets an address as default without requiring the full form", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        updateResult: { data: { id: "addr-1", is_default: true }, error: null },
      }),
    );
    const res = await PATCH(buildRequest({ isDefault: true }), buildParams());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.address.is_default).toBe(true);
  });
});

describe("DELETE /api/addresses/[addressId]", () => {
  it("returns 401 when there is no authenticated user", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({ user: null }));
    const res = await DELETE(new Request("http://localhost"), buildParams());
    expect(res.status).toBe(401);
  });

  it("removes the address", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({ deleteResult: { data: null, error: null } }),
    );
    const res = await DELETE(new Request("http://localhost"), buildParams());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ success: true });
  });

  it("returns 500 when the delete fails", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        deleteResult: { data: null, error: { message: "failed" } },
      }),
    );
    const res = await DELETE(new Request("http://localhost"), buildParams());
    expect(res.status).toBe(500);
  });
});
