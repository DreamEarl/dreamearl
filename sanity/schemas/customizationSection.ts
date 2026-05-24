import { defineField, defineType } from "sanity";

export default defineType({
  name: "customizationSection",
  title: "Customization Section",
  type: "document",
  description: "Content for the 'Customize Your Piece' section on the homepage",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Customize Your Piece",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      initialValue: "Have a vision for your perfect pearl accessory?",
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      initialValue: "MAKE CUSTOM ORDER",
    }),
    defineField({
      name: "images",
      title: "Inspiration Images",
      type: "array",
      description: "Up to 5 inspiration images shown in a horizontal row",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(5),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "subtitle",
    },
  },
});
