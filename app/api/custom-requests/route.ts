import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  CustomRequestValidationError,
  validateCustomRequestInput,
} from "@/lib/customRequests/validate";
import type { CustomRequest } from "@/lib/customRequests/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  let input;
  try {
    input = validateCustomRequestInput(body);
  } catch (err) {
    if (err instanceof CustomRequestValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  const { data, error } = await supabase
    .from("custom_requests")
    .insert({
      user_id: user.id,
      product_type: input.productType,
      message: input.message,
      image_url: input.imageUrl,
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Unable to save custom request." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { customRequest: data as CustomRequest },
    { status: 201 },
  );
}
