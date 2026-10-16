import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin/auth";
import { sendCustomRequestDeclineEmail } from "@/lib/customRequests/notifyDecline";
import { CUSTOM_REQUEST_STATUSES } from "@/lib/customRequests/types";
import type { CustomRequest } from "@/lib/customRequests/types";

interface RouteParams {
  params: Promise<{ requestId: string }>;
}

export async function PATCH(
  request: Request,
  { params }: Readonly<RouteParams>,
) {
  const { requestId } = await params;
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

  let body: { status?: unknown; declineReason?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { status, declineReason } = body;
  if (
    typeof status !== "string" ||
    !(CUSTOM_REQUEST_STATUSES as readonly string[]).includes(status)
  ) {
    return NextResponse.json(
      { error: "Invalid request status." },
      { status: 400 },
    );
  }

  let reason: string | null = null;
  if (status === "DECLINED") {
    if (typeof declineReason !== "string" || !declineReason.trim()) {
      return NextResponse.json(
        { error: "Please provide a reason for declining this request." },
        { status: 400 },
      );
    }
    reason = declineReason.trim();
  }

  // Service-role client: admins have no per-row RLS grant on other users' custom requests.
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("custom_requests")
    .update({ status, decline_reason: reason })
    .eq("id", requestId)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Custom request not found." },
      { status: 404 },
    );
  }

  const updated = data as CustomRequest;
  if (status === "DECLINED" && reason) {
    await sendCustomRequestDeclineEmail(updated, reason);
  }

  return NextResponse.json({ customRequest: updated });
}
