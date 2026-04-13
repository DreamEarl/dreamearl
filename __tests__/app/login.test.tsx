import { render, screen } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/login/page";
import { translations } from "@/lib/constants/translations";

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
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
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
    it("renders the page heading", () => {
      render(<LoginPage />);
      expect(
        screen.getByRole("heading", { name: login.title }),
      ).toBeInTheDocument();
    });

    it("renders subtitle text", () => {
      render(<LoginPage />);
      expect(screen.getByText(login.subtitle)).toBeInTheDocument();
    });

    it("renders Continue with Google button", () => {
      render(<LoginPage />);
      expect(
        screen.getByText(`${login.continueWith} ${login.google}`),
      ).toBeInTheDocument();
    });

    it("renders Google logo image", () => {
      render(<LoginPage />);
      expect(screen.getByAltText("Google logo")).toBeInTheDocument();
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

    it("renders Return to Store link to /", () => {
      render(<LoginPage />);
      const returnLink = screen.getByText(login.returnToStore).closest("a");
      expect(returnLink).toHaveAttribute("href", "/");
    });

    it("renders terms text", () => {
      render(<LoginPage />);
      expect(screen.getByText(login.termsText)).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("Google button triggers login handler", async () => {
      const consoleSpy = jest
        .spyOn(console, "log")
        .mockImplementation(() => {});
      const user = userEvent.setup();

      render(<LoginPage />);
      const googleBtn = screen.getByText(
        `${login.continueWith} ${login.google}`,
      );
      await user.click(googleBtn);

      expect(consoleSpy).toHaveBeenCalledWith("Login with google");
      consoleSpy.mockRestore();
    });
  });
});
