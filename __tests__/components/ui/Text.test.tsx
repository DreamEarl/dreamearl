import { render, screen } from "@/__tests__/utils/test-utils";
import Text from "@/components/ui/Text";

describe("Text Component", () => {
  describe("Rendering", () => {
    it("renders children correctly", () => {
      render(<Text>Test text content</Text>);
      expect(screen.getByText("Test text content")).toBeInTheDocument();
    });

    it("renders as p tag by default", () => {
      const { container } = render(<Text>Paragraph</Text>);
      const paragraph = container.querySelector("p");
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toHaveTextContent("Paragraph");
    });

    it("renders as span when as prop is span", () => {
      const { container } = render(<Text as="span">Span text</Text>);
      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent("Span text");
    });

    it("renders as div when as prop is div", () => {
      const { container } = render(<Text as="div">Div text</Text>);
      const div = container.querySelector("div");
      expect(div).toBeInTheDocument();
      expect(div).toHaveTextContent("Div text");
    });
  });

  describe("Variants", () => {
    it("applies body variant classes by default", () => {
      const { container } = render(<Text>Body text</Text>);
      const element = container.firstChild;
      expect(element).toHaveClass("text-sm", "leading-relaxed");
    });

    it("applies small variant classes", () => {
      const { container } = render(<Text variant="small">Small text</Text>);
      const element = container.firstChild;
      expect(element).toHaveClass(
        "text-xs",
        "tracking-widest",
        "text-gray-600",
      );
    });

    it("applies muted variant classes", () => {
      const { container } = render(<Text variant="muted">Muted text</Text>);
      const element = container.firstChild;
      expect(element).toHaveClass(
        "text-sm",
        "text-gray-700",
        "leading-relaxed",
      );
    });

    it("applies price variant classes", () => {
      const { container } = render(<Text variant="price">$99.99</Text>);
      const element = container.firstChild;
      expect(element).toHaveClass("text-2xl");
    });

    it("applies label variant classes", () => {
      const { container } = render(<Text variant="label">Label</Text>);
      const element = container.firstChild;
      expect(element).toHaveClass(
        "text-sm",
        "tracking-widest",
        "text-gray-700",
      );
    });

    it("applies caption variant classes", () => {
      const { container } = render(<Text variant="caption">Caption</Text>);
      const element = container.firstChild;
      expect(element).toHaveClass(
        "text-xs",
        "text-gray-500",
        "leading-relaxed",
      );
    });
  });

  describe("Custom className", () => {
    it("applies custom className", () => {
      const { container } = render(
        <Text className="custom-class">Custom</Text>,
      );
      const element = container.firstChild;
      expect(element).toHaveClass("custom-class");
    });

    it("combines custom className with variant classes", () => {
      const { container } = render(
        <Text variant="muted" className="mb-4">
          Combined
        </Text>,
      );
      const element = container.firstChild;
      expect(element).toHaveClass("text-sm", "text-gray-700", "mb-4");
    });
  });

  describe("Combinations", () => {
    it("handles variant, as, and className together", () => {
      const { container } = render(
        <Text variant="small" as="span" className="font-bold">
          All props
        </Text>,
      );

      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
      expect(span).toHaveClass("text-xs", "tracking-widest", "font-bold");
      expect(span).toHaveTextContent("All props");
    });
  });

  describe("Content Types", () => {
    it("renders string content", () => {
      render(<Text>Simple string</Text>);
      expect(screen.getByText("Simple string")).toBeInTheDocument();
    });

    it("renders numeric content", () => {
      render(<Text>{42}</Text>);
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders nested elements", () => {
      render(
        <Text>
          Text with <strong>bold</strong> content
        </Text>,
      );
      expect(screen.getByText(/Text with/)).toBeInTheDocument();
      expect(screen.getByText("bold")).toBeInTheDocument();
    });
  });
});
