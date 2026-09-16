import type {
  CheckoutCustomer,
  CheckoutRequestItem,
  ShippingAddress,
} from "@/lib/orders/types";

export class CheckoutValidationError extends Error {}

const PHONE_RE = /^[\d+()\-\s]{7,20}$/;
const PINCODE_RE = /^\d{4,10}$/;
const MAX_QUANTITY_PER_ITEM = 20;

// Deliberately avoids a single backtracking-prone regex for the whole address.
export function isValidEmail(value: string): boolean {
  if (value.includes(" ")) return false;
  const at = value.indexOf("@");
  if (at <= 0 || at !== value.lastIndexOf("@")) return false;
  const domain = value.slice(at + 1);
  const dot = domain.indexOf(".");
  return dot > 0 && dot < domain.length - 1;
}

export function isValidPhone(value: string): boolean {
  return PHONE_RE.test(value);
}

export function isValidPincode(value: string): boolean {
  return PINCODE_RE.test(value);
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new CheckoutValidationError(`${field} is required.`);
  }
  return value.trim();
}

export function validateCheckoutItems(value: unknown): CheckoutRequestItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new CheckoutValidationError("Your cart is empty.");
  }

  return value.map((raw) => {
    if (!raw || typeof raw !== "object") {
      throw new CheckoutValidationError("Invalid cart item.");
    }
    const id = requireString((raw as Record<string, unknown>).id, "Product id");
    const quantity = Number((raw as Record<string, unknown>).quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
      throw new CheckoutValidationError(`Invalid quantity for item ${id}.`);
    }
    return { id, quantity };
  });
}

export function validateCustomer(value: unknown): CheckoutCustomer {
  if (!value || typeof value !== "object") {
    throw new CheckoutValidationError("Customer details are required.");
  }
  const obj = value as Record<string, unknown>;
  const name = requireString(obj.name, "Full name");
  const email = requireString(obj.email, "Email");
  if (!isValidEmail(email)) {
    throw new CheckoutValidationError("Enter a valid email address.");
  }
  const phone = requireString(obj.phone, "Phone number");
  if (!isValidPhone(phone)) {
    throw new CheckoutValidationError("Enter a valid phone number.");
  }
  return { name, email, phone };
}

export function validateShippingAddress(value: unknown): ShippingAddress {
  if (!value || typeof value !== "object") {
    throw new CheckoutValidationError("Shipping address is required.");
  }
  const obj = value as Record<string, unknown>;
  const fullName = requireString(obj.fullName, "Recipient name");
  const line1 = requireString(obj.line1, "Address line 1");
  const line2 =
    typeof obj.line2 === "string" && obj.line2.trim() ? obj.line2.trim() : undefined;
  const city = requireString(obj.city, "City");
  const state = requireString(obj.state, "State");
  const pincode = requireString(obj.pincode, "Pincode");
  if (!isValidPincode(pincode)) {
    throw new CheckoutValidationError("Enter a valid pincode.");
  }
  const phone = requireString(obj.phone, "Shipping phone number");
  if (!isValidPhone(phone)) {
    throw new CheckoutValidationError("Enter a valid shipping phone number.");
  }
  return { fullName, line1, line2, city, state, pincode, phone };
}
