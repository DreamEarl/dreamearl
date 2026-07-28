# Product Subcategory Filtering Guide

## Overview

The shop page allows filtering products by subcategories (e.g., "Phone Sling Bags", "Hand Bags"). This guide explains how the system works and how to set it up correctly.

## How It Works

1. **Categories** have **Subcategories** (defined in the Category document)
2. **Products** have a **Product Type** field that references a subcategory slug
3. When users click a subcategory filter on the shop page, products are filtered by matching their `productType` to the selected subcategory slug

## Setting Up Subcategories

### Step 1: Add Subcategories to a Category

1. Open **Sanity Studio**
2. Go to **Categories**
3. Select or create a category (e.g., "Bags")
4. Scroll to the **Subcategories** section
5. Click **Add item** for each subcategory:
   - **Label**: Display name (e.g., "Phone Sling Bags")
   - **Slug**: URL-friendly identifier (e.g., "phone-sling-bags")
   - **Image**: Upload a representative image
   - **Display Order**: Controls the order (0 = first, 1 = second, etc.)
6. **Publish** the category

### Step 2: Assign Products to Subcategories

1. Open or create a **Product**
2. Select the **Category** (e.g., "Bags")
3. In the **Product Type / Subcategory** field:
   - A dropdown will appear showing available subcategories from the selected category
   - Select the appropriate subcategory (e.g., "phone-sling-bags")
   - OR enter a custom value if needed
4. **Publish** the product

## Important Notes

### ⚠️ Matching Slugs

The `productType` value on the product **MUST match** the subcategory slug exactly:

- ✅ **Correct**: Product Type = "phone-sling-bags", Subcategory Slug = "phone-sling-bags"
- ❌ **Wrong**: Product Type = "Phone Sling Bags", Subcategory Slug = "phone-sling-bags"

### 🎯 Best Practices

1. **Always select a category first** before setting the product type
2. **Use the dropdown** to select from available subcategories (prevents typos)
3. **Use lowercase slugs** with hyphens (e.g., "hand-bags", not "Hand Bags" or "hand_bags")
4. **Keep subcategory slugs short** and descriptive

### 🔍 Troubleshooting

**Problem**: Products aren't appearing when I click a subcategory filter

**Solutions**:

1. Check that the product's `productType` field exactly matches the subcategory slug
2. Verify the product's category matches the category containing the subcategory
3. Ensure the product is marked as "In Stock"
4. Check that the subcategory is published in the category

**Problem**: I don't see subcategory options in the dropdown

**Solutions**:

1. Make sure you've selected a category for the product first
2. Verify that the category has subcategories defined
3. Check that the subcategories are published

## Example Setup

### Category: Bags

- Name: "Bags"
- Slug: "bags"
- Subcategories:
  1. Label: "Phone Sling Bags", Slug: "phone-sling-bags", Order: 0
  2. Label: "Hand Bags", Slug: "hand-bags", Order: 1
  3. Label: "Crossbody Bags", Slug: "crossbody-bags", Order: 2

### Product: Pearl Phone Sling Bag

- Name: "Pearl Phone Sling Bag"
- Category: Reference to "Bags" category
- Product Type: "phone-sling-bags" ← Must match subcategory slug!
- In Stock: true

## Frontend Display

When everything is set up correctly:

1. Visiting `/shop?category=bags` shows all bags
2. The page displays subcategory filter buttons with images
3. Clicking "Phone Sling Bags" filters to show only products where `productType = "phone-sling-bags"`
4. The URL updates to `/shop?category=bags&type=phone-sling-bags`

## Technical Details

- **Frontend**: `/app/shop/page.tsx`
- **Category Schema**: `/sanity/schemas/category.ts`
- **Product Schema**: `/sanity/schemas/product.ts`
- **Custom Input Component**: `/sanity/components/ProductTypeInput.tsx`
- **Filter Component**: `/components/products/SubCategorySelector.tsx`
