export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  details: {
    product: string;
    craftTechnique: string;
    pearlType: string;
    pearlColour: string;
    size: string;
  };
  note: string;
  careInstructions: string;
  shippingInfo: string;
  packagingInfo: string;
}

export const sampleProducts: Product[] = [
  {
    id: "1",
    slug: "ethereal-pearl",
    brand: "DREAMEARL",
    name: "ETHEREAL PEARL",
    price: 4599,
    currency: "Rs.",
    image: "/products/ethereal-pearl.jpg",
    category: "handbags",
    details: {
      product: "Handbag",
      craftTechnique: "Handmade / Handwoven",
      pearlType: "Manufactured",
      pearlColour: "Ivory",
      size: '7"W x 9"H',
    },
    note: "All our products are handcrafted, resulting in each piece being unique and slightly distinct in their own way. Hence, no two pieces can be exactly the same.",
    careInstructions:
      "It is recommended to keep away from moisture, perfumes, chemicals and excessive heat. To be stored in an airtight bag/ziplock provided with the purchase.",
    shippingInfo:
      "Free shipping for all orders above Rs. 3,000 in India. Delivered within 3-7 days.",
    packagingInfo:
      "All our pieces are carefully gift-wrapped in our signature pink boxes, which have a soft-touch suede cushioning on both the sides. We also provide a 'Care Tips' card with every Anaash piece.",
  },
  {
    id: "2",
    slug: "silver-mini-muse",
    brand: "DREAMEARL",
    name: "SILVER MINI MUSE",
    price: 2299,
    currency: "Rs.",
    image: "/products/silver-mini-muse.jpg",
    category: "handbags",
    details: {
      product: "Handbag",
      craftTechnique: "Handmade / Handwoven",
      pearlType: "Manufactured",
      pearlColour: "Silver",
      size: '6"W x 8"H',
    },
    note: "All our products are handcrafted, resulting in each piece being unique and slightly distinct in their own way. Hence, no two pieces can be exactly the same.",
    careInstructions:
      "It is recommended to keep away from moisture, perfumes, chemicals and excessive heat. To be stored in an airtight bag/ziplock provided with the purchase.",
    shippingInfo:
      "Free shipping for all orders above Rs. 3,000 in India. Delivered within 3-7 days.",
    packagingInfo:
      "All our pieces are carefully gift-wrapped in our signature pink boxes, which have a soft-touch suede cushioning on both the sides. We also provide a 'Care Tips' card with every Anaash piece.",
  },
  {
    id: "3",
    slug: "lumi-perle",
    brand: "DREAMEARL",
    name: "LUMI PERLE",
    price: 3999,
    currency: "Rs.",
    image: "/products/lumi-perle.jpg",
    category: "handbags",
    details: {
      product: "Handbag",
      craftTechnique: "Handmade / Handwoven",
      pearlType: "Manufactured",
      pearlColour: "Champagne",
      size: '8"W x 10"H',
    },
    note: "All our products are handcrafted, resulting in each piece being unique and slightly distinct in their own way. Hence, no two pieces can be exactly the same.",
    careInstructions:
      "It is recommended to keep away from moisture, perfumes, chemicals and excessive heat. To be stored in an airtight bag/ziplock provided with the purchase.",
    shippingInfo:
      "Free shipping for all orders above Rs. 3,000 in India. Delivered within 3-7 days.",
    packagingInfo:
      "All our pieces are carefully gift-wrapped in our signature pink boxes, which have a soft-touch suede cushioning on both the sides. We also provide a 'Care Tips' card with every Anaash piece.",
  },
];

// Helper function to get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return sampleProducts.find((product) => product.slug === slug);
}

// Helper function to get products by category
export function getProductsByCategory(category: string): Product[] {
  return sampleProducts.filter((product) => product.category === category);
}
