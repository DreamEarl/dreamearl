import { renderHook, act, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "@/lib/cart/CartContext";
import { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const productDetails = {
  id: "p1",
  name: "GLEAMSLING",
  subtitle: "Phone Sling Bag",
  price: 4599,
  image: "/gleamsling.jpg",
  href: "/products/gleamsling",
  brand: "DREAMEARL",
  currency: "Rs.",
  color: "Ivory",
};

// Mocks the /api/cart-items enrichment endpoint used to resolve product data from ids
function mockCartItemsFetch() {
  global.fetch = jest.fn((url: string) => {
    const ids = new URL(url, "http://localhost").searchParams
      .get("ids")
      ?.split(",")
      .filter(Boolean);
    const items = ids?.includes("p1") ? [productDetails] : [];
    return Promise.resolve({
      json: () => Promise.resolve({ items }),
    }) as unknown as Promise<Response>;
  }) as jest.Mock;
}

describe("CartContext / useCart", () => {
  beforeEach(() => {
    localStorage.clear();
    mockCartItemsFetch();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("initial values", () => {
    it("starts with empty items", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      expect(result.current.state.items).toHaveLength(0);
    });

    it("starts with itemCount 0", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      expect(result.current.itemCount).toBe(0);
    });

    it("starts with subtotal 0", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      expect(result.current.subtotal).toBe(0);
    });
  });

  describe("addToCart", () => {
    it("adds item to cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      expect(result.current.state.items).toHaveLength(1);
      expect(result.current.state.items[0].id).toBe("p1");
    });

    it("sets initial quantity to 1", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      expect(result.current.state.items[0].quantity).toBe(1);
    });

    it("increments quantity on duplicate add", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      act(() => result.current.addToCart("p1"));
      expect(result.current.state.items[0].quantity).toBe(2);
    });

    it("updates itemCount", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      expect(result.current.itemCount).toBe(1);
    });

    it("updates subtotal once product details load", async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      await waitFor(() => expect(result.current.subtotal).toBe(4599));
    });

    it("accumulates subtotal across quantities", async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      act(() => result.current.addToCart("p1"));
      await waitFor(() => expect(result.current.subtotal).toBe(9198));
    });
  });

  describe("removeFromCart", () => {
    it("removes the item", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      act(() => result.current.removeFromCart("p1"));
      expect(result.current.state.items).toHaveLength(0);
    });

    it("resets itemCount to 0", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      act(() => result.current.removeFromCart("p1"));
      expect(result.current.itemCount).toBe(0);
    });

    it("resets subtotal to 0", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      act(() => result.current.removeFromCart("p1"));
      expect(result.current.subtotal).toBe(0);
    });
  });

  describe("updateQuantity", () => {
    it("updates quantity", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      act(() => result.current.updateQuantity("p1", 4));
      expect(result.current.state.items[0].quantity).toBe(4);
    });

    it("removes item when quantity is set to 0", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      act(() => result.current.updateQuantity("p1", 0));
      expect(result.current.state.items).toHaveLength(0);
    });

    it("updates subtotal after quantity change", async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      act(() => result.current.updateQuantity("p1", 3));
      await waitFor(() => expect(result.current.subtotal).toBe(4599 * 3));
    });
  });

  describe("clearCart", () => {
    it("empties all items", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      act(() => result.current.clearCart());
      expect(result.current.state.items).toHaveLength(0);
      expect(result.current.itemCount).toBe(0);
      expect(result.current.subtotal).toBe(0);
    });
  });

  describe("localStorage persistence", () => {
    it("persists cart to localStorage on add", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      const stored = JSON.parse(localStorage.getItem("dreamearl_cart") ?? "{}");
      expect(stored.items).toHaveLength(1);
    });

    it("hydrates cart from localStorage on mount", () => {
      localStorage.setItem(
        "dreamearl_cart",
        JSON.stringify({ items: [{ id: "p1", quantity: 3 }] }),
      );
      const { result } = renderHook(() => useCart(), { wrapper });
      expect(result.current.state.items[0].quantity).toBe(3);
    });

    it("clears localStorage after clearCart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart("p1"));
      act(() => result.current.clearCart());
      const stored = JSON.parse(localStorage.getItem("dreamearl_cart") ?? "{}");
      expect(stored.items).toHaveLength(0);
    });
  });

  describe("useCart outside provider", () => {
    it("throws when used outside CartProvider", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      expect(() => renderHook(() => useCart())).toThrow(
        "useCart must be used inside CartProvider",
      );
      jest.restoreAllMocks();
    });
  });
});
