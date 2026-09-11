"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  CartState,
  CartAction,
  CartProductDetails,
  EnrichedCartItem,
  cartReducer,
  initialCartState,
} from "@/lib/cart/cartReducer";

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartItems: EnrichedCartItem[];
  isLoadingCartItems: boolean;
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "dreamearl_cart";

function loadFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartState) : initialCartState;
  } catch {
    return initialCartState;
  }
}

export function CartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [productDetails, setProductDetails] = useState<
    Record<string, CartProductDetails>
  >({});
  const [isLoadingCartItems, setIsLoadingCartItems] = useState(false);

  // Load persisted cart after mount so the initial client render matches SSR output.
  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: loadFromStorage() });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const idsKey = state.items.map((i) => i.id).join(",");

  // Cart items only store ids; fetch live product data for any id not yet cached.
  useEffect(() => {
    const missingIds = state.items
      .map((i) => i.id)
      .filter((id) => !productDetails[id]);
    if (missingIds.length === 0) return;

    let cancelled = false;
    setIsLoadingCartItems(true);

    fetch(`/api/cart-items?ids=${missingIds.join(",")}`)
      .then((res) => res.json())
      .then((data: { items?: CartProductDetails[] }) => {
        if (cancelled || !data.items) return;
        setProductDetails((prev) => {
          const next = { ...prev };
          for (const item of data.items) next[item.id] = item;
          return next;
        });
      })
      .catch((err) =>
        console.error("[cart] failed to load product details", err),
      )
      .finally(() => {
        if (!cancelled) setIsLoadingCartItems(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (id: string) => {
    dispatch({ type: "ADD_TO_CART", payload: { id } });
    openCart();
  };

  const removeFromCart = (id: string) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });

  const updateQuantity = (id: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const isInCart = (id: string) => state.items.some((i) => i.id === id);

  const cartItems: EnrichedCartItem[] = state.items.flatMap((i) => {
    const details = productDetails[i.id];
    return details ? [{ ...details, quantity: i.quantity }] : [];
  });

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartItems,
      isLoadingCartItems,
      itemCount,
      subtotal,
      isCartOpen,
      openCart,
      closeCart,
      isInCart,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, cartItems, isLoadingCartItems, itemCount, subtotal, isCartOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
