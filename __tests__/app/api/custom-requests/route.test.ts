/**
 * @jest-environment node
 */
import { createSupabaseMock } from "@/__tests__/utils/supabase-mock";

const mockCreateClient = jest.fn();
jest.mock("@/lib/supabase/server", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

import { POST } from "@/app/api/custom-requests/route";

function buildRequest(body?: unknown) {
  return new Request("http://localhost/api/custom-requests", {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

const validInput = {
  productType: "Necklace",
  message: "Pearl bag in pastel pink with detachable chain.",
  imageUrl: "https://example.com/inspiration.png",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/custom-requests", () => {
  it("returns 401 when there is no authenticated user", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({ user: null }));
    const res = await POST(buildRequest(validInput));
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid input", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({}));
    const res = await POST(buildRequest({ ...validInput, productType: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for a missing/invalid body", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({}));
    const res = await POST(buildRequest());
    expect(res.status).toBe(400);
  });

  it("saves the custom request for the signed-in user", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        insertResult: {
          data: {
            id: "req-1",
            user_id: "user-1",
            product_type: "Necklace",
            message: validInput.message,
            image_url: validInput.imageUrl,
            status: "PENDING",
          },
          error: null,
        },
      }),
    );
    const res = await POST(buildRequest(validInput));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.customRequest.status).toBe("PENDING");
  });

  it("returns 500 when the insert fails", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        insertResult: { data: null, error: { message: "insert failed" } },
      }),
    );
    const res = await POST(buildRequest(validInput));
    expect(res.status).toBe(500);
  });
});
