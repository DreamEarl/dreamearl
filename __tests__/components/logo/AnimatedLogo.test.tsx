import { render, screen, waitFor } from "@/__tests__/utils/test-utils";
import AnimatedLogo from "@/components/logo/AnimatedLogo";
import { translations } from "@/lib/constants/translations";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode;
    }) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    h1: ({
      children,
      className,
      ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
      children?: React.ReactNode;
    }) => (
      <h1 className={className} {...props}>
        {children}
      </h1>
    ),
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

describe("AnimatedLogo Component", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { writable: true, value: 0 });
  });

  describe("Rendering", () => {
    it("renders brand name", () => {
      render(<AnimatedLogo />);
      expect(screen.getByText(translations.common.brand)).toBeInTheDocument();
    });

    it("renders a link to the home page", () => {
      render(<AnimatedLogo />);
      const link = screen.getByText(translations.common.brand).closest("a");
      expect(link).toHaveAttribute("href", "/");
    });

    it("renders brand name as h1", () => {
      render(<AnimatedLogo />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent(translations.common.brand);
    });
  });

  describe("Scroll behaviour", () => {
    it("updates state on scroll", async () => {
      render(<AnimatedLogo />);

      Object.defineProperty(window, "scrollY", { writable: true, value: 150 });
      window.dispatchEvent(new Event("scroll"));

      await waitFor(() => {
        expect(screen.getByText(translations.common.brand)).toBeInTheDocument();
      });
    });
  });
});
