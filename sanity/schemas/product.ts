import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "brand",
      title: "Brand",
      type: "string",
      initialValue: "DREAMEARL",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "Rs.",
      options: {
        list: [
          { title: "Rupees (Rs.)", value: "Rs." },
          { title: "USD ($)", value: "$" },
        ],
      },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "productType",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Handbag", value: "handbag" },
          { title: "Bracelet", value: "bracelet" },
          { title: "Necklace", value: "necklace" },
          { title: "Earrings", value: "earrings" },
        ],
      },
    }),
    defineField({
      name: "craftTechnique",
      title: "Craft Technique",
      type: "string",
      initialValue: "Handmade / Handwoven",
    }),
    defineField({
      name: "pearlType",
      title: "Pearl Type",
      type: "string",
      options: {
        list: [
          { title: "Manufactured", value: "manufactured" },
          { title: "Natural", value: "natural" },
          { title: "Cultured", value: "cultured" },
        ],
      },
    }),
    defineField({
      name: "pearlColour",
      title: "Pearl Colour",
      type: "string",
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      description: 'e.g., 7"W x 9"H',
    }),
    defineField({
      name: "note",
      title: "Product Note",
      type: "text",
      rows: 3,
      initialValue:
        "All our products are handcrafted, resulting in each piece being unique and slightly distinct in their own way. Hence, no two pieces can be exactly the same.",
    }),
    defineField({
      name: "careInstructions",
      title: "Care Instructions",
      type: "text",
      rows: 3,
      initialValue:
        "It is recommended to keep away from moisture, perfumes, chemicals and excessive heat. To be stored in an airtight bag/ziplock provided with the purchase.",
    }),
    defineField({
      name: "shippingInfo",
      title: "Shipping Information",
      type: "text",
      rows: 2,
      initialValue:
        "Free shipping for all orders above Rs. 3,000 in India. Delivered within 3-7 days.",
    }),
    defineField({
      name: "packagingInfo",
      title: "Packaging Information",
      type: "text",
      rows: 3,
      initialValue:
        'All our pieces are carefully gift-wrapped in our signature pink boxes, which have a soft-touch suede cushioning on both the sides. We also provide a "Care Tips" card with every piece.',
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "price",
      media: "images.0",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        ...selection,
        subtitle: `Rs. ${subtitle}`,
      };
    },
  },
});
