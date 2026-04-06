import { client } from "./client";
import { SanityProduct, SanityCategory, SanitySiteSettings } from "./types";

// Fetch all products
export async function getAllProducts(): Promise<SanityProduct[]> {
  return client.fetch(`
    *[_type == "product" && inStock == true] | order(_createdAt desc) {
      _id,
      _type,
      brand,
      name,
      slug,
      images,
      price,
      currency,
      category,
      description,
      productType,
      craftTechnique,
      pearlType,
      pearlColour,
      size,
      note,
      careInstructions,
      shippingInfo,
      packagingInfo,
      inStock,
      featured
    }
  `);
}

// Fetch products by category
export async function getProductsByCategory(
  categorySlug: string,
): Promise<SanityProduct[]> {
  return client.fetch(
    `
    *[_type == "product" && inStock == true && category->slug.current == $categorySlug] | order(_createdAt desc) {
      _id,
      _type,
      brand,
      name,
      slug,
      images,
      price,
      currency,
      category,
      description,
      inStock,
      featured
    }
  `,
    { categorySlug },
  );
}

// Fetch single product by slug
export async function getProductBySlug(
  slug: string,
): Promise<SanityProduct | null> {
  return client.fetch(
    `
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      _type,
      brand,
      name,
      slug,
      images,
      price,
      currency,
      category->{
        _id,
        name,
        slug
      },
      description,
      productType,
      craftTechnique,
      pearlType,
      pearlColour,
      size,
      note,
      careInstructions,
      shippingInfo,
      packagingInfo,
      inStock,
      featured
    }
  `,
    { slug },
  );
}

// Fetch all categories
export async function getAllCategories(): Promise<SanityCategory[]> {
  return client.fetch(`
    *[_type == "category"] | order(displayOrder asc) {
      _id,
      _type,
      name,
      slug,
      image,
      description,
      displayOrder
    }
  `);
}

// Fetch site settings
export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return client.fetch(`
    *[_type == "siteSettings"][0] {
      _id,
      _type,
      brand,
      tagline,
      description,
      contactEmail,
      phone,
      whatsappNumber,
      address,
      socialLinks,
      aboutPage
    }
  `);
}

// Fetch featured products
export async function getFeaturedProducts(): Promise<SanityProduct[]> {
  return client.fetch(`
    *[_type == "product" && featured == true && inStock == true] | order(_createdAt desc) [0...4] {
      _id,
      _type,
      brand,
      name,
      slug,
      images,
      price,
      currency,
      category,
      description,
      inStock,
      featured
    }
  `);
}
