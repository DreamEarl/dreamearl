import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProductsForCheckout } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/client";
import { razorpay } from "@/lib/razorpay/client";
import { CURRENCY, computeOrderTotals, toPaise } from "@/lib/orders/pricing";
import {
  CheckoutValidationError,
  validateCheckoutItems,
  validateCustomer,
  validateShippingAddress,
} from "@/lib/orders/validate";
import type { Order, OrderItemSnapshot } from "@/lib/orders/types";

// Stable signature so a retry with an unchanged cart can reuse the same pending
// order/Razorpay order instead of creating duplicates.
function itemsSignature(items: { productId: string; quantity: number }[]): string {
  return items
    .map((i) => `${i.productId}:${i.quantity}`)
    .sort((a, b) => a.localeCompare(b))
    .join(",");
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in to check out." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  let requestItems, customer, shippingAddress;
  try {
    const raw = body as Record<string, unknown>;
    requestItems = validateCheckoutItems(raw.items);
    customer = validateCustomer(raw.customer);
    shippingAddress = validateShippingAddress(raw.shippingAddress);
  } catch (err) {
    if (err instanceof CheckoutValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  // Never trust price/availability from the browser — re-fetch from Sanity.
  const ids = [...new Set(requestItems.map((i) => i.id))];
  const products = await getProductsForCheckout(ids);
  const productById = new Map(products.map((p) => [p._id, p]));

  const unavailable: string[] = [];
  const items: OrderItemSnapshot[] = [];

  for (const requested of requestItems) {
    const product = productById.get(requested.id);
    if (!product?.inStock) {
      unavailable.push(product?.name ?? requested.id);
      continue;
    }
    items.push({
      productId: product._id,
      name: product.name,
      image: product.images?.[0] ? urlFor(product.images[0]).url() : "",
      price: product.price,
      quantity: requested.quantity,
      currency: product.currency,
      subtitle: product.productType,
      color: product.pearlColour,
    });
  }

  if (unavailable.length > 0) {
    return NextResponse.json(
      {
        error: `Some items in your cart are no longer available: ${unavailable.join(", ")}.`,
      },
      { status: 409 },
    );
  }

  // Recalculate the authoritative total server-side — the frontend total is never trusted.
  const totals = computeOrderTotals(items);
  const signature = itemsSignature(
    items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
  );

  // Reuse a recent unpaid order for this exact cart to avoid duplicate rows on
  // retries/duplicate clicks, instead of always inserting a new order.
  const { data: existingOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "PENDING")
    .in("payment_status", ["PENDING", "FAILED"])
    .order("created_at", { ascending: false })
    .limit(5);

  const reusable = (existingOrders as Order[] | null)?.find(
    (order) =>
      order.razorpay_order_id &&
      order.total === totals.total &&
      itemsSignature(
        order.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      ) === signature,
  );

  if (reusable) {
    return NextResponse.json({
      orderId: reusable.id,
      razorpayOrderId: reusable.razorpay_order_id,
      amount: toPaise(reusable.total),
      currency: reusable.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  }

  const { data: inserted, error: insertError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: shippingAddress,
      items,
      subtotal: totals.subtotal,
      shipping_fee: totals.shippingFee,
      discount: totals.discount,
      total: totals.total,
      currency: CURRENCY,
      status: "PENDING",
      payment_status: "PENDING",
    })
    .select()
    .single();

  if (insertError || !inserted) {
    console.error("[create-order] failed to insert order", insertError);
    return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
  }

  const order = inserted as Order;

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: toPaise(order.total),
      currency: CURRENCY,
      receipt: order.id,
      notes: { supabase_order_id: order.id },
    });

    const { error: updateError } = await supabase
      .from("orders")
      .update({ razorpay_order_id: razorpayOrder.id })
      .eq("id", order.id);

    if (updateError) {
      console.error("[create-order] failed to save razorpay order id", updateError);
      return NextResponse.json({ error: "Failed to create payment order." }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: toPaise(order.total),
      currency: CURRENCY,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[create-order] razorpay order creation failed", err);
    return NextResponse.json({ error: "Failed to start payment." }, { status: 502 });
  }
}
