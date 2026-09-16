import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyWebhookSignature } from "@/lib/razorpay/signature";

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    order?: { entity: { id: string } };
    payment?: { entity: { id: string; order_id: string } };
  };
}

// Configure this URL in Razorpay Dashboard -> Settings -> Webhooks, subscribed to
// the "order.paid" event (payment.captured is also handled defensively).
// This is the source of truth for payment state — the client-side verify call is
// only for immediate UX feedback.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  let event: RazorpayWebhookPayload;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  const razorpayOrderId =
    event.payload.order?.entity.id ?? event.payload.payment?.entity.order_id;
  const razorpayPaymentId = event.payload.payment?.entity.id;

  if (!razorpayOrderId) {
    // Nothing we can act on — acknowledge so Razorpay doesn't keep retrying.
    return NextResponse.json({ received: true });
  }

  if (event.event !== "order.paid" && event.event !== "payment.captured") {
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminClient();

  // Idempotent: only flip PENDING/FAILED orders to PAID; already-paid orders are left untouched.
  const { data: updated, error } = await supabase
    .from("orders")
    .update({
      payment_status: "PAID",
      status: "CONFIRMED",
      ...(razorpayPaymentId ? { razorpay_payment_id: razorpayPaymentId } : {}),
    })
    .eq("razorpay_order_id", razorpayOrderId)
    .neq("payment_status", "PAID")
    .select("id");

  if (error) {
    console.error("[razorpay-webhook] failed to update order", error);
    return NextResponse.json({ error: "Failed to process webhook." }, { status: 500 });
  }

  if (!updated || updated.length === 0) {
    // Either already processed (idempotent no-op) or no matching order — both are fine.
    console.warn(
      `[razorpay-webhook] no pending order updated for razorpay_order_id=${razorpayOrderId}`,
    );
  }

  return NextResponse.json({ received: true });
}
