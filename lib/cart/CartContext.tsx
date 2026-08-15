"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  CartState,
  CartAction,
  CartItem,
  cartReducer,
  initialCartState,
} from "@/lib/cart/cartReducer";

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "dreamearl_cart";

function loadFromStorage(): CartState {
  if (typeof window === "undefined") return initialCartState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartState) : initialCartState;
  } catch {
    return initialCartState;
  }
}

export function CartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState, () =>
    loadFromStorage(),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addToCart = (item: Omit<CartItem, "quantity">) =>
    dispatch({ type: "ADD_TO_CART", payload: item });

  const removeFromCart = (id: string) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });

  const updateQuantity = (id: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  const value = useMemo(
    () => ({
      state,
      dispatch,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, itemCount, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
