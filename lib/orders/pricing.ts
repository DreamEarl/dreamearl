// Central place for order pricing rules so the checkout UI (display only) and the
// create-order API (authoritative) stay in sync. The server always recomputes these
// from trusted data — the client never gets to decide the final total.

export const CURRENCY = "INR";

// No shipping-fee logic exists yet in this project (cart page just shows a
// "Calculated at checkout" placeholder). Flat free shipping until real rules are defined.
export const SHIPPING_FEE = 0;

// No coupon/discount system exists yet in this project.
export const DISCOUNT = 0;

export interface OrderTotals {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

export function computeOrderTotals(
  items: { price: number; quantity: number }[],
): OrderTotals {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = SHIPPING_FEE;
  const discount = DISCOUNT;
  const total = Math.max(subtotal + shippingFee - discount, 0);
  return { subtotal, shippingFee, discount, total };
}

// Razorpay amounts are in the smallest currency unit (paise for INR).
export function toPaise(amountInRupees: number): number {
  return Math.round(amountInRupees * 100);
}
