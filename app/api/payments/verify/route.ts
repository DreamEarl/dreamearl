import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyPaymentSignature } from "@/lib/razorpay/signature";
import type { Order } from "@/lib/orders/types";

interface VerifyRequestBody {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  let body: Partial<VerifyRequestBody>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const order = existing as Order;

  // Idempotent: if a previous call (or the webhook) already confirmed this order,
  // don't reprocess — just report success.
  if (order.payment_status === "PAID") {
    return NextResponse.json({ success: true, orderId: order.id, status: order.status });
  }

  if (order.razorpay_order_id !== razorpay_order_id) {
    return NextResponse.json(
      { error: "This payment does not belong to the given order." },
      { status: 400 },
    );
  }

  const isValid = verifyPaymentSignature({
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  });

  if (!isValid) {
    // Record the failure, but never mark the order paid based on frontend input alone.
    await supabase
      .from("orders")
      .update({ payment_status: "FAILED" })
      .eq("id", order.id)
      .neq("payment_status", "PAID");

    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  // Conditional update guards against a race with the webhook processing the same order.
  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update({
      payment_status: "PAID",
      status: "CONFIRMED",
      razorpay_payment_id,
    })
    .eq("id", order.id)
    .neq("payment_status", "PAID")
    .select()
    .single();

  if (updateError || !updated) {
    // Another request (likely the webhook) already confirmed it — treat as success.
    return NextResponse.json({ success: true, orderId: order.id, status: "CONFIRMED" });
  }

  return NextResponse.json({ success: true, orderId: order.id, status: "CONFIRMED" });
}
