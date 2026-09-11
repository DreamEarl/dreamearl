import { NextRequest, NextResponse } from "next/server";
import { urlFor } from "@/lib/sanity/client";
import { getProductsByIds } from "@/lib/sanity/queries";

// Enriches raw cart ids with live product data (name/price/image/etc.)
export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json({ items: [] });
  }

  try {
    const products = await getProductsByIds(ids);

    const items = products.map((product) => ({
      id: product._id,
      name: product.name,
      subtitle: product.productType,
      price: product.price,
      image: product.images?.[0] ? urlFor(product.images[0]).url() : "",
      href: `/products/${product.slug.current}`,
      brand: product.brand,
      currency: product.currency,
      color: product.pearlColour,
    }));

    return NextResponse.json({ items });
  } catch (err) {
    console.error("[cart-items]", err);
    return NextResponse.json(
      { error: "Failed to load cart items" },
      { status: 500 },
    );
  }
}
