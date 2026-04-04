import { render, screen } from "@/__tests__/utils/test-utils";
import Heading from "@/components/ui/Heading";

describe("Heading Component", () => {
  describe("Rendering", () => {
    it("renders children correctly", () => {
      render(<Heading variant="page">Test Heading</Heading>);
      expect(screen.getByText("Test Heading")).toBeInTheDocument();
    });
  });

  describe("Variants - Semantic HTML", () => {
    it("renders h1 for page variant", () => {
      render(<Heading variant="page">Page Title</Heading>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Page Title");
    });

    it("renders h2 for section variant", () => {
      render(<Heading variant="section">Section Title</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it("renders h1 for product variant", () => {
      render(<Heading variant="product">Product Name</Heading>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("renders h1 for cart variant", () => {
      render(<Heading variant="cart">Shopping Cart</Heading>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("renders h1 for login variant", () => {
      render(<Heading variant="login">Login</Heading>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("renders h3 for category variant", () => {
      render(<Heading variant="category">Category</Heading>);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it("renders h3 for card variant", () => {
      render(<Heading variant="card">Card Title</Heading>);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it("renders h3 for footer-brand variant", () => {
      render(<Heading variant="footer-brand">Brand</Heading>);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it("renders h4 for footer-section variant", () => {
      render(<Heading variant="footer-section">Links</Heading>);
      const heading = screen.getByRole("heading", { level: 4 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("Variants - Styling", () => {
    it("applies page variant classes", () => {
      render(<Heading variant="page">Page</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-4xl", "md:text-5xl", "font-light");
    });

    it("applies section variant classes", () => {
      render(<Heading variant="section">Section</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-3xl", "md:text-4xl", "text-center");
    });

    it("applies product variant classes", () => {
      render(<Heading variant="product">Product</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-3xl", "md:text-4xl", "font-light");
    });

    it("applies cart variant classes", () => {
      render(<Heading variant="cart">Cart</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-xl", "md:text-2xl", "font-light");
    });

    it("applies login variant classes", () => {
      render(<Heading variant="login">Login</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-3xl", "text-center");
    });

    it("applies category variant classes", () => {
      render(<Heading variant="category">Category</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-white", "text-xl", "text-center");
    });

    it("applies card variant classes", () => {
      render(<Heading variant="card">Card</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-base", "font-light");
    });

    it("applies footer-brand variant classes", () => {
      render(<Heading variant="footer-brand">Brand</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-2xl", "font-light");
    });

    it("applies footer-section variant classes", () => {
      render(<Heading variant="footer-section">Section</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-sm", "font-medium");
    });
  });

  describe("Custom className", () => {
    it("applies custom className", () => {
      render(
        <Heading variant="page" className="custom-class">
          Custom
        </Heading>,
      );
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("custom-class");
    });

    it("combines custom className with variant classes", () => {
      render(
        <Heading variant="section" className="mb-8">
          Combined
        </Heading>,
      );
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-3xl", "text-center", "mb-8");
    });
  });

  describe("Accessibility", () => {
    it("maintains proper heading hierarchy", () => {
      const { container } = render(
        <>
          <Heading variant="page">Main Title</Heading>
          <Heading variant="section">Subsection</Heading>
          <Heading variant="card">Card Title</Heading>
        </>,
      );

      const h1 = container.querySelector("h1");
      const h2 = container.querySelector("h2");
      const h3 = container.querySelector("h3");

      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
      expect(h3).toBeInTheDocument();
    });
  });
});
