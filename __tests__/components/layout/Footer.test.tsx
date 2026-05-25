import { render, screen } from "@/__tests__/utils/test-utils";
import Footer from "@/components/layout/Footer";
import { translations } from "@/lib/constants/translations";

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

describe("Footer Component", () => {
  const { footer, common } = translations;

  describe("Brand Section", () => {
    it("renders brand name", () => {
      render(<Footer />);
      expect(screen.getByText(common.brand)).toBeInTheDocument();
    });
  });

  describe("Contact Section", () => {
    it("renders contact section heading", () => {
      render(<Footer />);
      expect(screen.getByText(footer.contactUs.title)).toBeInTheDocument();
    });

    it("renders contact email", () => {
      render(<Footer />);
      expect(screen.getByText(footer.contactUs.email)).toBeInTheDocument();
    });

    it("renders response time text", () => {
      render(<Footer />);
      expect(
        screen.getByText(footer.contactUs.responseTime),
      ).toBeInTheDocument();
    });
  });

  describe("Explore Section", () => {
    it("renders Explore section heading", () => {
      render(<Footer />);
      expect(screen.getByText(footer.explore.title)).toBeInTheDocument();
    });

    it("renders About Us link", () => {
      render(<Footer />);
      const link = screen.getByText(footer.explore.links.aboutUs);
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", "/about");
    });

    it("renders Customization link", () => {
      render(<Footer />);
      const link = screen.getByText(footer.explore.links.customization);
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", "/custom-order");
    });

    it("renders Jewellery Care link", () => {
      render(<Footer />);
      const link = screen.getByText(footer.explore.links.jewelleryCare);
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", "/jewellery-care");
    });

    it("renders Blogs link", () => {
      render(<Footer />);
      const link = screen.getByText(footer.explore.links.blogs);
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", "/blogs");
    });
  });

  describe("Support Section", () => {
    it("renders Support section heading", () => {
      render(<Footer />);
      expect(screen.getByText(footer.support.title)).toBeInTheDocument();
    });

    it("renders Terms & Conditions link", () => {
      render(<Footer />);
      const link = screen.getByText(footer.support.links.termsConditions);
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", "/terms-conditions");
    });

    it("renders Privacy Policy link", () => {
      render(<Footer />);
      const link = screen.getByText(footer.support.links.privacyPolicy);
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", "/privacy-policy");
    });
  });

  describe("Copyright", () => {
    it("renders copyright text", () => {
      render(<Footer />);
      expect(screen.getByText(footer.copyright)).toBeInTheDocument();
    });
  });
});
