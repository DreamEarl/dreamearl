import { render, screen } from "@/__tests__/utils/test-utils";
import AccountPage from "@/app/account/page";
import type { Order } from "@/lib/orders/types";

const mockRedirect = jest.fn();
const mockGetUser = jest.fn();
const mockPush = jest.fn();
const mockRefresh = jest.fn();

function createOrdersQuery(data: Order[]) {
  const query = {
    select: jest.fn(() => query),
    eq: jest.fn(() => query),
    order: jest.fn(() => Promise.resolve({ data, error: null })),
  };
  return query;
}

let mockOrders: Order[] = [];
const mockFrom = jest.fn(() => createOrdersQuery(mockOrders));

jest.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
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

describe("Account Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOrders = [];
  });

  it("redirects to /login when there is no authenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    render(await AccountPage());

    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("renders the user's name, email and initials in the sidebar", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          email: "sakshi@example.com",
          user_metadata: { first_name: "Sakshi", last_name: "Mandlik" },
        },
      },
    });

    render(await AccountPage());

    expect(
      screen.getByText("Sakshi Mandlik", { selector: "#account-sidebar-name" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("sakshi@example.com", {
        selector: "#account-sidebar-email",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("SM")).toBeInTheDocument();
  });

  it("shows the overview panel selected by default", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          email: "sakshi@example.com",
          user_metadata: { first_name: "Sakshi", last_name: "Mandlik" },
        },
      },
    });

    render(await AccountPage());

    expect(screen.getByText("MY PROFILE")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /hello,/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
  });

  it("renders the sidebar navigation and sign out button", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { email: "sakshi@example.com", user_metadata: {} } },
    });

    render(await AccountPage());

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Manage Addresses")).toBeInTheDocument();
    expect(screen.getByText("Custom Requests")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign Out" }),
    ).toBeInTheDocument();
  });

  it("renders an empty state when the user has no orders", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { email: "sakshi@example.com", user_metadata: {} } },
    });

    render(
      await AccountPage({ searchParams: Promise.resolve({ tab: "orders" }) }),
    );

    expect(screen.getByText("No orders yet")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore Now" })).toHaveAttribute(
      "href",
      "/shop",
    );
  });

  it("renders the user's orders with status and a view details link", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { email: "sakshi@example.com", user_metadata: {} } },
    });
    mockOrders = [baseOrder];

    render(
      await AccountPage({ searchParams: Promise.resolve({ tab: "orders" }) }),
    );

    expect(screen.getByText("GLEAMSLING")).toBeInTheDocument();
    expect(screen.getByText(/Phone Sling Bag/)).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Details" })).toHaveAttribute(
      "href",
      "/account/orders/order-1",
    );
  });
});
