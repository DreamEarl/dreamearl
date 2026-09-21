import {
  AddressValidationError,
  validateAddressInput,
} from "@/lib/addresses/validate";

const valid = {
  fullName: "Sakshi Mandlik",
  phone: "9876543210",
  line1: "221B Baker Street",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560001",
};

describe("validateAddressInput", () => {
  it("returns normalized fields for valid input", () => {
    expect(
      validateAddressInput({ ...valid, fullName: "  Sakshi Mandlik  " }),
    ).toEqual({
      fullName: "Sakshi Mandlik",
      phone: "9876543210",
      line1: "221B Baker Street",
      line2: undefined,
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      isDefault: false,
    });
  });

  it("carries the isDefault flag and optional line2", () => {
    expect(
      validateAddressInput({
        ...valid,
        line2: "Near City Mall",
        isDefault: true,
      }),
    ).toMatchObject({ line2: "Near City Mall", isDefault: true });
  });

  it("allows an empty pincode", () => {
    expect(validateAddressInput({ ...valid, pincode: "" })).toMatchObject({
      pincode: undefined,
    });
  });

  it.each([
    ["fullName", { ...valid, fullName: "" }],
    ["phone", { ...valid, phone: "" }],
    ["line1", { ...valid, line1: "" }],
    ["city", { ...valid, city: "" }],
    ["state", { ...valid, state: "" }],
  ])("throws when %s is missing", (_field, input) => {
    expect(() => validateAddressInput(input)).toThrow(AddressValidationError);
  });

  it("throws for an invalid phone", () => {
    expect(() => validateAddressInput({ ...valid, phone: "abc" })).toThrow(
      AddressValidationError,
    );
  });

  it("throws for an invalid pincode", () => {
    expect(() => validateAddressInput({ ...valid, pincode: "ABCDE" })).toThrow(
      AddressValidationError,
    );
  });

  it("throws when the input is not an object", () => {
    expect(() => validateAddressInput(null)).toThrow(AddressValidationError);
  });
});
