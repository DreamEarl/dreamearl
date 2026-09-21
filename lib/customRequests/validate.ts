export class CustomRequestValidationError extends Error {}

export interface ValidatedCustomRequestInput {
  productType: string;
  message: string;
  imageUrl: string | null;
}

export function validateCustomRequestInput(
  body: unknown,
): ValidatedCustomRequestInput {
  if (typeof body !== "object" || body === null) {
    throw new CustomRequestValidationError("Invalid request body.");
  }

  const { productType, message, imageUrl } = body as Record<string, unknown>;

  if (typeof productType !== "string" || !productType.trim()) {
    throw new CustomRequestValidationError("Product type is required.");
  }
  if (typeof message !== "string" || !message.trim()) {
    throw new CustomRequestValidationError("Custom requirements are required.");
  }
  if (
    imageUrl !== undefined &&
    imageUrl !== null &&
    typeof imageUrl !== "string"
  ) {
    throw new CustomRequestValidationError("Invalid image URL.");
  }

  return {
    productType: productType.trim(),
    message: message.trim(),
    imageUrl: (imageUrl as string | undefined) ?? null,
  };
}
