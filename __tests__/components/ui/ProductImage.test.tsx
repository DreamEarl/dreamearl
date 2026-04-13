import { render, screen } from "@/__tests__/utils/test-utils";
import ProductImage from "@/components/ui/ProductImage";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
    priority,
    sizes,
  }: {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    sizes?: string;
    [key: string]: unknown;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        data-priority={String(priority)}
        data-sizes={sizes}
      />
    );
  },
}));

describe("ProductImage Component", () => {
  const defaultProps = {
    src: "/test-image.jpg",
    alt: "Test product image",
    sizes: "(max-width: 640px) 100vw, 50vw",
  };

  describe("Rendering", () => {
    it("renders an image", () => {
      render(<ProductImage {...defaultProps} />);
      const img = screen.getByAltText("Test product image");
      expect(img).toBeInTheDocument();
    });

    it("renders image with correct src", () => {
      render(<ProductImage {...defaultProps} />);
      const img = screen.getByAltText("Test product image");
      expect(img).toHaveAttribute("src", "/test-image.jpg");
    });

    it("applies default object-cover className", () => {
      render(<ProductImage {...defaultProps} />);
      const img = screen.getByAltText("Test product image");
      expect(img).toHaveClass("object-cover");
    });

    it("applies custom className", () => {
      render(<ProductImage {...defaultProps} className="object-contain" />);
      const img = screen.getByAltText("Test product image");
      expect(img).toHaveClass("object-contain");
    });
  });

  describe("Props", () => {
    it("passes priority prop", () => {
      render(<ProductImage {...defaultProps} priority />);
      const img = screen.getByAltText("Test product image");
      expect(img).toHaveAttribute("data-priority", "true");
    });

    it("priority defaults to false", () => {
      render(<ProductImage {...defaultProps} />);
      const img = screen.getByAltText("Test product image");
      expect(img).toHaveAttribute("data-priority", "false");
    });

    it("passes sizes prop", () => {
      render(<ProductImage {...defaultProps} />);
      const img = screen.getByAltText("Test product image");
      expect(img).toHaveAttribute(
        "data-sizes",
        "(max-width: 640px) 100vw, 50vw",
      );
    });
  });
});
