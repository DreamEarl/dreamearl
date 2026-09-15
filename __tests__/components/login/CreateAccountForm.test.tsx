import { render, screen } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import CreateAccountForm from "@/components/login/CreateAccountForm";
import { translations } from "@/lib/constants/translations";

const mockSignUp = jest
  .fn()
  .mockResolvedValue({ data: { session: null }, error: null });

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signUp: (...args: unknown[]) => mockSignUp(...args),
    },
  }),
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

describe("CreateAccountForm", () => {
  const { createAccount } = translations.login;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fillRequiredFields = async (
    user: ReturnType<typeof userEvent.setup>,
  ) => {
    await user.type(
      screen.getByLabelText(createAccount.firstNamePlaceholder),
      "Jane",
    );
    await user.type(
      screen.getByLabelText(createAccount.lastNamePlaceholder),
      "Doe",
    );
    await user.type(
      screen.getByLabelText(createAccount.emailPlaceholder),
      "jane@example.com",
    );
    await user.type(
      screen.getByLabelText(createAccount.passwordPlaceholder),
      "password123",
    );
  };

  describe("Rendering", () => {
    it("renders all fields and checkboxes", () => {
      render(<CreateAccountForm />);
      expect(
        screen.getByLabelText(createAccount.firstNamePlaceholder),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(createAccount.lastNamePlaceholder),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(createAccount.emailPlaceholder),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(createAccount.phonePlaceholder),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(createAccount.passwordPlaceholder),
      ).toBeInTheDocument();
      expect(screen.getByText(createAccount.updatesOptIn)).toBeInTheDocument();
      expect(
        screen.getByText(createAccount.agreeToTerms, { exact: false }),
      ).toBeInTheDocument();
    });

    it("links to the terms and privacy pages", () => {
      render(<CreateAccountForm />);
      expect(
        screen.getByText(createAccount.termsOfService).closest("a"),
      ).toHaveAttribute("href", "/terms-conditions");
      expect(
        screen.getByText(createAccount.privacyPolicy).closest("a"),
      ).toHaveAttribute("href", "/privacy-policy");
    });
  });

  describe("Interactions", () => {
    it("blocks submission until terms are agreed to", async () => {
      const user = userEvent.setup();
      render(<CreateAccountForm />);

      await fillRequiredFields(user);
      await user.click(
        screen.getByRole("button", { name: createAccount.submit }),
      );

      expect(mockSignUp).not.toHaveBeenCalled();
      expect(screen.getByRole("alert")).toHaveTextContent(
        translations.login.errors.termsRequired,
      );
    });

    it("submits sign up details once terms are agreed to", async () => {
      const user = userEvent.setup();
      render(<CreateAccountForm />);

      await fillRequiredFields(user);
      await user.type(
        screen.getByLabelText(createAccount.phonePlaceholder),
        "+1234567890",
      );
      await user.click(
        screen.getByText(createAccount.agreeToTerms, { exact: false }),
      );
      await user.click(
        screen.getByRole("button", { name: createAccount.submit }),
      );

      expect(mockSignUp).toHaveBeenCalledWith({
        email: "jane@example.com",
        password: "password123",
        options: {
          data: {
            first_name: "Jane",
            last_name: "Doe",
            phone: "+1234567890",
            updates_opt_in: false,
          },
        },
      });
      expect(screen.getByRole("status")).toHaveTextContent(
        translations.login.success.signUpConfirm,
      );
    });
  });
});
