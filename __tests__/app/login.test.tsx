import { render, screen } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/login/page";
import { translations } from "@/lib/constants/translations";

const mockSignInWithOAuth = jest.fn().mockResolvedValue({ error: null });
const mockSignInWithPassword = jest.fn().mockResolvedValue({ error: null });
const mockSignUp = jest
  .fn()
  .mockResolvedValue({ data: { session: null }, error: null });
const mockResetPasswordForEmail = jest.fn().mockResolvedValue({ error: null });
const mockPush = jest.fn();

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      resetPasswordForEmail: mockResetPasswordForEmail,
    },
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
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

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("Login Page", () => {
  const { login } = translations;

  describe("Rendering", () => {
    it("renders the sign in and create account tabs", () => {
      render(<LoginPage />);
      expect(
        screen.getByRole("tab", { name: login.tabs.signIn }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: login.tabs.createAccount }),
      ).toBeInTheDocument();
    });

    it("renders the sign in form by default", () => {
      render(<LoginPage />);
      expect(
        screen.getByPlaceholderText(login.signIn.emailPlaceholder),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(login.signIn.passwordPlaceholder),
      ).toBeInTheDocument();
    });

    it("renders Continue with Google button", () => {
      render(<LoginPage />);
      expect(
        screen.getByText(`${login.continueWith} ${login.google}`),
      ).toBeInTheDocument();
    });

    it("renders OR divider", () => {
      render(<LoginPage />);
      expect(screen.getByText(login.orDivider)).toBeInTheDocument();
    });

    it("renders Continue as Guest button linking to /shop", () => {
      render(<LoginPage />);
      const guestLink = screen.getByText(login.guestCheckout).closest("a");
      expect(guestLink).toHaveAttribute("href", "/shop");
    });

    it("switches to the create account form when tab is clicked", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      await user.click(
        screen.getByRole("tab", { name: login.tabs.createAccount }),
      );

      expect(
        screen.getByPlaceholderText(login.createAccount.firstNamePlaceholder),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(login.createAccount.lastNamePlaceholder),
      ).toBeInTheDocument();
    });
  });

  describe("Sign In interactions", () => {
    it("Google button triggers signInWithOAuth", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      await user.click(
        screen.getByText(`${login.continueWith} ${login.google}`),
      );

      expect(mockSignInWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({ provider: "google" }),
      );
    });

    it("submits email and password to signInWithPassword", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      await user.type(
        screen.getByPlaceholderText(login.signIn.emailPlaceholder),
        "jane@example.com",
      );
      await user.type(
        screen.getByPlaceholderText(login.signIn.passwordPlaceholder),
        "password123",
      );
      await user.click(
        screen.getByRole("button", { name: login.signIn.submit, exact: true }),
      );

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "jane@example.com",
        password: "password123",
      });
    });

    it("shows an error message when a required email is missing for password reset", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      await user.click(screen.getByText(login.signIn.forgotPassword));

      expect(screen.getByText(login.errors.emailRequired)).toBeInTheDocument();
    });
  });

  describe("Create Account interactions", () => {
    it("shows an error when terms are not agreed to", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      await user.click(
        screen.getByRole("tab", { name: login.tabs.createAccount }),
      );
      await user.type(
        screen.getByPlaceholderText(login.createAccount.firstNamePlaceholder),
        "Jane",
      );
      await user.type(
        screen.getByPlaceholderText(login.createAccount.lastNamePlaceholder),
        "Doe",
      );
      await user.type(
        screen.getByPlaceholderText(login.createAccount.emailPlaceholder),
        "jane@example.com",
      );
      await user.type(
        screen.getByPlaceholderText(login.createAccount.passwordPlaceholder),
        "password123",
      );
      await user.click(
        screen.getByRole("button", {
          name: login.createAccount.submit,
          exact: true,
        }),
      );

      expect(mockSignUp).not.toHaveBeenCalled();
      expect(screen.getByText(login.errors.termsRequired)).toBeInTheDocument();
    });

    it("calls signUp when the form is valid and terms are agreed to", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      await user.click(
        screen.getByRole("tab", { name: login.tabs.createAccount }),
      );
      await user.type(
        screen.getByPlaceholderText(login.createAccount.firstNamePlaceholder),
        "Jane",
      );
      await user.type(
        screen.getByPlaceholderText(login.createAccount.lastNamePlaceholder),
        "Doe",
      );
      await user.type(
        screen.getByPlaceholderText(login.createAccount.emailPlaceholder),
        "jane@example.com",
      );
      await user.type(
        screen.getByPlaceholderText(login.createAccount.passwordPlaceholder),
        "password123",
      );
      await user.click(
        screen.getByText(login.createAccount.agreeToTerms, { exact: false }),
      );
      await user.click(
        screen.getByRole("button", {
          name: login.createAccount.submit,
          exact: true,
        }),
      );

      expect(mockSignUp).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "jane@example.com",
          password: "password123",
        }),
      );
    });
  });
});
