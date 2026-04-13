import { render, screen } from "@/__tests__/utils/test-utils";
import ContactUs from "@/components/layout/ContactUs";

describe("ContactUs Component", () => {
  describe("Rendering", () => {
    it("renders the main heading", () => {
      render(<ContactUs />);
      expect(screen.getByText("CONTACT US")).toBeInTheDocument();
    });

    it("renders the subtitle", () => {
      render(<ContactUs />);
      expect(
        screen.getByText(
          "Choose your preferred method of contact and connect with us",
        ),
      ).toBeInTheDocument();
    });

    it("renders brand tagline", () => {
      render(<ContactUs />);
      expect(screen.getByText("CONTACT US")).toBeInTheDocument();
    });
  });

  describe("Phone Section", () => {
    it("renders phone section heading", () => {
      render(<ContactUs />);
      expect(screen.getByText("PHONE")).toBeInTheDocument();
    });

    it("renders phone availability message", () => {
      render(<ContactUs />);
      expect(
        screen.getByText("Monday to Sunday from 11 am to 6 pm (IST)."),
      ).toBeInTheDocument();
    });

    it("renders phone number link with correct href", () => {
      render(<ContactUs />);
      const phoneLink = screen.getByText("CALL US +91 8830587508");
      expect(phoneLink).toBeInTheDocument();
      expect(phoneLink.closest("a")).toHaveAttribute(
        "href",
        "tel:+918830587508",
      );
    });

    it("phone link has phone icon", () => {
      const { container } = render(<ContactUs />);
      const phoneLink = screen.getByText("CALL US +91 8830587508");
      const linkElement = phoneLink.closest("a");
      expect(linkElement?.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Email Section", () => {
    it("renders email section heading", () => {
      render(<ContactUs />);
      expect(screen.getByText("EMAIL")).toBeInTheDocument();
    });

    it("renders email link with correct href", () => {
      render(<ContactUs />);
      const emailLink = screen.getByText(
        "Write Us at mydreamearl.shop@gmail.com",
      );
      expect(emailLink).toBeInTheDocument();
      expect(emailLink.closest("a")).toHaveAttribute(
        "href",
        "mailto:mydreamearl.shop@gmail.com",
      );
    });

    it("email link has mail icon", () => {
      const { container } = render(<ContactUs />);
      const emailLink = screen.getByText(
        "Write Us at mydreamearl.shop@gmail.com",
      );
      const linkElement = emailLink.closest("a");
      expect(linkElement?.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Instagram Section", () => {
    it("renders Instagram section heading", () => {
      render(<ContactUs />);
      expect(screen.getByText("INSTAGRAM")).toBeInTheDocument();
    });

    it("renders Instagram message", () => {
      render(<ContactUs />);
      expect(
        screen.getByText("Follow Us on Instagram & DM to place an Order"),
      ).toBeInTheDocument();
    });

    it("renders Instagram link with correct href and attributes", () => {
      render(<ContactUs />);
      const instagramLink = screen.getByText("@dreamearl.shop");
      expect(instagramLink).toBeInTheDocument();

      const linkElement = instagramLink.closest("a");
      expect(linkElement).toHaveAttribute(
        "href",
        "https://www.instagram.com/dreamearl.shop?igsh=d3RmaGJ2NnViYWM4&utm_source=qr",
      );
      expect(linkElement).toHaveAttribute("target", "_blank");
      expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("Instagram link has Instagram icon", () => {
      const { container } = render(<ContactUs />);
      const instagramLink = screen.getByText("@dreamearl.shop");
      const linkElement = instagramLink.closest("a");
      expect(linkElement?.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("has a flex column layout", () => {
      const { container } = render(<ContactUs />);
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass("flex", "flex-col");
    });

    it("contains right content section", () => {
      const { container } = render(<ContactUs />);
      const contentSection = container.querySelector(".flex-1");
      expect(contentSection).toBeInTheDocument();
    });
  });

  describe("Hover Effects", () => {
    it("phone link has hover underline class", () => {
      render(<ContactUs />);
      const phoneLink = screen.getByText("CALL US +91 8830587508").closest("a");
      expect(phoneLink).toHaveClass("hover:underline");
    });

    it("email link has hover underline class", () => {
      render(<ContactUs />);
      const emailLink = screen
        .getByText("Write Us at mydreamearl.shop@gmail.com")
        .closest("a");
      expect(emailLink).toHaveClass("hover:underline");
    });

    it("Instagram link has hover underline class", () => {
      render(<ContactUs />);
      const instagramLink = screen.getByText("@dreamearl.shop").closest("a");
      expect(instagramLink).toHaveClass("hover:underline");
    });
  });
});
