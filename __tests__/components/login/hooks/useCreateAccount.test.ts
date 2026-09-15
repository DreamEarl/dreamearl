import { renderHook, act } from "@testing-library/react";
import { useCreateAccount } from "@/components/login/hooks/useCreateAccount";
import { translations } from "@/lib/constants/translations";

const mockPush = jest.fn();
const mockSignUp = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signUp: (...args: unknown[]) => mockSignUp(...args),
    },
  }),
}));

describe("useCreateAccount", () => {
  const { errors, success } = translations.login;
  const preventDefault = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("blocks submission until terms are agreed to", async () => {
    const { result } = renderHook(() => useCreateAccount());

    await act(async () => {
      await result.current.createAccount({ preventDefault });
    });

    expect(mockSignUp).not.toHaveBeenCalled();
    expect(result.current.error).toBe(errors.termsRequired);
  });

  it("shows a confirmation notice when email confirmation is required", async () => {
    mockSignUp.mockResolvedValue({ data: { session: null }, error: null });
    const { result } = renderHook(() => useCreateAccount());

    act(() => {
      result.current.setFirstName("Jane");
      result.current.setLastName("Doe");
      result.current.setEmail("jane@example.com");
      result.current.setPhone("+1234567890");
      result.current.setPassword("password123");
      result.current.setUpdatesOptIn(true);
      result.current.setAgreedToTerms(true);
    });

    await act(async () => {
      await result.current.createAccount({ preventDefault });
    });

    expect(mockSignUp).toHaveBeenCalledWith({
      email: "jane@example.com",
      password: "password123",
      options: {
        data: {
          first_name: "Jane",
          last_name: "Doe",
          phone: "+1234567890",
          updates_opt_in: true,
        },
      },
    });
    expect(result.current.notice).toBe(success.signUpConfirm);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("redirects to the account page when a session is created immediately", async () => {
    mockSignUp.mockResolvedValue({
      data: { session: { access_token: "token" } },
      error: null,
    });
    const { result } = renderHook(() => useCreateAccount());

    act(() => {
      result.current.setAgreedToTerms(true);
    });

    await act(async () => {
      await result.current.createAccount({ preventDefault });
    });

    expect(mockPush).toHaveBeenCalledWith("/account");
    expect(result.current.notice).toBeNull();
  });

  it("sets an error message when sign up fails", async () => {
    mockSignUp.mockResolvedValue({ error: { message: "bad" } });
    const { result } = renderHook(() => useCreateAccount());

    act(() => {
      result.current.setAgreedToTerms(true);
    });

    await act(async () => {
      await result.current.createAccount({ preventDefault });
    });

    expect(result.current.error).toBe(errors.signUp);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
