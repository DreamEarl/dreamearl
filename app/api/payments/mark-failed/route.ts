import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface MarkFailedRequestBody {
  orderId: string;
  razorpay_order_id?: string;
}

// Called by the client when Razorpay Checkout reports a payment.failed event.
// This only ever moves an order towards FAILED — it can never mark an order PAID,
// so it's safe to trust this signal for UX purposes (e.g. showing a retry button).
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  let body: Partial<MarkFailedRequestBody>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.orderId) {
    return NextResponse.json({ error: "Missing orderId." }, { status: 400 });
  }

  await supabase
    .from("orders")
    .update({ payment_status: "FAILED" })
    .eq("id", body.orderId)
    .eq("user_id", user.id)
    .neq("payment_status", "PAID");

  return NextResponse.json({ success: true });
}
