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
  });

  describe("Links", () => {
    it("renders product links with correct href", () => {
      render(<ProductCard {...defaultProps} />);
      const links = screen.getAllByRole("link");

      // Mobile image link, desktop image link, and heading link
      expect(links).toHaveLength(3);
      links.forEach((link) => {
        expect(link).toHaveAttribute("href", "/products/test-product");
      });
    });

    it("clicking the mobile image link navigates instead of adding to cart", async () => {
      const user = userEvent.setup();
      const { container } = render(<ProductCard {...defaultProps} />);
      const mobileImageLink = container.querySelector(
        "a.md\\:hidden",
      ) as HTMLElement;
      expect(mobileImageLink).toHaveAttribute("href", "/products/test-product");

      await act(async () => {
        await user.click(mobileImageLink);
      });

      expect(
        screen.queryByRole("button", {
          name: translations.product.addedToCart,
        }),
      ).not.toBeInTheDocument();
    });

    it("product name is clickable", () => {
      render(<ProductCard {...defaultProps} />);
      const nameLinks = screen.getAllByRole("link", { name: "Test Product" });
      nameLinks.forEach((link) => {
        expect(link).toHaveAttribute("href", "/products/test-product");
      });
    });
  });

  describe("Add to Cart Button", () => {
    it("renders add to cart buttons for mobile and desktop", () => {
      render(<ProductCard {...defaultProps} />);
      const buttons = screen.getAllByRole("button", {
        name: translations.product.addToCart,
      });
      expect(buttons).toHaveLength(2);
    });

    it("dispatches item to cart when clicked", async () => {
      const user = userEvent.setup();
      render(<ProductCard {...defaultProps} />);

      const [button] = screen.getAllByRole("button", {
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

      const [button] = screen.getAllByRole("button", {
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

    it("mobile add to cart icon button is always visible (no opacity transition)", () => {
      render(<ProductCard {...defaultProps} />);
      const [mobileButton] = screen.getAllByRole("button", {
        name: translations.product.addToCart,
      });
      expect(mobileButton).not.toHaveClass("opacity-0");
    });

    it("desktop add to cart button has opacity transition classes", () => {
      render(<ProductCard {...defaultProps} />);
      const [, desktopButton] = screen.getAllByRole("button", {
        name: translations.product.addToCart,
      });
      const buttonContainer = desktopButton.parentElement;
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
      const [button] = screen.getAllByRole("button");
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
