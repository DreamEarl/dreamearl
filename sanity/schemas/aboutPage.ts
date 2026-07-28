import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({
          name: "backgroundImage",
          title: "Background Image",
          type: "image",
          options: {
            hotspot: true,
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "string",
          initialValue: "Handmade Luxury Accessories",
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Our Story",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "storySection",
      title: "Story Section (Image + Text)",
      type: "object",
      description: "Section with image and detailed story content",
      fields: [
        defineField({
          name: "image",
          title: "Section Image",
          type: "image",
          options: {
            hotspot: true,
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "eyebrow",
          title: "Eyebrow Text",
          type: "string",
          description: "Small text above the heading (e.g., 'The Beginning')",
        }),
        defineField({
          name: "heading",
          title: "Section Heading",
          type: "text",
          rows: 2,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "content",
          title: "Section Content",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "paragraph",
                  title: "Paragraph",
                  type: "text",
                  rows: 4,
                }),
              ],
              preview: {
                select: {
                  title: "paragraph",
                },
              },
            },
          ],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "philosophySection",
      title: "Philosophy Section",
      type: "object",
      description: "Section with philosophy heading and value cards",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow Text",
          type: "string",
          description: "Small text above the heading (e.g., 'Our Philosophy')",
        }),
        defineField({
          name: "heading",
          title: "Main Heading",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "values",
          title: "Value Cards",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Card Title",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "description",
                  title: "Card Description",
                  type: "text",
                  rows: 3,
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: {
                select: {
                  title: "title",
                  subtitle: "description",
                },
              },
            },
          ],
          validation: (Rule) => Rule.max(3),
        }),
      ],
    }),
    defineField({
      name: "ctaSection",
      title: "CTA Section (Text + Images)",
      type: "object",
      description:
        "Section with call-to-action, text content, and product images",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow Text",
          type: "string",
          description: "Small text above the heading",
        }),
        defineField({
          name: "heading",
          title: "Main Heading",
          type: "text",
          rows: 2,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 4,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "buttonText",
          title: "Button Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "buttonLink",
          title: "Button Link",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "images",
          title: "Product Images",
          type: "array",
          of: [
            {
              type: "image",
              options: {
                hotspot: true,
              },
            },
          ],
          validation: (Rule) => Rule.max(2),
        }),
      ],
    }),
    defineField({
      name: "closingSection",
      title: "Closing Quote Section",
      type: "object",
      description: "Final quote section at the end of the page",
      fields: [
        defineField({
          name: "quote",
          title: "Quote Text",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "subtext",
          title: "Subtext",
          type: "string",
          description: "Text below the quote",
        }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Content Sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Section Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "content",
              title: "Section Content",
              type: "text",
              rows: 5,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "content",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "hero.title",
      subtitle: "hero.subtitle",
      media: "hero.backgroundImage",
    },
  },
});
