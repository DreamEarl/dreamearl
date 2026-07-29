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
  productTypes?: string[];
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
  displayOrder?: number;
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
  subcategory?: string;
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

// About Page Types
export interface SanityAboutSection {
  title: string;
  content: string;
}

export interface SanityAboutStorySection {
  image: SanityImageSource;
  eyebrow?: string;
  heading: string;
  content: Array<{ paragraph: string }>;
}
export interface SanityAboutPhilosophyValue {
  title: string;
  description: string;
}

export interface SanityAboutPhilosophySection {
  eyebrow?: string;
  heading: string;
  backgroundColor?: string;
  values?: SanityAboutPhilosophyValue[];
}
export interface SanityAboutPhilosophyValue {
  title: string;
  description: string;
}

export interface SanityAboutPhilosophySection {
  eyebrow?: string;
  heading: string;
  backgroundColor?: string;
  values?: SanityAboutPhilosophyValue[];
}

export interface SanityAboutCtaSection {
  eyebrow?: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  images?: SanityImageSource[];
}

export interface SanityAboutClosingSection {
  quote: string;
  subtext?: string;
}

export interface SanityAboutPage {
  _id: string;
  _type: "aboutPage";
  hero: {
    backgroundImage: SanityImageSource;
    subtitle?: string;
    title: string;
    description: string;
  };
  storySection?: SanityAboutStorySection;
  philosophySection?: SanityAboutPhilosophySection;
  ctaSection?: SanityAboutCtaSection;
  closingSection?: SanityAboutClosingSection;
  sections?: SanityAboutSection[];
}
