/**
 * @jest-environment node
 */
import { createSupabaseMock } from "@/__tests__/utils/supabase-mock";

const mockCreateClient = jest.fn();
jest.mock("@/lib/supabase/server", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

import { GET, POST } from "@/app/api/addresses/route";

function buildRequest(body?: unknown) {
  return new Request("http://localhost/api/addresses", {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

const validInput = {
  fullName: "Sakshi Mandlik",
  phone: "9876543210",
  line1: "221B Baker Street",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560001",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/addresses", () => {
  it("returns 401 when there is no authenticated user", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({ user: null }));
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns the user's addresses", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        selectResult: { data: [{ id: "addr-1" }], error: null },
      }),
    );
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ addresses: [{ id: "addr-1" }] });
  });
});

describe("POST /api/addresses", () => {
  it("returns 401 when there is no authenticated user", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({ user: null }));
    const res = await POST(buildRequest(validInput));
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid input", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({ selectResult: { data: [], error: null, count: 0 } }),
    );
    const res = await POST(buildRequest({ ...validInput, fullName: "" }));
    expect(res.status).toBe(400);
  });

  it("marks the first saved address as default", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        selectResult: { data: [], error: null, count: 0 },
        insertResult: {
          data: { id: "addr-1", ...validInput, is_default: true },
          error: null,
        },
      }),
    );
    const res = await POST(buildRequest(validInput));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.address.is_default).toBe(true);
  });

  it("returns 500 when the insert fails", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        selectResult: { data: [], error: null, count: 1 },
        insertResult: { data: null, error: { message: "insert failed" } },
      }),
    );
    const res = await POST(buildRequest(validInput));
    expect(res.status).toBe(500);
  });
});
