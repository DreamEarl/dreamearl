import { render, screen } from "@/__tests__/utils/test-utils";
import CartPage from "@/app/cart/page";
import { translations } from "@/lib/constants/translations";

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

describe("Cart Page", () => {
  describe("Rendering", () => {
    it("renders empty cart message", () => {
      render(<CartPage />);
      expect(
        screen.getByText(translations.cart.emptyMessage),
      ).toBeInTheDocument();
    });

    it("renders Return to Shop button", () => {
      render(<CartPage />);
      expect(
        screen.getByText(translations.cart.returnToShop),
      ).toBeInTheDocument();
    });

    it("Return to Shop button links to /shop", () => {
      render(<CartPage />);
      const link = screen
        .getByText(translations.cart.returnToShop)
        .closest("a");
      expect(link).toHaveAttribute("href", "/shop");
    });
  });
});
