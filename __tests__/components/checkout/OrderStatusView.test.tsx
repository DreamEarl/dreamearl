import { render, screen } from "@/__tests__/utils/test-utils";
import OrderStatusView from "@/components/checkout/OrderStatusView";
import type { Order } from "@/lib/orders/types";

const baseOrder: Order = {
  id: "order-1",
  user_id: "user-1",
  customer_name: "Jane Doe",
  customer_email: "jane@example.com",
  customer_phone: "9876543210",
  shipping_address: {
    fullName: "Jane Doe",
    line1: "221B Baker Street",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    phone: "9876543210",
  },
  items: [
    {
      productId: "prod-1",
      name: "GLEAMSLING",
      image: "/gleamsling.jpg",
      price: 4599,
      quantity: 1,
      currency: "Rs.",
    },
  ],
  subtotal: 4599,
  shipping_fee: 0,
  discount: 0,
  total: 4599,
  currency: "INR",
  status: "CONFIRMED",
  payment_status: "PAID",
  razorpay_order_id: "rzp_order_1",
  razorpay_payment_id: "pay_1",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("OrderStatusView", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("shows the confirmation message and total when payment_status is PAID", () => {
    render(<OrderStatusView order={baseOrder} />);
    expect(screen.getByText("Order Confirmed")).toBeInTheDocument();
    expect(screen.getByText("Payment Status: PAID")).toBeInTheDocument();
    expect(screen.getByText("INR 4,599")).toBeInTheDocument();
  });

  it("shows the item name and delivery address", () => {
    render(<OrderStatusView order={baseOrder} />);
    expect(screen.getByText("GLEAMSLING")).toBeInTheDocument();
    expect(screen.getByText(/221B Baker Street/)).toBeInTheDocument();
  });

  it("shows a processing message when payment_status is PENDING", () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
    ) as jest.Mock;
    render(
      <OrderStatusView order={{ ...baseOrder, payment_status: "PENDING" }} />,
    );
    expect(screen.getByText("Confirming your payment...")).toBeInTheDocument();
  });

  it("shows a failure message and retry link when payment_status is FAILED", () => {
    render(
      <OrderStatusView order={{ ...baseOrder, payment_status: "FAILED" }} />,
    );
    expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Try Again" })).toHaveAttribute(
      "href",
      "/checkout",
    );
  });
});
