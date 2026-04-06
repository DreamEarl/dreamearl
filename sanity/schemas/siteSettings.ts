import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "brand",
      title: "Brand Name",
      type: "string",
      initialValue: "DREAMEARL",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
      rows: 3,
      description: "Used for SEO meta description",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Business Number",
      type: "string",
      description: "Format: 919876543210 (country code + number, no spaces)",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "object",
      fields: [
        defineField({
          name: "instagram",
          title: "Instagram",
          type: "url",
        }),
        defineField({
          name: "facebook",
          title: "Facebook",
          type: "url",
        }),
        defineField({
          name: "pinterest",
          title: "Pinterest",
          type: "url",
        }),
        defineField({
          name: "twitter",
          title: "Twitter/X",
          type: "url",
        }),
      ],
    }),
    defineField({
      name: "aboutPage",
      title: "About Page Content",
      type: "array",
      of: [{ type: "block" }],
      description: "Rich text content for the About page",
    }),
  ],
  preview: {
    select: {
      title: "brand",
      subtitle: "tagline",
    },
  },
});
