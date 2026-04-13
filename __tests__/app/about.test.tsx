import { render, screen } from "@/__tests__/utils/test-utils";
import AboutPage from "@/app/about/page";

describe("About Page", () => {
  describe("Rendering", () => {
    it("renders the page heading", () => {
      render(<AboutPage />);
      expect(
        screen.getByRole("heading", { name: /about us/i }),
      ).toBeInTheDocument();
    });

    it("renders welcome text", () => {
      render(<AboutPage />);
      expect(screen.getByText(/Welcome to DREAMEARL/i)).toBeInTheDocument();
    });

    it("renders brand description", () => {
      render(<AboutPage />);
      expect(screen.getByText(/pearl accessories/i)).toBeInTheDocument();
    });

    it("renders as a full-page layout with min height", () => {
      const { container } = render(<AboutPage />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("min-h-screen");
    });
  });
});
