import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Lightweight polling endpoint used by the order-success page while a payment is
// still PENDING (e.g. waiting on the webhook) so the UI can update without a full reload.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("orders")
    .select("id, status, payment_status, total, currency")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({
    status: data.status,
    paymentStatus: data.payment_status,
    total: data.total,
    currency: data.currency,
  });
}
