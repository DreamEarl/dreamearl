import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin/auth";
import { ORDER_STATUSES } from "@/lib/orders/types";

interface RouteParams {
  params: Promise<{ orderId: string }>;
}

export async function PATCH(
  request: Request,
  { params }: Readonly<RouteParams>,
) {
  const { orderId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.json(
      { error: "You are not authorized to perform this action." },
      { status: 403 },
    );
  }

  let body: { status?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { status } = body;
  if (
    typeof status !== "string" ||
    !(ORDER_STATUSES as readonly string[]).includes(status)
  ) {
    return NextResponse.json(
      { error: "Invalid order status." },
      { status: 400 },
    );
  }

  // Service-role client: admins have no per-row RLS grant on other users' orders.
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order: data });
}
