import {
  CheckoutValidationError,
  isValidEmail,
  isValidPhone,
  isValidPincode,
  validateCheckoutItems,
  validateCustomer,
  validateShippingAddress,
} from "@/lib/orders/validate";

describe("isValidEmail", () => {
  it("accepts a normal email", () => {
    expect(isValidEmail("jane@example.com")).toBe(true);
  });

  it.each([
    ["missing @", "janeexample.com"],
    ["multiple @", "jane@ex@ample.com"],
    ["no domain dot", "jane@examplecom"],
    ["contains a space", "jane doe@example.com"],
    ["dot at end of domain", "jane@example."],
  ])("rejects %s", (_label, value) => {
    expect(isValidEmail(value)).toBe(false);
  });
});

describe("isValidPhone", () => {
  it("accepts common phone formats", () => {
    expect(isValidPhone("+91 9876543210")).toBe(true);
    expect(isValidPhone("9876543210")).toBe(true);
  });

  it("rejects too-short or letter-containing values", () => {
    expect(isValidPhone("123")).toBe(false);
    expect(isValidPhone("abcdefghij")).toBe(false);
  });
});

describe("isValidPincode", () => {
  it("accepts 4-10 digit pincodes", () => {
    expect(isValidPincode("560001")).toBe(true);
  });

  it("rejects non-numeric or empty pincodes", () => {
    expect(isValidPincode("ABC123")).toBe(false);
    expect(isValidPincode("")).toBe(false);
  });
});

describe("validateCheckoutItems", () => {
  it("returns normalized items", () => {
    expect(validateCheckoutItems([{ id: "p1", quantity: 2 }])).toEqual([
      { id: "p1", quantity: 2 },
    ]);
  });

  it("throws when the cart is empty", () => {
    expect(() => validateCheckoutItems([])).toThrow(CheckoutValidationError);
  });

  it("throws when quantity is not a positive integer", () => {
    expect(() => validateCheckoutItems([{ id: "p1", quantity: 0 }])).toThrow(
      CheckoutValidationError,
    );
    expect(() => validateCheckoutItems([{ id: "p1", quantity: 1.5 }])).toThrow(
      CheckoutValidationError,
    );
  });

  it("throws when quantity exceeds the per-item maximum", () => {
    expect(() => validateCheckoutItems([{ id: "p1", quantity: 21 }])).toThrow(
      CheckoutValidationError,
    );
  });
});

describe("validateCustomer", () => {
  const valid = {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "9876543210",
  };

  it("returns trimmed fields for valid input", () => {
    expect(validateCustomer({ ...valid, name: "  Jane Doe  " })).toEqual(valid);
  });

  it("throws for an invalid email", () => {
    expect(() => validateCustomer({ ...valid, email: "not-an-email" })).toThrow(
      CheckoutValidationError,
    );
  });

  it("throws for an invalid phone", () => {
    expect(() => validateCustomer({ ...valid, phone: "abc" })).toThrow(
      CheckoutValidationError,
    );
  });
});

describe("validateShippingAddress", () => {
  const valid = {
    fullName: "Jane Doe",
    line1: "221B Baker Street",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    phone: "9876543210",
  };

  it("returns the address for valid input", () => {
    expect(validateShippingAddress(valid)).toEqual(valid);
  });

  it("keeps optional line2 when provided", () => {
    expect(
      validateShippingAddress({ ...valid, line2: "Near the park" }).line2,
    ).toBe("Near the park");
  });

  it("throws for an invalid pincode", () => {
    expect(() => validateShippingAddress({ ...valid, pincode: "abc" })).toThrow(
      CheckoutValidationError,
    );
  });

  it("throws when a required field is missing", () => {
    expect(() => validateShippingAddress({ ...valid, city: "" })).toThrow(
      CheckoutValidationError,
    );
  });
});
