import crypto from "node:crypto";
import {
  verifyPaymentSignature,
  verifyWebhookSignature,
} from "@/lib/razorpay/signature";

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    RAZORPAY_KEY_SECRET: "test_key_secret",
    RAZORPAY_WEBHOOK_SECRET: "test_webhook_secret",
  };
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe("verifyPaymentSignature", () => {
  const razorpayOrderId = "order_ABC123";
  const razorpayPaymentId = "pay_XYZ789";

  function sign(orderId: string, paymentId: string) {
    return crypto
      .createHmac("sha256", "test_key_secret")
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
  }

  it("accepts a signature computed with the correct secret", () => {
    const signature = sign(razorpayOrderId, razorpayPaymentId);
    expect(
      verifyPaymentSignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature: signature,
      }),
    ).toBe(true);
  });

  it("rejects a signature computed with the wrong secret", () => {
    const signature = crypto
      .createHmac("sha256", "wrong_secret")
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
    expect(
      verifyPaymentSignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature: signature,
      }),
    ).toBe(false);
  });

  it("rejects a signature for a different order/payment id", () => {
    const signature = sign(razorpayOrderId, "pay_DIFFERENT");
    expect(
      verifyPaymentSignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature: signature,
      }),
    ).toBe(false);
  });

  it("rejects a malformed (non-hex) signature instead of throwing", () => {
    expect(
      verifyPaymentSignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature: "not-hex!!",
      }),
    ).toBe(false);
  });
});

describe("verifyWebhookSignature", () => {
  it("accepts a signature computed over the raw body with the webhook secret", () => {
    const rawBody = JSON.stringify({ event: "order.paid" });
    const signature = crypto
      .createHmac("sha256", "test_webhook_secret")
      .update(rawBody)
      .digest("hex");
    expect(verifyWebhookSignature(rawBody, signature)).toBe(true);
  });

  it("rejects a signature if the body was tampered with", () => {
    const signature = crypto
      .createHmac("sha256", "test_webhook_secret")
      .update(JSON.stringify({ event: "order.paid" }))
      .digest("hex");
    const tamperedBody = JSON.stringify({
      event: "order.paid",
      extra: "field",
    });
    expect(verifyWebhookSignature(tamperedBody, signature)).toBe(false);
  });
});
