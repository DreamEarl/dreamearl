import type { SanityImageSource } from "@sanity/image-url";

// Product Types
export interface SanityProduct {
  _id: string;
  _type: "product";
  brand: string;
  name: string;
  slug: {
    current: string;
  };
  images: SanityImageSource[];
  price: number;
  currency: string;
  category: {
    _ref: string;
    _type: "reference";
  };
  description?: string;
  productType?: string;
  craftTechnique?: string;
  pearlType?: string;
  pearlColour?: string;
  size?: string;
  note?: string;
  careInstructions?: string;
  shippingInfo?: string;
  packagingInfo?: string;
  inStock: boolean;
  featured: boolean;
}

// Category Types
export interface SanityCategory {
  _id: string;
  _type: "category";
  name: string;
  slug: {
    current: string;
  };
  image: SanityImageSource;
  description?: string;
  displayOrder: number;
}

// Site Settings Types
export interface SanitySiteSettings {
  _id: string;
  _type: "siteSettings";
  brand: string;
  tagline?: string;
  description?: string;
  contactEmail?: string;
  phone?: string;
  whatsappNumber?: string;
  address?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    pinterest?: string;
    twitter?: string;
  };
  aboutPage?: any[];
}
