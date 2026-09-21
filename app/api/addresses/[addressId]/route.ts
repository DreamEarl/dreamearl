import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  AddressValidationError,
  validateAddressInput,
} from "@/lib/addresses/validate";
import type { Address } from "@/lib/addresses/types";

interface RouteParams {
  params: Promise<{ addressId: string }>;
}

async function setAsDefault(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  addressId: string,
) {
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", userId)
    .eq("is_default", true);

  return supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", userId)
    .select("*")
    .single();
}

export async function PATCH(
  request: Request,
  { params }: Readonly<RouteParams>,
) {
  const { addressId } = await params;
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

  const raw = (body ?? {}) as Record<string, unknown>;

  // A "set as default" request only ever sends { isDefault: true } — no other
  // fields to validate/update.
  const isSetDefaultOnly =
    raw.isDefault === true && Object.keys(raw).length === 1;

  if (isSetDefaultOnly) {
    const { data, error } = await setAsDefault(supabase, user.id, addressId);
    if (error || !data) {
      return NextResponse.json(
        { error: "Address not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ address: data as Address });
  }

  let input;
  try {
    input = validateAddressInput(raw);
  } catch (err) {
    if (err instanceof AddressValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  if (input.isDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true)
      .neq("id", addressId);
  }

  const { data, error } = await supabase
    .from("addresses")
    .update({
      full_name: input.fullName,
      phone: input.phone,
      line1: input.line1,
      line2: input.line2 ?? null,
      city: input.city,
      state: input.state,
      pincode: input.pincode ?? null,
      is_default: input.isDefault,
    })
    .eq("id", addressId)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  return NextResponse.json({ address: data as Address });
}

export async function DELETE(
  _request: Request,
  { params }: Readonly<RouteParams>,
) {
  const { addressId } = await params;
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

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Unable to remove address." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
