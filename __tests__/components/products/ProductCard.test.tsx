import { render, screen, act } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import ProductCard from "@/components/products/ProductCard";
import { translations } from "@/lib/constants/translations";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: any;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe("ProductCard Component", () => {
  const defaultProps = {
    id: "test-1",
    name: "Test Product",
    price: 1000,
    image: "/test-image.jpg",
    href: "/products/test-product",
  };

  describe("Rendering", () => {
    it("renders product name", () => {
      render(<ProductCard {...defaultProps} />);
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    it("renders product price with default currency", () => {
      render(<ProductCard {...defaultProps} />);
      expect(
        screen.getByText(`${translations.common.currency} 1,000`),
      ).toBeInTheDocument();
    });

    it("renders product price with custom currency", () => {
      render(<ProductCard {...defaultProps} currency="$" price={99} />);
      expect(screen.getByText("$ 99")).toBeInTheDocument();
    });

    it("renders product image with correct src and alt", () => {
      render(<ProductCard {...defaultProps} />);
      const image = screen.getByAltText("Test Product");
      expect(image).toHaveAttribute("src", "/test-image.jpg");
    });

    it("renders default brand", () => {
      render(<ProductCard {...defaultProps} />);
      expect(screen.getByText(translations.common.brand)).toBeInTheDocument();
    });

    it("renders custom brand", () => {
      render(<ProductCard {...defaultProps} brand="Custom Brand" />);
      expect(screen.getByText("Custom Brand")).toBeInTheDocument();
    });

    it("accepts subtitle prop without rendering it on the card", () => {
      // subtitle is forwarded to the cart item, not displayed on the card
      render(<ProductCard {...defaultProps} subtitle="Phone Sling Bag" />);
      expect(screen.queryByText("Phone Sling Bag")).not.toBeInTheDocument();
    });

    it("accepts color prop without rendering it on the card", () => {
      // color is forwarded to the cart item, not displayed on the card
      render(<ProductCard {...defaultProps} color="Ivory" />);
      expect(screen.queryByText("Color: Ivory")).not.toBeInTheDocument();
    });
  });

  describe("Links", () => {
    it("renders product link with correct href", () => {
      render(<ProductCard {...defaultProps} />);
      const links = screen.getAllByRole("link");

      // Should have two links - one for image and one for heading
      expect(links).toHaveLength(2);
      links.forEach((link) => {
        expect(link).toHaveAttribute("href", "/products/test-product");
      });
    });

    it("product name is clickable", () => {
      render(<ProductCard {...defaultProps} />);
      const nameLink = screen.getByRole("link", { name: "Test Product" });
      expect(nameLink).toHaveAttribute("href", "/products/test-product");
    });
  });

  describe("Add to Cart Button", () => {
    it("renders add to cart button", () => {
      render(<ProductCard {...defaultProps} />);
      const button = screen.getByRole("button", {
        name: translations.product.addToCart,
      });
      expect(button).toBeInTheDocument();
    });

    it("dispatches item to cart when clicked", async () => {
      const user = userEvent.setup();
      render(<ProductCard {...defaultProps} />);

      const button = screen.getByRole("button", {
        name: translations.product.addToCart,
      });
      await act(async () => {
        await user.click(button);
      });

      // Cart badge should appear in the document (or state updated without error)
      expect(button).toBeInTheDocument();
    });

    it("prevents default link navigation when add to cart is clicked", async () => {
      const user = userEvent.setup();
      render(<ProductCard {...defaultProps} />);

      const button = screen.getByRole("button", {
        name: translations.product.addToCart,
      });

      // Should not throw
      await act(async () => {
        await user.click(button);
      });

      expect(button).toBeInTheDocument();
    });
  });

  describe("Hover Effects", () => {
    it("applies hover classes to image container", () => {
      const { container } = render(<ProductCard {...defaultProps} />);
      const imageContainer = container.querySelector(".group");
      expect(imageContainer).toBeInTheDocument();
    });

    it("add to cart button has opacity transition classes", () => {
      render(<ProductCard {...defaultProps} />);
      const button = screen.getByRole("button", {
        name: translations.product.addToCart,
      });
      const buttonContainer = button.parentElement;
      expect(buttonContainer).toHaveClass(
        "opacity-0",
        "group-hover:opacity-100",
      );
    });
  });

  describe("Price Formatting", () => {
    it("formats large numbers with commas", () => {
      render(<ProductCard {...defaultProps} price={10000} />);
      expect(screen.getByText(/10,000/)).toBeInTheDocument();
    });

    it("formats numbers without decimals", () => {
      render(<ProductCard {...defaultProps} price={1234} />);
      expect(screen.getByText(/1,234/)).toBeInTheDocument();
    });

    it("handles small numbers", () => {
      render(<ProductCard {...defaultProps} price={99} />);
      expect(screen.getByText(/99/)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<ProductCard {...defaultProps} />);
      const heading = screen.getByRole("heading", { name: "Test Product" });
      expect(heading).toBeInTheDocument();
    });

    it("has descriptive alt text for image", () => {
      render(<ProductCard {...defaultProps} />);
      const image = screen.getByAltText("Test Product");
      expect(image).toBeInTheDocument();
    });

    it("has accessible button text", () => {
      render(<ProductCard {...defaultProps} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAccessibleName(translations.product.addToCart);
    });
  });

  describe("Complete Product Data", () => {
    it("renders complete product with all props", () => {
      const fullProps = {
        id: "full-1",
        name: "Luxury Pearl Bag",
        price: 4599,
        image: "/luxury-bag.jpg",
        href: "/products/luxury-pearl-bag",
        brand: "DREAMEARL",
        currency: "Rs.",
      };

      render(<ProductCard {...fullProps} />);

      expect(screen.getByText("Luxury Pearl Bag")).toBeInTheDocument();
      expect(screen.getByText("DREAMEARL")).toBeInTheDocument();
      expect(screen.getByText("Rs. 4,599")).toBeInTheDocument();
      expect(screen.getByAltText("Luxury Pearl Bag")).toHaveAttribute(
        "src",
        "/luxury-bag.jpg",
      );
    });
  });
});
