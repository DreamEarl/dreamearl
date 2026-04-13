import { notFound } from "next/navigation";
import {
  getProductBySlug as getSanityProductBySlug,
  urlFor,
} from "@/lib/sanity";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const product = await getSanityProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Transform Sanity product to match component expectations
  const transformedProduct = {
    brand: product.brand,
    name: product.name,
    price: product.price,
    currency: product.currency,
    images: product.images.map((img) => urlFor(img).width(1200).url()),
    details: {
      product: product.productType || "N/A",
      craftTechnique: product.craftTechnique || "N/A",
      pearlType: product.pearlType || "N/A",
      pearlColour: product.pearlColour || "N/A",
      size: product.size || "N/A",
    },
    note: product.note || "",
    careInstructions: product.careInstructions || "",
    shippingInfo: product.shippingInfo || "",
    packagingInfo: product.packagingInfo || "",
  };

  return <ProductDetailClient product={transformedProduct} />;
}
