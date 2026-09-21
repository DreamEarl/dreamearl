import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  AddressValidationError,
  validateAddressInput,
} from "@/lib/addresses/validate";
import type { Address } from "@/lib/addresses/types";

export async function GET() {
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

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Unable to load addresses." },
      { status: 500 },
    );
  }

  return NextResponse.json({ addresses: data ?? [] });
}

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
    input = validateAddressInput(body);
  } catch (err) {
    if (err instanceof AddressValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  // The very first address a user saves is always their default.
  const { count } = await supabase
    .from("addresses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const isDefault = input.isDefault || !count;

  if (isDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: user.id,
      full_name: input.fullName,
      phone: input.phone,
      line1: input.line1,
      line2: input.line2 ?? null,
      city: input.city,
      state: input.state,
      pincode: input.pincode ?? null,
      is_default: isDefault,
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Unable to save address." },
      { status: 500 },
    );
  }

  return NextResponse.json({ address: data as Address }, { status: 201 });
}
