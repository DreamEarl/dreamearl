import { renderHook, act } from "@testing-library/react";
import { useGoogleAuth } from "@/components/login/hooks/useGoogleAuth";
import { translations } from "@/lib/constants/translations";

const mockSignInWithOAuth = jest.fn();

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: (...args: unknown[]) => mockSignInWithOAuth(...args),
    },
  }),
}));

describe("useGoogleAuth", () => {
  const { errors } = translations.login;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls signInWithOAuth with the google provider", async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(mockSignInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({ provider: "google" }),
    );
    expect(result.current.error).toBeNull();
  });

  it("sets an error message when the OAuth request fails", async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: { message: "bad" } });
    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(result.current.error).toBe(errors.google);
    expect(result.current.loading).toBe(false);
  });
});
