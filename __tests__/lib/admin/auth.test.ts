/**
 * @jest-environment node
 */
import { createSupabaseMock } from "@/__tests__/utils/supabase-mock";

const mockCreateAdminClient = jest.fn();
jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: (...args: unknown[]) => mockCreateAdminClient(...args),
}));

import { isAdmin } from "@/lib/admin/auth";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("isAdmin", () => {
  it("returns false for a null/undefined user id without querying the db", async () => {
    expect(await isAdmin(null)).toBe(false);
    expect(await isAdmin(undefined)).toBe(false);
    expect(mockCreateAdminClient).not.toHaveBeenCalled();
  });

  it("returns true when the user id is in the admins table", async () => {
    mockCreateAdminClient.mockReturnValue(
      createSupabaseMock({
        selectResult: { data: { user_id: "user-1" }, error: null },
      }),
    );
    expect(await isAdmin("user-1")).toBe(true);
  });

  it("returns false when the user id is not in the admins table", async () => {
    mockCreateAdminClient.mockReturnValue(
      createSupabaseMock({ selectResult: { data: null, error: null } }),
    );
    expect(await isAdmin("user-2")).toBe(false);
  });
});
