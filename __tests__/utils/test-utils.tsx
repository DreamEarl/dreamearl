import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

// Custom render function that wraps components with common providers if needed
function render(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return rtlRender(ui, { ...options });
}

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { render };
