import { defineField, defineType } from "sanity";

// Shared field set for all legal/policy pages so content stays configurable in Sanity
const legalPageFields = [
  defineField({
    name: "title",
    title: "Page Title",
    type: "string",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "intro",
    title: "Intro / Disclaimer",
    type: "text",
    rows: 4,
    description: "Italic disclaimer paragraph shown below the title",
  }),
  defineField({
    name: "sections",
    title: "Sections",
    type: "array",
    of: [
      {
        type: "object",
        name: "legalSection",
        fields: [
          defineField({
            name: "heading",
            title: "Section Heading",
            type: "string",
          }),
          defineField({
            name: "paragraphs",
            title: "Paragraphs",
            type: "array",
            of: [{ type: "text", rows: 3 }],
          }),
        ],
        preview: {
          select: { title: "heading" },
        },
      },
    ],
  }),
];

export const shippingPolicy = defineType({
  name: "shippingPolicy",
  title: "Shipping Policy",
  type: "document",
  fields: legalPageFields,
  initialValue: {
    title: "Shipping Policy",
    intro:
      "PLEASE READ THIS SHIPPING POLICY CAREFULLY. IT EXPLAINS HOW WE PROCESS, PACKAGE, AND DELIVER YOUR ORDER. THIS IS PLACEHOLDER CONTENT — REPLACE WITH FINAL COPY.",
    sections: [
      {
        heading: "PROCESSING TIME",
        paragraphs: [
          "Placeholder: Orders are processed within X business days. Custom and made-to-order pieces may require additional time before shipping.",
        ],
      },
      {
        heading: "SHIPPING RATES & DELIVERY",
        paragraphs: [
          "Placeholder: Shipping rates are calculated at checkout based on your location and delivery method. Estimated delivery times vary by region.",
        ],
      },
      {
        heading: "TRACKING YOUR ORDER",
        paragraphs: [
          "Placeholder: Once your order ships, you will receive a confirmation email with tracking details.",
        ],
      },
    ],
  },
});

export const termsConditions = defineType({
  name: "termsConditions",
  title: "Terms & Conditions",
  type: "document",
  fields: legalPageFields,
  initialValue: {
    title: "Terms of Service",
    intro:
      "PLEASE READ THESE TERMS AND CONDITIONS OF USE AGREEMENT (“AGREEMENT”) CAREFULLY. BY ACCESSING OR UTILIZING THE SERVICES THROUGH THE WEBSITE, YOU CONSENT TO BE BOUND BY THE TERMS AND CONDITIONS OF THIS AGREEMENT AND PRIVACY POLICY. IF YOU DO NOT WISH TO BE BOUND BY THIS AGREEMENT, KINDLY DO NOT ACCESS/USE THE WEBSITE.",
    sections: [
      {
        heading: "OVERVIEW",
        paragraphs: [
          "The Website is owned and operated by Dreamearl. Throughout the site, the terms “we,” “us” and “our” refer to Dreamearl. Dreamearl offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.",
          "By visiting our site and/or purchasing something from us, you engage in our “Service” and agree to be bound by these Terms of Service, including any additional terms, conditions and policies referenced herein and/or available by hyperlink.",
          "These Terms of Service apply to all users of the site, including without limitation users who are browsers, customers, merchants and/or contributors of content.",
          "Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use our services.",
          "Any new features or tools which are added to the current store shall also be subject to these Terms of Service. You can review the most current version of the Terms of Service at any time on this page.",
          "We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.",
        ],
      },
      {
        heading: "PLACEHOLDER SECTION",
        paragraphs: [
          "Placeholder: Add further sections such as Online Store Terms, Products & Services, Accuracy of Information, Third-Party Links, and Governing Law here. Replace this section with final copy.",
        ],
      },
    ],
  },
});

export const returnsAndRefund = defineType({
  name: "returnsAndRefund",
  title: "Returns & Refund",
  type: "document",
  fields: legalPageFields,
  initialValue: {
    title: "Returns & Refund Policy",
    intro:
      "PLEASE READ THIS RETURNS AND REFUND POLICY CAREFULLY BEFORE PLACING AN ORDER. THIS IS PLACEHOLDER CONTENT — REPLACE WITH FINAL COPY.",
    sections: [
      {
        heading: "ELIGIBILITY FOR RETURNS",
        paragraphs: [
          "Placeholder: Items may be returned within X days of delivery, provided they are unused, in original packaging, and accompanied by proof of purchase.",
        ],
      },
      {
        heading: "REFUNDS",
        paragraphs: [
          "Placeholder: Approved refunds will be processed to the original payment method within X business days.",
        ],
      },
      {
        heading: "NON-RETURNABLE ITEMS",
        paragraphs: [
          "Placeholder: Custom or made-to-order pieces are final sale and not eligible for return or exchange.",
        ],
      },
    ],
  },
});

export const privacyPolicy = defineType({
  name: "privacyPolicy",
  title: "Privacy Policy",
  type: "document",
  fields: legalPageFields,
  initialValue: {
    title: "Privacy Policy",
    intro:
      "THIS PRIVACY POLICY DESCRIBES HOW WE COLLECT, USE, AND PROTECT YOUR PERSONAL INFORMATION. THIS IS PLACEHOLDER CONTENT — REPLACE WITH FINAL COPY.",
    sections: [
      {
        heading: "INFORMATION WE COLLECT",
        paragraphs: [
          "Placeholder: We collect information such as your name, email, address, and payment details when you place an order or contact us.",
        ],
      },
      {
        heading: "HOW WE USE YOUR INFORMATION",
        paragraphs: [
          "Placeholder: Your information is used to process orders, provide customer support, and improve our services.",
        ],
      },
      {
        heading: "DATA SECURITY",
        paragraphs: [
          "Placeholder: We implement reasonable measures to protect your personal information from unauthorized access.",
        ],
      },
    ],
  },
});
