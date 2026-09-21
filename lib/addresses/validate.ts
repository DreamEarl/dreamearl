import { isValidPhone, isValidPincode } from "@/lib/orders/validate";
import type { AddressInput } from "@/lib/addresses/types";

export class AddressValidationError extends Error {}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new AddressValidationError(`${field} is required.`);
  }
  return value.trim();
}

export function validateAddressInput(value: unknown): AddressInput {
  if (!value || typeof value !== "object") {
    throw new AddressValidationError("Address details are required.");
  }
  const obj = value as Record<string, unknown>;

  const fullName = requireString(obj.fullName, "Full name");
  const phone = requireString(obj.phone, "Phone number");
  if (!isValidPhone(phone)) {
    throw new AddressValidationError("Enter a valid phone number.");
  }
  const line1 = requireString(obj.line1, "Address line 1");
  const city = requireString(obj.city, "City");
  const state = requireString(obj.state, "State");

  const line2 = typeof obj.line2 === "string" ? obj.line2.trim() : "";

  let pincode = "";
  if (typeof obj.pincode === "string" && obj.pincode.trim()) {
    pincode = obj.pincode.trim();
    if (!isValidPincode(pincode)) {
      throw new AddressValidationError("Enter a valid PIN code.");
    }
  }

  const isDefault = Boolean(obj.isDefault);

  return {
    fullName,
    phone,
    line1,
    line2: line2 || undefined,
    city,
    state,
    pincode: pincode || undefined,
    isDefault,
  };
}
