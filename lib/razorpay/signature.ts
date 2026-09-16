import crypto from "node:crypto";

function timingSafeEqualHex(expectedHex: string, actualHex: string): boolean {
  const expected = Buffer.from(expectedHex, "hex");
  const actual = Buffer.from(actualHex, "hex");
  if (expected.length === 0 || expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

// Per Razorpay docs: signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
export function verifyPaymentSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("RAZORPAY_KEY_SECRET is not configured.");

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
    .digest("hex");

  try {
    return timingSafeEqualHex(expected, params.razorpaySignature);
  } catch {
    return false;
  }
}

// Per Razorpay docs: webhook signature = HMAC_SHA256(raw request body, webhook secret)
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error("RAZORPAY_WEBHOOK_SECRET is not configured.");

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  try {
    return timingSafeEqualHex(expected, signature);
  } catch {
    return false;
  }
}
