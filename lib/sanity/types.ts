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
export interface SanitySubcategory {
  label: string;
  slug: {
    current: string;
  };
  image: SanityImageSource;
  displayOrder: number;
}

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
  subcategories?: SanitySubcategory[];
}

// Customization Section Types
export interface SanityCustomizationSection {
  _id: string;
  _type: "customizationSection";
  heading?: string;
  subtitle?: string;
  buttonText?: string;
  images?: CustomizationImage[];
}

// Collection Section Types
export interface SanityCollectionSection {
  _id: string;
  _type: "collectionSection";
  title: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  image: SanityImageSource & { alt?: string };
  imagePosition: "left" | "right";
  isActive: boolean;
}

// Site Settings Types
export type CustomizationImage = SanityImageSource & {
  _key: string;
  alt?: string;
};

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
