import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import { CartProvider } from "@/lib/cart/CartContext";

// Wrap all renders with CartProvider so components using useCart() work in tests
function render(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return rtlRender(ui, {
    wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    ...options,
  });
}

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { render };
