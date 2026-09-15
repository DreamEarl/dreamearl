import { render, screen } from "@/__tests__/utils/test-utils";
import AccountQuickLinks from "@/components/account/AccountQuickLinks";
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

describe("AccountQuickLinks", () => {
  const { quickLinks } = translations.account;

  it("links to the shop", () => {
    render(<AccountQuickLinks />);
    expect(
      screen.getByText(quickLinks.continueShopping).closest("a"),
    ).toHaveAttribute("href", "/shop");
  });

  it("links to the cart", () => {
    render(<AccountQuickLinks />);
    expect(screen.getByText(quickLinks.viewCart).closest("a")).toHaveAttribute(
      "href",
      "/cart",
    );
  });

  it("links to custom orders", () => {
    render(<AccountQuickLinks />);
    expect(
      screen.getByText(quickLinks.customOrders).closest("a"),
    ).toHaveAttribute("href", "/custom-order");
  });
});
