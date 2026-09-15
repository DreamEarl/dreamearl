import { render, screen } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import SignInForm from "@/components/login/SignInForm";
import { translations } from "@/lib/constants/translations";

const mockPush = jest.fn();
const mockSignInWithPassword = jest.fn().mockResolvedValue({ error: null });
const mockSignInWithOAuth = jest.fn().mockResolvedValue({ error: null });
const mockResetPasswordForEmail = jest.fn().mockResolvedValue({ error: null });

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: (...args: unknown[]) =>
        mockSignInWithPassword(...args),
      signInWithOAuth: (...args: unknown[]) => mockSignInWithOAuth(...args),
      resetPasswordForEmail: (...args: unknown[]) =>
        mockResetPasswordForEmail(...args),
    },
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe("SignInForm", () => {
  const { signIn, continueWith, google } = translations.login;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders email, password, and remember me fields", () => {
      render(<SignInForm />);
      expect(
        screen.getByLabelText(signIn.emailPlaceholder),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(signIn.passwordPlaceholder),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(signIn.rememberMe)).toBeInTheDocument();
    });

    it("renders the google sign-in option", () => {
      render(<SignInForm />);
      expect(screen.getByText(`${continueWith} ${google}`)).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("toggles the remember me checkbox", async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const checkbox = screen.getByLabelText(signIn.rememberMe);
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it("submits the form with email and password", async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      await user.type(
        screen.getByLabelText(signIn.emailPlaceholder),
        "jane@example.com",
      );
      await user.type(
        screen.getByLabelText(signIn.passwordPlaceholder),
        "password123",
      );
      await user.click(screen.getByRole("button", { name: signIn.submit }));

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "jane@example.com",
        password: "password123",
      });
    });

    it("shows an error when forgot password is clicked without an email", async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      await user.click(screen.getByText(signIn.forgotPassword));

      expect(screen.getByRole("alert")).toHaveTextContent(
        translations.login.errors.emailRequired,
      );
    });

    it("sends a password reset email and shows a notice", async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      await user.type(
        screen.getByLabelText(signIn.emailPlaceholder),
        "jane@example.com",
      );
      await user.click(screen.getByText(signIn.forgotPassword));

      expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
        "jane@example.com",
        expect.any(Object),
      );
      expect(screen.getByRole("status")).toHaveTextContent(
        translations.login.success.forgotPassword,
      );
    });
  });
});
