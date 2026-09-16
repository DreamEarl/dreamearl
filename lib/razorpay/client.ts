import Razorpay from "razorpay";

// TEST MODE ONLY. RAZORPAY_KEY_SECRET must stay server-side and is read from env.
// When going live, swap NEXT_PUBLIC_RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET for the
// rzp_live_... pair in the deployment environment — no code changes needed here.
const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  throw new Error(
    "Razorpay is not configured. Set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
  );
}

if (!keyId.startsWith("rzp_test_")) {
  // Guard rail: this integration is wired for Razorpay TEST MODE only.
  console.warn(
    "[razorpay] NEXT_PUBLIC_RAZORPAY_KEY_ID does not look like a test-mode key (expected prefix 'rzp_test_').",
  );
}

export const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
