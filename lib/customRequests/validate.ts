import { isValidEmail, isValidPhone } from "@/lib/orders/validate";
import { MAX_CUSTOM_REQUEST_IMAGES } from "@/lib/customRequests/types";

export class CustomRequestValidationError extends Error {}

export interface ValidatedCustomRequestInput {
  fullName: string;
  email: string;
  phone: string;
  productType: string;
  message: string;
  imageUrls: string[];
}

function validateImageUrls(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new CustomRequestValidationError("Invalid image URLs.");
  }
  if (value.length > MAX_CUSTOM_REQUEST_IMAGES) {
    throw new CustomRequestValidationError(
      `You can attach up to ${MAX_CUSTOM_REQUEST_IMAGES} images.`,
    );
  }
  if (!value.every((url) => typeof url === "string" && url.trim())) {
    throw new CustomRequestValidationError("Invalid image URLs.");
  }
  return value as string[];
}

export function validateCustomRequestInput(
  body: unknown,
): ValidatedCustomRequestInput {
  if (typeof body !== "object" || body === null) {
    throw new CustomRequestValidationError("Invalid request body.");
  }

  const { fullName, email, phone, productType, message, imageUrls } =
    body as Record<string, unknown>;

  if (typeof fullName !== "string" || !fullName.trim()) {
    throw new CustomRequestValidationError("Full name is required.");
  }
  if (typeof email !== "string" || !isValidEmail(email.trim())) {
    throw new CustomRequestValidationError("Enter a valid email address.");
  }
  if (typeof phone !== "string" || !isValidPhone(phone.trim())) {
    throw new CustomRequestValidationError("Enter a valid phone number.");
  }
  if (typeof productType !== "string" || !productType.trim()) {
    throw new CustomRequestValidationError("Product type is required.");
  }
  if (typeof message !== "string" || !message.trim()) {
    throw new CustomRequestValidationError("Custom requirements are required.");
  }

  return {
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    productType: productType.trim(),
    message: message.trim(),
    imageUrls: validateImageUrls(imageUrls),
  };
}
