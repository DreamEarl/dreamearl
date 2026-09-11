// Raw cart items only store id + quantity; product details are fetched separately
export interface CartItem {
  id: string;
  quantity: number;
}

// Product details resolved from an id (e.g. via the cart-items API)
export interface CartProductDetails {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  image: string;
  href: string;
  brand: string;
  currency: string;
  color?: string;
}

export interface EnrichedCartItem extends CartProductDetails {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: "ADD_TO_CART"; payload: { id: string } }
  | { type: "REMOVE_FROM_CART"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartState };

export const initialCartState: CartState = { items: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "ADD_TO_CART": {
      const exists = state.items.some((i) => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { id: action.payload.id, quantity: 1 }],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i,
        ),
      };
    }

    case "CLEAR_CART":
      return initialCartState;

    default:
      return state;
  }
}
