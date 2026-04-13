import { render, screen } from "@/__tests__/utils/test-utils";
import ContactPage from "@/app/contact/page";

describe("Contact Page", () => {
  describe("Rendering", () => {
    it("renders the page heading", () => {
      render(<ContactPage />);
      expect(
        screen.getByRole("heading", { name: /contact us/i }),
      ).toBeInTheDocument();
    });

    it("renders Name field", () => {
      render(<ContactPage />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    it("renders Email field", () => {
      render(<ContactPage />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it("renders Message field", () => {
      render(<ContactPage />);
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it("renders Submit button", () => {
      render(<ContactPage />);
      expect(
        screen.getByRole("button", { name: /send message/i }),
      ).toBeInTheDocument();
    });

    it("email input has correct type", () => {
      render(<ContactPage />);
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("submit button has correct type", () => {
      render(<ContactPage />);
      const submitBtn = screen.getByRole("button", { name: /send message/i });
      expect(submitBtn).toHaveAttribute("type", "submit");
    });
  });
});
