import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/lib/cart/CartContext";
import { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const item = {
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

describe("CartContext / useCart", () => {
  beforeEach(() => {
    localStorage.clear();
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
      act(() => result.current.addToCart(item));
      expect(result.current.state.items).toHaveLength(1);
      expect(result.current.state.items[0].id).toBe("p1");
    });

    it("sets initial quantity to 1", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart(item));
      expect(result.current.state.items[0].quantity).toBe(1);
    });

    it("increments quantity on duplicate add", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart(item));
      act(() => result.current.addToCart(item));
      expect(result.current.state.items[0].quantity).toBe(2);
    });

    it("updates itemCount", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart(item));
      expect(result.current.itemCount).toBe(1);
    });

    it("updates subtotal", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart(item));
      expect(result.current.subtotal).toBe(4599);
    });

    it("accumulates subtotal across quantities", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart(item));
      act(() => result.current.addToCart(item));
      expect(result.current.subtotal).toBe(9198);
    });
  });

  describe("removeFromCart", () => {
    it("removes the item", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart(item));
      act(() => result.current.removeFromCart("p1"));
      expect(result.current.state.items).toHaveLength(0);
    });

    it("resets itemCount to 0", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart(item));
      act(() => result.current.removeFromCart("p1"));
      expect(result.current.itemCount).toBe(0);
    });

    it("resets subtotal to 0", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart(item));
      act(() => result.current.removeFromCart("p1"));
      expect(result.current.subtotal).toBe(0);
    });
  });

  describe("updateQuantity", () => {
    it("updates quantity", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart(item));
      act(() => result.current.updateQuantity("p1", 4));
      expect(result.current.state.items[0].quantity).toBe(4);
    });

    it("removes item when quantity is set to 0", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart(item));
      act(() => result.current.updateQuantity("p1", 0));
      expect(result.current.state.items).toHaveLength(0);
    });

    it("updates subtotal after quantity change", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart(item));
      act(() => result.current.updateQuantity("p1", 3));
      expect(result.current.subtotal).toBe(4599 * 3);
    });
  });

  describe("clearCart", () => {
    it("empties all items", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart(item));
      act(() => result.current.clearCart());
      expect(result.current.state.items).toHaveLength(0);
      expect(result.current.itemCount).toBe(0);
      expect(result.current.subtotal).toBe(0);
    });
  });

  describe("localStorage persistence", () => {
    it("persists cart to localStorage on add", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart(item));
      const stored = JSON.parse(localStorage.getItem("dreamearl_cart") ?? "{}");
      expect(stored.items).toHaveLength(1);
    });

    it("hydrates cart from localStorage on mount", () => {
      localStorage.setItem(
        "dreamearl_cart",
        JSON.stringify({ items: [{ ...item, quantity: 3 }] }),
      );
      const { result } = renderHook(() => useCart(), { wrapper });
      expect(result.current.state.items[0].quantity).toBe(3);
    });

    it("clears localStorage after clearCart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => result.current.addToCart(item));
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
