import {
  CURRENCY,
  DISCOUNT,
  SHIPPING_FEE,
  computeOrderTotals,
  toPaise,
} from "@/lib/orders/pricing";

describe("computeOrderTotals", () => {
  it("returns zeroed totals for an empty cart", () => {
    expect(computeOrderTotals([])).toEqual({
      subtotal: 0,
      shippingFee: SHIPPING_FEE,
      discount: DISCOUNT,
      total: SHIPPING_FEE - DISCOUNT,
    });
  });

  it("sums price * quantity across all items", () => {
    const totals = computeOrderTotals([
      { price: 1000, quantity: 2 },
      { price: 500, quantity: 1 },
    ]);
    expect(totals.subtotal).toBe(2500);
    expect(totals.total).toBe(2500 + SHIPPING_FEE - DISCOUNT);
  });

  it("never returns a negative total", () => {
    const totals = computeOrderTotals([{ price: 0, quantity: 1 }]);
    expect(totals.total).toBeGreaterThanOrEqual(0);
  });
});

describe("toPaise", () => {
  it("converts rupees to the nearest paise", () => {
    expect(toPaise(499)).toBe(49900);
    expect(toPaise(10.5)).toBe(1050);
  });

  it("rounds fractional paise", () => {
    expect(toPaise(10.005)).toBe(1001);
  });
});

describe("CURRENCY", () => {
  it("is INR", () => {
    expect(CURRENCY).toBe("INR");
  });
});
