export interface SubCategory {
  label: string;
  /** Used as ?type= URL param to filter by productType */
  slug: string;
  /** Image URL from Sanity CDN or path relative to /public */
  image?: string;
}

/** Admin WhatsApp number in E.164 format without '+' for wa.me links */
export const ADMIN_WHATSAPP_NUMBER = "918830587508";

/**
 * SUBCATEGORIES CONFIGURATION
 *
 * Subcategories are now managed in Sanity CMS under each Category document.
 * To add/edit subcategories:
 * 1. Go to Sanity Studio
 * 2. Edit the Category (e.g., "Bags")
 * 3. Add subcategories with label, slug, and image
 *
 * The shop page will automatically fetch and display them.
 *
 * This interface is kept for type safety in components.
 */
