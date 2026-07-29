import { client } from "./client";
import {
  SanityProduct,
  SanityCategory,
  SanitySiteSettings,
  CustomizationImage,
  SanityCollectionSection,
  SanityAboutPage,
} from "./types";

// Fetch all products
export async function getAllProducts(): Promise<SanityProduct[]> {
  return client.fetch(`
    *[_type == "product" && inStock == true] | order(displayOrder asc, _createdAt desc) {
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
      featured,
      displayOrder
    }
  `);
}

// Fetch products by category
export async function getProductsByCategory(
  categorySlug: string,
): Promise<SanityProduct[]> {
  return client.fetch(
    `
    *[_type == "product" && inStock == true && category->slug.current == $categorySlug] | order(displayOrder asc, _createdAt desc) {
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
      productTypes,
      craftTechnique,
      pearlType,
      pearlColour,
      size,
      inStock,
      featured,
      displayOrder
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
      productTypes,
      craftTechnique,
      pearlType,
      pearlColour,
      size,
      note,
      careInstructions,
      shippingInfo,
      packagingInfo,
      inStock,
      featured,
      displayOrder
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

// Fetch category by slug with subcategories
export async function getCategoryBySlug(
  categorySlug: string,
): Promise<SanityCategory | null> {
  return client.fetch(
    `
    *[_type == "category" && slug.current == $categorySlug][0] {
      _id,
      _type,
      name,
      slug,
      image,
      description,
      displayOrder,
      subcategories[] | order(displayOrder asc) {
        label,
        slug,
        image,
        displayOrder
      }
    }
  `,
    { categorySlug },
  );
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
    *[_type == "product" && featured == true && inStock == true] | order(displayOrder asc, _createdAt desc) [0...4] {
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
      featured,
      displayOrder
    }
  `);
}

// Fetch featured products by category
export async function getFeaturedProductsByCategory(
  categorySlug: string,
  limit: number = 3,
): Promise<SanityProduct[]> {
  return client.fetch(
    `
    *[_type == "product" && inStock == true && category->slug.current == $categorySlug] | order(displayOrder asc, _createdAt desc) [0...$limit] {
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
      featured,
      displayOrder
    }
  `,
    { categorySlug, limit },
  );
}

// Fetch customization section data
export async function getCustomizationSection(): Promise<{
  heading?: string;
  subtitle?: string;
  buttonText?: string;
  images?: CustomizationImage[];
} | null> {
  return client.fetch(`
    *[_type == "customizationSection"][0] {
      heading,
      subtitle,
      buttonText,
      images
    }
  `);
}

// Fetch collection section data
export async function getCollectionSection(): Promise<SanityCollectionSection | null> {
  return client.fetch(`
    *[_type == "collectionSection" && isActive == true][0] {
      _id,
      _type,
      title,
      description,
      buttonText,
      buttonLink,
      subcategory,
      image,
      imagePosition,
      isActive
    }
  `);
}

// Fetch about page data
export async function getAboutPage(): Promise<SanityAboutPage | null> {
  return client.fetch(`
    *[_type == "aboutPage"][0] {
      _id,
      _type,
      hero {
        backgroundImage {
          asset-> {
            _id,
            url
          },
          hotspot,
          crop
        },
        subtitle,
        title,
        description
      },
      storySection {
        image {
          asset-> {
            _id,
            url
          },
          hotspot,
          crop
        },
        eyebrow,
        heading,
        content
      },
      philosophySection {
        eyebrow,
        heading,
        values[] {
          title,
          description
        }
      },
      ctaSection {
        eyebrow,
        heading,
        description,
        buttonText,
        buttonLink,
        images[] {
          asset-> {
            _id,
            url
          },
          hotspot,
          crop
        }
      },
      closingSection {
        quote,
        subtext
      },
      sections[] {
        title,
        content
      }
    }
  `);
}
