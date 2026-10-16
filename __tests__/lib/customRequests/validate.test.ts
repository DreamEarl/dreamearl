import {
  CustomRequestValidationError,
  validateCustomRequestInput,
} from "@/lib/customRequests/validate";
import { MAX_CUSTOM_REQUEST_IMAGES } from "@/lib/customRequests/types";

const validInput = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  phone: "+91 9876543210",
  productType: "Necklace",
  message: "Pearl bag in pastel pink with detachable chain.",
  imageUrls: ["https://example.com/a.png", "https://example.com/b.png"],
};

describe("validateCustomRequestInput", () => {
  it("returns normalized input for a valid payload", () => {
    expect(validateCustomRequestInput(validInput)).toEqual(validInput);
  });

  it("defaults imageUrls to an empty array when omitted", () => {
    const { imageUrls, ...rest } = validInput;
    expect(validateCustomRequestInput(rest)).toEqual({
      ...rest,
      imageUrls: [],
    });
  });

  it("throws for a non-object body", () => {
    expect(() => validateCustomRequestInput(null)).toThrow(
      CustomRequestValidationError,
    );
    expect(() => validateCustomRequestInput("nope")).toThrow(
      CustomRequestValidationError,
    );
  });

  it("throws when full name is missing", () => {
    expect(() =>
      validateCustomRequestInput({ ...validInput, fullName: "  " }),
    ).toThrow(CustomRequestValidationError);
  });

  it("throws for an invalid email", () => {
    expect(() =>
      validateCustomRequestInput({ ...validInput, email: "not-an-email" }),
    ).toThrow(CustomRequestValidationError);
  });

  it("throws for an invalid phone", () => {
    expect(() =>
      validateCustomRequestInput({ ...validInput, phone: "abc" }),
    ).toThrow(CustomRequestValidationError);
  });

  it("throws when product type is missing", () => {
    expect(() =>
      validateCustomRequestInput({ ...validInput, productType: "" }),
    ).toThrow(CustomRequestValidationError);
  });

  it("throws when message is missing", () => {
    expect(() =>
      validateCustomRequestInput({ ...validInput, message: "" }),
    ).toThrow(CustomRequestValidationError);
  });

  it("throws when more than the max number of images is provided", () => {
    const imageUrls = Array.from(
      { length: MAX_CUSTOM_REQUEST_IMAGES + 1 },
      (_, i) => `https://example.com/${i}.png`,
    );
    expect(() =>
      validateCustomRequestInput({ ...validInput, imageUrls }),
    ).toThrow(CustomRequestValidationError);
  });

  it("throws when imageUrls contains a non-string entry", () => {
    expect(() =>
      validateCustomRequestInput({ ...validInput, imageUrls: [123] }),
    ).toThrow(CustomRequestValidationError);
  });
});
