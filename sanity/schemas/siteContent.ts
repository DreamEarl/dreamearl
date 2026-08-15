import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteContent",
  title: "Site Content",
  type: "document",
  groups: [
    { name: "home", title: "Home Page" },
    { name: "pages", title: "Pages" },
    { name: "layout", title: "Layout" },
    { name: "jewelleryCare", title: "Jewellery Care" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      group: "home",
      fields: [
        defineField({ name: "tagline", title: "Tagline", type: "string" }),
        defineField({
          name: "exploreCollection",
          title: "Explore Collection Button",
          type: "string",
        }),
        defineField({
          name: "ourStory",
          title: "Our Story Button",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "brandDescription",
      title: "Brand Description",
      type: "object",
      group: "home",
      fields: [
        defineField({ name: "line1", title: "Line 1", type: "string" }),
        defineField({ name: "line2", title: "Line 2", type: "string" }),
      ],
    }),
    defineField({
      name: "shopByCategory",
      title: "Shop By Category",
      type: "object",
      group: "home",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
      ],
    }),
    defineField({
      name: "featuredProducts",
      title: "Featured Products",
      type: "object",
      group: "home",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({
          name: "shopAll",
          title: "View All Button Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "customization",
      title: "Customization Section",
      type: "object",
      group: "home",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
        defineField({
          name: "buttonText",
          title: "Button Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "cart",
      title: "Cart Page",
      type: "object",
      group: "pages",
      fields: [
        defineField({
          name: "hero",
          title: "Hero",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "subtitle",
              title: "Subtitle",
              type: "string",
            }),
            defineField({
              name: "backgroundImage",
              title: "Background Image",
              type: "image",
              options: { hotspot: true },
            }),
          ],
        }),
        defineField({
          name: "emptyMessage",
          title: "Empty Cart Message",
          type: "string",
        }),
        defineField({
          name: "returnToShop",
          title: "Return to Shop Button",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "shop",
      title: "Shop Page",
      type: "object",
      group: "pages",
      fields: [
        defineField({ name: "title", title: "Page Title", type: "string" }),
      ],
    }),
    defineField({
      name: "customOrder",
      title: "Custom Order Page",
      type: "object",
      group: "pages",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "text",
          rows: 3,
        }),
      ],
    }),
    defineField({
      name: "about",
      title: "About Page",
      type: "object",
      group: "pages",
      fields: [
        defineField({
          name: "hero",
          title: "Hero",
          type: "object",
          fields: [
            defineField({
              name: "subtitle",
              title: "Subtitle",
              type: "string",
            }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      group: "layout",
      fields: [
        defineField({
          name: "contactUs",
          title: "Contact Us Section",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "text",
              title: "Description Text",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "email",
              title: "Contact Email",
              type: "string",
            }),
            defineField({
              name: "responseTime",
              title: "Response Time Note",
              type: "string",
            }),
          ],
        }),
        defineField({
          name: "copyright",
          title: "Copyright Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "jewelleryCare",
      title: "Jewellery Care Page",
      type: "object",
      group: "jewelleryCare",
      fields: [
        defineField({
          name: "hero",
          title: "Hero",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
          ],
        }),
        defineField({
          name: "intro",
          title: "Introduction",
          type: "text",
          rows: 4,
        }),
        defineField({
          name: "sections",
          title: "Care Sections",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({
                  name: "content",
                  title: "Content",
                  type: "text",
                  rows: 3,
                }),
              ],
              preview: {
                select: { title: "title" },
              },
            },
          ],
        }),
        defineField({
          name: "metalCare",
          title: "Metal Care",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "intro",
              title: "Introduction",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "subheading",
              title: "Subheading",
              type: "string",
            }),
            defineField({
              name: "bullets",
              title: "Bullet Points",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
        }),
        defineField({
          name: "closingNote",
          title: "Closing Note",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "body",
              title: "Body",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "tagline",
              title: "Tagline",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Content" };
    },
  },
});
