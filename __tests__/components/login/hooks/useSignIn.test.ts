import { renderHook, act } from "@testing-library/react";
import { useSignIn } from "@/components/login/hooks/useSignIn";
import { translations } from "@/lib/constants/translations";

const mockPush = jest.fn();
const mockSignInWithPassword = jest.fn();
const mockResetPasswordForEmail = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: (...args: unknown[]) =>
        mockSignInWithPassword(...args),
      resetPasswordForEmail: (...args: unknown[]) =>
        mockResetPasswordForEmail(...args),
    },
  }),
}));

describe("useSignIn", () => {
  const { errors, success } = translations.login;
  const preventDefault = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("starts with empty fields and no feedback", () => {
    const { result } = renderHook(() => useSignIn());
    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.rememberMe).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.notice).toBeNull();
  });

  it("signs in and redirects home on success", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setEmail("jane@example.com");
      result.current.setPassword("password123");
    });

    await act(async () => {
      await result.current.signIn({ preventDefault });
    });

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "jane@example.com",
      password: "password123",
    });
    expect(mockPush).toHaveBeenCalledWith("/account");
  });

  it("sets an error message when sign in fails", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: { message: "bad" } });
    const { result } = renderHook(() => useSignIn());

    await act(async () => {
      await result.current.signIn({ preventDefault });
    });

    expect(result.current.error).toBe(errors.signIn);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("requires an email before requesting a password reset", async () => {
    const { result } = renderHook(() => useSignIn());

    await act(async () => {
      await result.current.sendPasswordReset();
    });

    expect(result.current.error).toBe(errors.emailRequired);
    expect(mockResetPasswordForEmail).not.toHaveBeenCalled();
  });

  it("sends a password reset email and shows a notice", async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setEmail("jane@example.com");
    });

    await act(async () => {
      await result.current.sendPasswordReset();
    });

    expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
      "jane@example.com",
      expect.objectContaining({ redirectTo: expect.any(String) }),
    );
    expect(result.current.notice).toBe(success.forgotPassword);
  });

  it("sets an error message when password reset fails", async () => {
    mockResetPasswordForEmail.mockResolvedValue({
      error: { message: "bad" },
    });
    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setEmail("jane@example.com");
    });

    await act(async () => {
      await result.current.sendPasswordReset();
    });

    expect(result.current.error).toBe(errors.forgotPassword);
  });
});
