import { render, screen } from "@/__tests__/utils/test-utils";
import OrderDetailsPage from "@/app/account/orders/[orderId]/page";
import type { Order } from "@/lib/orders/types";

const mockRedirect = jest.fn();
const mockNotFound = jest.fn();
const mockGetUser = jest.fn();

function createOrderQuery(data: Order | null) {
  const query = {
    select: jest.fn(() => query),
    eq: jest.fn(() => query),
    single: jest.fn(() =>
      Promise.resolve({ data, error: data ? null : new Error("not found") }),
    ),
  };
  return query;
}

let mockOrder: Order | null = null;
const mockFrom = jest.fn(() => createOrderQuery(mockOrder));

jest.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
  notFound: (...args: unknown[]) => mockNotFound(...args),
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

jest.mock("@/lib/supabase/server", () => ({
  createClient: () => ({
    auth: {
      getUser: (...args: unknown[]) => mockGetUser(...args),
    },
    from: (...args: unknown[]) => mockFrom(...args),
  }),
}));

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  }),
}));

const baseOrder: Order = {
  id: "order-1",
  user_id: "user-1",
  customer_name: "Sakshi Mandlik",
  customer_email: "sakshi@example.com",
  customer_phone: "9876543210",
  shipping_address: {
    fullName: "Sakshi Mandlik",
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
      subtitle: "Phone Sling Bag",
    },
  ],
  subtotal: 4599,
  shipping_fee: 0,
  discount: 0,
  total: 4599,
  currency: "Rs.",
  status: "DELIVERED",
  payment_status: "PAID",
  razorpay_order_id: "rzp_order_1",
  razorpay_payment_id: "pay_1",
  created_at: "2025-09-05T00:00:00.000Z",
  updated_at: "2025-09-12T00:00:00.000Z",
};

describe("Order Details Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOrder = null;
  });

  it("redirects to /login when there is no authenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    render(
      await OrderDetailsPage({
        params: Promise.resolve({ orderId: "order-1" }),
      }),
    );

    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("renders a not-found response when the order doesn't belong to the user", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: { id: "user-1", email: "sakshi@example.com", user_metadata: {} },
      },
    });
    mockOrder = null;

    render(
      await OrderDetailsPage({
        params: Promise.resolve({ orderId: "missing-order" }),
      }),
    );

    expect(mockNotFound).toHaveBeenCalled();
  });

  it("renders the order details, timeline and shipping address", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: { id: "user-1", email: "sakshi@example.com", user_metadata: {} },
      },
    });
    mockOrder = baseOrder;

    render(
      await OrderDetailsPage({
        params: Promise.resolve({ orderId: "order-1" }),
      }),
    );

    expect(screen.getByText("GLEAMSLING")).toBeInTheDocument();
    expect(
      screen.getByText("Delivered", {
        selector: "#order-details-panel-status",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Order Placed")).toBeInTheDocument();
    expect(screen.getByText("Shipped")).toBeInTheDocument();
    expect(screen.getByText(/221B Baker Street/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:"),
    );
  });
});
