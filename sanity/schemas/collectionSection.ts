import { defineField, defineType } from "sanity";
import { SubcategorySelectInput } from "../components/SubcategorySelectInput";

export default defineType({
  name: "collectionSection",
  title: "Collection Section",
  type: "document",
  description: "Featured collection section on the homepage",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Phone Sling Handbags",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      initialValue:
        "Luxury sling bags adorned with lustrous pearls, where functionality meets artistry",
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      initialValue: "VIEW COLLECTION",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "buttonLink",
      title: "Button Link",
      type: "string",
      description: "URL path (e.g., /shop?category=handbags)",
      initialValue: "/shop?category=handbags",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subcategory",
      title: "Subcategory",
      type: "string",
      description: "Optional subcategory to pre-select on the shop page",
      components: { input: SubcategorySelectInput },
    }),
    defineField({
      name: "image",
      title: "Collection Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imagePosition",
      title: "Image Position",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),
    defineField({
      name: "isActive",
      title: "Show on Homepage",
      type: "boolean",
      initialValue: true,
      description: "Toggle to show or hide this section on the homepage",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "image",
    },
  },
});
