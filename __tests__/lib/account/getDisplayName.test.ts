import { getDisplayName } from "@/lib/account/getDisplayName";
import type { User } from "@supabase/supabase-js";

function buildUser(overrides: Partial<User>): User {
  return {
    id: "user-1",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00.000Z",
    email: "jane@example.com",
    ...overrides,
  } as User;
}

describe("getDisplayName", () => {
  it("prefers the first_name from sign-up metadata", () => {
    const user = buildUser({ user_metadata: { first_name: "Jane" } });
    expect(getDisplayName(user)).toBe("Jane");
  });

  it("falls back to the first word of full_name from OAuth metadata", () => {
    const user = buildUser({ user_metadata: { full_name: "Jane Doe" } });
    expect(getDisplayName(user)).toBe("Jane");
  });

  it("falls back to the first word of name when full_name is missing", () => {
    const user = buildUser({ user_metadata: { name: "Jane Doe" } });
    expect(getDisplayName(user)).toBe("Jane");
  });

  it("falls back to the email prefix when no name metadata is present", () => {
    const user = buildUser({ user_metadata: {}, email: "jane@example.com" });
    expect(getDisplayName(user)).toBe("jane");
  });

  it("falls back to 'there' when no name or email is available", () => {
    const user = buildUser({ user_metadata: {}, email: undefined });
    expect(getDisplayName(user)).toBe("there");
  });
});
