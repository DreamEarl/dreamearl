import { render, screen, act } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import CartClient from "@/app/cart/CartClient";
import { translations } from "@/lib/constants/translations";

const t = translations.cart;

const defaultProps = {
  heroImageUrl: "/images/hero/background.jpeg",
  heroTitle: t.hero.title,
  heroSubtitle: t.hero.subtitle,
  emptyMessage: t.emptyMessage,
  returnToShop: t.returnToShop,
};

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img src={src} alt={alt} />
  ),
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

describe("CartClient", () => {
  describe("Empty cart", () => {
    it("renders hero title", () => {
      render(<CartClient {...defaultProps} />);
      expect(screen.getByText(t.hero.title)).toBeInTheDocument();
    });

    it("renders hero subtitle", () => {
      render(<CartClient {...defaultProps} />);
      expect(screen.getByText(t.hero.subtitle)).toBeInTheDocument();
    });

    it("renders hero background image", () => {
      render(<CartClient {...defaultProps} />);
      expect(screen.getByAltText("Cart hero")).toHaveAttribute(
        "src",
        "/images/hero/background.jpeg",
      );
    });

    it("renders empty cart message", () => {
      render(<CartClient {...defaultProps} />);
      expect(screen.getByText(t.emptyMessage)).toBeInTheDocument();
    });

    it("renders Return to Shop button", () => {
      render(<CartClient {...defaultProps} />);
      expect(screen.getByText(t.returnToShop)).toBeInTheDocument();
    });

    it("Return to Shop button links to /shop", () => {
      render(<CartClient {...defaultProps} />);
      const link = screen.getByText(t.returnToShop).closest("a");
      expect(link).toHaveAttribute("href", "/shop");
    });

    it("accepts Sanity-overridden hero title", () => {
      render(<CartClient {...defaultProps} heroTitle="BASKET" />);
      expect(screen.getByText("BASKET")).toBeInTheDocument();
    });

    it("accepts Sanity-overridden hero image URL", () => {
      render(
        <CartClient
          {...defaultProps}
          heroImageUrl="https://cdn.sanity.io/cart-hero.jpg"
        />,
      );
      expect(screen.getByAltText("Cart hero")).toHaveAttribute(
        "src",
        "https://cdn.sanity.io/cart-hero.jpg",
      );
    });
  });

  describe("Cart with items", () => {
    const item = { id: "prod-1", quantity: 1 };
    const productDetails = {
      id: "prod-1",
      name: "GLEAMSLING",
      subtitle: "Phone Sling Bag",
      price: 4599,
      image: "/gleamsling.jpg",
      href: "/products/gleamsling",
      brand: "DREAMEARL",
      currency: "Rs.",
      color: "Ivory",
    };

    beforeEach(() => {
      // Mocks the /api/cart-items enrichment endpoint used to resolve product data from ids
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ items: [productDetails] }),
        }),
      ) as jest.Mock;
    });

    function renderWithItem() {
      // Pre-populate localStorage before rendering so CartProvider picks it up
      localStorage.setItem("dreamearl_cart", JSON.stringify({ items: [item] }));
      return render(<CartClient {...defaultProps} />);
    }

    afterEach(() => {
      localStorage.clear();
      jest.restoreAllMocks();
    });

    it("renders product name", async () => {
      renderWithItem();
      expect(await screen.findByText("GLEAMSLING")).toBeInTheDocument();
    });

    it("renders product subtitle", async () => {
      renderWithItem();
      expect(await screen.findByText("Phone Sling Bag")).toBeInTheDocument();
    });

    it("renders product color", async () => {
      renderWithItem();
      expect(await screen.findByText("Color: Ivory")).toBeInTheDocument();
    });

    it("renders product price", async () => {
      renderWithItem();
      expect((await screen.findAllByText(/4,599/)).length).toBeGreaterThan(0);
    });

    it("renders column headers", () => {
      renderWithItem();
      expect(screen.getByText(t.columns.product)).toBeInTheDocument();
      expect(screen.getByText(t.columns.price)).toBeInTheDocument();
      expect(screen.getByText(t.columns.quantity)).toBeInTheDocument();
      expect(screen.getByText(t.columns.total)).toBeInTheDocument();
    });

    it("renders cart summary title", () => {
      renderWithItem();
      expect(screen.getByText(t.summary.title)).toBeInTheDocument();
    });

    it("renders subtotal in summary", () => {
      renderWithItem();
      expect(screen.getByText(t.summary.subtotal)).toBeInTheDocument();
    });

    it("renders checkout button", () => {
      renderWithItem();
      expect(screen.getByText(t.summary.checkout)).toBeInTheDocument();
    });

    it("removes item when ✕ is clicked", async () => {
      const user = userEvent.setup();
      renderWithItem();

      const removeBtn = await screen.findByRole("button", {
        name: /Remove GLEAMSLING/i,
      });
      await act(async () => {
        await user.click(removeBtn);
      });

      expect(screen.getByText(t.emptyMessage)).toBeInTheDocument();
    });

    it("increments quantity when + is clicked", async () => {
      const user = userEvent.setup();
      renderWithItem();

      const increaseBtn = await screen.findByRole("button", {
        name: "Increase quantity",
      });
      await act(async () => {
        await user.click(increaseBtn);
      });

      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("decrements quantity when − is clicked", async () => {
      localStorage.setItem(
        "dreamearl_cart",
        JSON.stringify({ items: [{ ...item, quantity: 2 }] }),
      );
      const user = userEvent.setup();
      render(<CartClient {...defaultProps} />);

      const decreaseBtn = await screen.findByRole("button", {
        name: "Decrease quantity",
      });
      await act(async () => {
        await user.click(decreaseBtn);
      });

      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("removes item when quantity decremented to zero", async () => {
      const user = userEvent.setup();
      renderWithItem();

      const decreaseBtn = await screen.findByRole("button", {
        name: "Decrease quantity",
      });
      await act(async () => {
        await user.click(decreaseBtn);
      });

      expect(screen.getByText(t.emptyMessage)).toBeInTheDocument();
    });
  });
});
