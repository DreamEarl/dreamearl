import { render, screen } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import CheckoutClient from "@/components/checkout/CheckoutClient";

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

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("CheckoutClient", () => {
  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  describe("empty cart", () => {
    it("shows the empty-cart message instead of the checkout form", () => {
      render(
        <CheckoutClient defaultName="Jane" defaultEmail="jane@example.com" />,
      );
      expect(
        screen.getByText("YOUR CART IS CURRENTLY EMPTY"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "RETURN TO SHOP" }),
      ).toHaveAttribute("href", "/shop");
    });

    it("does not render the pay button", () => {
      render(
        <CheckoutClient defaultName="Jane" defaultEmail="jane@example.com" />,
      );
      expect(screen.queryByText(/^Pay ₹/)).not.toBeInTheDocument();
    });
  });

  describe("cart with items", () => {
    beforeEach(() => {
      localStorage.setItem(
        "dreamearl_cart",
        JSON.stringify({ items: [{ id: "prod-1", quantity: 2 }] }),
      );
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ items: [productDetails] }),
        }),
      ) as jest.Mock;
    });

    it("prefills the customer name and email", async () => {
      render(
        <CheckoutClient defaultName="Jane" defaultEmail="jane@example.com" />,
      );
      await screen.findByText("GLEAMSLING");
      // "Full Name" is used for both the customer info and shipping address fields;
      // the customer info one renders first.
      expect(screen.getAllByLabelText("Full Name")[0]).toHaveValue("Jane");
      expect(screen.getByLabelText("Email")).toHaveValue("jane@example.com");
    });

    it("renders the order summary with item total and grand total", async () => {
      render(
        <CheckoutClient defaultName="Jane" defaultEmail="jane@example.com" />,
      );
      await screen.findByText("GLEAMSLING");
      // 4599 * 2 = 9198 for the line item, and as the only item it's also the subtotal/total.
      expect(screen.getAllByText("Rs. 9,198").length).toBeGreaterThan(0);
    });

    it("shows the Pay button with the computed total", async () => {
      render(
        <CheckoutClient defaultName="Jane" defaultEmail="jane@example.com" />,
      );
      expect(await screen.findByText("Pay ₹9,198")).toBeInTheDocument();
    });

    it("shows validation errors and does not call the create-order API when required fields are empty", async () => {
      const user = userEvent.setup();
      render(<CheckoutClient defaultName="" defaultEmail="" />);
      await screen.findByText("GLEAMSLING");

      await user.click(screen.getByText(/^Pay ₹/));

      expect(
        await screen.findByText("Full name is required."),
      ).toBeInTheDocument();
      expect(
        (global.fetch as jest.Mock).mock.calls.some(([url]) =>
          String(url).includes("/api/payments/create-order"),
        ),
      ).toBe(false);
    });
  });
});
