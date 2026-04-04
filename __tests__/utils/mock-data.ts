import { Product } from "@/lib/data/products";

export const mockProduct: Product = {
  id: "test-1",
  slug: "test-product",
  brand: "DREAMEARL",
  name: "Test Product",
  price: 1000,
  currency: "Rs.",
  image: "/test-image.jpg",
  category: "test-category",
  details: {
    product: "Test Item",
    craftTechnique: "Handmade",
    pearlType: "Natural",
    pearlColour: "White",
    size: "5x5",
  },
  note: "Test note",
  careInstructions: "Test care instructions",
  shippingInfo: "Test shipping info",
  packagingInfo: "Test packaging info",
};

export const mockProducts: Product[] = [
  mockProduct,
  {
    ...mockProduct,
    id: "test-2",
    slug: "test-product-2",
    name: "Test Product 2",
    price: 2000,
  },
];
