/**
 * @jest-environment node
 */
import { createSupabaseMock } from "@/__tests__/utils/supabase-mock";

const mockCreateClient = jest.fn();
jest.mock("@/lib/supabase/server", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

const mockGetProductsForCheckout = jest.fn();
jest.mock("@/lib/sanity/queries", () => ({
  getProductsForCheckout: (...args: unknown[]) =>
    mockGetProductsForCheckout(...args),
}));

const mockOrdersCreate = jest.fn();
jest.mock("@/lib/razorpay/client", () => ({
  razorpay: {
    orders: { create: (...args: unknown[]) => mockOrdersCreate(...args) },
  },
}));

import { POST } from "@/app/api/payments/create-order/route";

const validCustomer = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "9876543210",
};
const validShipping = {
  fullName: "Jane Doe",
  line1: "221B Baker Street",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560001",
  phone: "9876543210",
};

function buildRequest(body: unknown) {
  return new Request("http://localhost/api/payments/create-order", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const inStockProduct = {
  _id: "prod-1",
  name: "Pearl Clutch",
  images: ["image-ref"],
  price: 1000,
  currency: "Rs.",
  productType: "Clutch",
  pearlColour: "White",
  inStock: true,
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = "rzp_test_dummy";
});

describe("POST /api/payments/create-order", () => {
  it("returns 401 when there is no authenticated user", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({ user: null }));

    const res = await POST(
      buildRequest({
        items: [{ id: "prod-1", quantity: 1 }],
        customer: validCustomer,
        shippingAddress: validShipping,
      }),
    );

    expect(res.status).toBe(401);
  });

  it("returns 400 when the cart is empty", async () => {
    mockCreateClient.mockResolvedValue(createSupabaseMock({}));

    const res = await POST(
      buildRequest({
        items: [],
        customer: validCustomer,
        shippingAddress: validShipping,
      }),
    );

    expect(res.status).toBe(400);
  });

  it("returns 409 when an item is no longer in stock", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({ selectResult: { data: [], error: null } }),
    );
    mockGetProductsForCheckout.mockResolvedValue([
      { ...inStockProduct, inStock: false },
    ]);

    const res = await POST(
      buildRequest({
        items: [{ id: "prod-1", quantity: 1 }],
        customer: validCustomer,
        shippingAddress: validShipping,
      }),
    );

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toMatch(/no longer available/i);
  });

  it("recalculates the total server-side, creates a Razorpay order, and returns the expected shape", async () => {
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        selectResult: { data: [], error: null },
        insertResult: {
          data: { id: "order-1", total: 2000, currency: "INR" },
          error: null,
        },
        updateResult: { data: null, error: null },
      }),
    );
    mockGetProductsForCheckout.mockResolvedValue([inStockProduct]);
    mockOrdersCreate.mockResolvedValue({ id: "rzp_order_1" });

    const res = await POST(
      buildRequest({
        // Frontend sends quantity 2 — server must reprice using the trusted Sanity price (1000), not any client-sent price/total.
        items: [{ id: "prod-1", quantity: 2 }],
        customer: validCustomer,
        shippingAddress: validShipping,
      }),
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(mockOrdersCreate).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 200000, currency: "INR" }),
    );
    expect(body).toEqual({
      orderId: "order-1",
      razorpayOrderId: "rzp_order_1",
      amount: 200000,
      currency: "INR",
      keyId: "rzp_test_dummy",
    });
  });

  it("reuses an existing unpaid order with the same cart instead of creating a duplicate", async () => {
    const existingOrder = {
      id: "order-existing",
      razorpay_order_id: "rzp_order_existing",
      total: 1000,
      currency: "INR",
      items: [{ productId: "prod-1", quantity: 1 }],
    };
    mockCreateClient.mockResolvedValue(
      createSupabaseMock({
        selectResult: { data: [existingOrder], error: null },
      }),
    );
    mockGetProductsForCheckout.mockResolvedValue([inStockProduct]);

    const res = await POST(
      buildRequest({
        items: [{ id: "prod-1", quantity: 1 }],
        customer: validCustomer,
        shippingAddress: validShipping,
      }),
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.orderId).toBe("order-existing");
    expect(body.razorpayOrderId).toBe("rzp_order_existing");
    expect(mockOrdersCreate).not.toHaveBeenCalled();
  });
});
