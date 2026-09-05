import { getSiteContent } from "@/lib/sanity/queries";

function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<Record<string, unknown>>,
): T {
  const result = { ...target };
  for (const key in source) {
    const val = source[key];
    if (val !== null && val !== undefined) {
      const targetVal = result[key as keyof T];
      if (
        typeof val === "object" &&
        !Array.isArray(val) &&
        typeof targetVal === "object" &&
        targetVal !== null &&
        !Array.isArray(targetVal)
      ) {
        result[key as keyof T] = deepMerge(
          targetVal as Record<string, unknown>,
          val as Record<string, unknown>,
        ) as T[keyof T];
      } else {
        result[key as keyof T] = val as T[keyof T];
      }
    }
  }
  return result;
}

export async function getTranslations(): Promise<Translations> {
  try {
    const content = await getSiteContent();
    if (!content) return translations;
    const { _id, _type, ...fields } = content;
    return deepMerge(
      translations as unknown as Record<string, unknown>,
      fields as Partial<Record<string, unknown>>,
    ) as unknown as Translations;
  } catch {
    return translations;
  }
}

export const translations = {
  common: {
    brand: "DREAMEARL",
    currency: "Rs.",
  },
  navigation: {
    home: "Home",
    shop: "Shop",
    about: "About",
    contact: "Contact",
    cart: "Cart",
  },
  hero: {
    tagline: "Handcrafted Luxury in Every Pearl",
    exploreCollection: "EXPLORE COLLECTION",
    ourStory: "OUR STORY",
  },
  brandDescription: {
    line1: "Pearl statement accessories by DreamEarl",
    line2:
      "For the women who writes her own story, and wears it boldly everyday",
  },
  shopByCategory: {
    title: "SHOP BY CATEGORY",
  },
  featuredProducts: {
    title: "HANDBAGS",
    shopAll: "VIEW ALL",
  },
  customization: {
    heading: "Customize Your Piece",
    subtitle: "Have a vision for your perfect pearl accessory?",
    buttonText: "MAKE CUSTOM ORDER",
  },
  product: {
    addToCart: "ADD TO CART",
    addedToCart: "ADDED TO CART",
    buyNow: "BUY IT NOW",
    share: "Share",
    linkCopied: "Link Copied!",
    labels: {
      product: "Product:",
      craftTechnique: "Craft Technique:",
      pearlType: "Pearl Type:",
      pearlColour: "Pearl Colour:",
      size: "Size:",
      note: "Note:",
    },
  },
  productSections: {
    careInstructions: {
      title: "CARE INSTRUCTIONS",
      icon: "♡",
    },
    shippingInformation: {
      title: "SHIPPING INFORMATION",
      icon: "📦",
    },
    packagingInformation: {
      title: "PACKAGING INFORMATION",
      icon: "📋",
    },
  },
  shop: {
    title: "HANDBAGS",
  },
  cart: {
    hero: {
      title: "YOUR CART",
      subtitle:
        "You are one step closer to owning a piece of handcrafted elegance.",
      backgroundImage: "/images/hero/background.jpeg",
    },
    emptyMessage: "YOUR CART IS CURRENTLY EMPTY",
    returnToShop: "RETURN TO SHOP",
    miniCart: {
      continueShopping: "CONTINUE SHOPPING",
      checkoutCart: "CHECKOUT CART",
    },
    columns: {
      product: "PRODUCT",
      price: "PRICE",
      quantity: "QUANTITY",
      total: "TOTAL",
    },
    summary: {
      title: "CART SUMMARY",
      subtotal: "Subtotal",
      shipping: "Shipping",
      shippingValue: "Calculated at checkout",
      checkout: "PROCEED TO CHECKOUT",
    },
  },
  login: {
    title: "LOGIN",
    subtitle: "Sign in to access your account",
    continueWith: "Continue with",
    google: "Google",
    facebook: "Facebook",
    apple: "Apple",
    orDivider: "OR",
    guestCheckout: "Continue as Guest",
    returnToStore: "Return to Store",
    termsText:
      "By continuing, you agree to our Terms of Service and Privacy Policy",
    phone: {
      label: "Mobile Number",
      placeholder: "+91 98765 43210",
      sendOtp: "Send OTP",
      sending: "Sending...",
      otpLabel: "Enter OTP",
      otpPlaceholder: "6-digit code",
      verify: "Verify & Sign In",
      verifying: "Verifying...",
      changeNumber: "Change number",
      otpSent: "OTP sent to",
      invalidPhone:
        "Enter a valid phone number with country code (e.g. +91...)",
      invalidOtp: "Enter the 6-digit OTP",
    },
    errors: {
      google: "Google sign-in failed. Please try again.",
      otpSend: "Failed to send OTP. Please try again.",
      otpVerify: "Invalid OTP. Please try again.",
    },
  },
  footer: {
    contactUs: {
      title: "CONTACT US",
      text: "For all customer queries, please contact us here or send an email to",
      email: "mydreamearl.shop@gmail.com",
      responseTime:
        "We'll respond to all customer queries within 24 hours Monday to Friday",
    },
    explore: {
      title: "EXPLORE",
      links: {
        aboutUs: "About us",
        customization: "Customization",
        jewelleryCare: "Jewellery Care",
        blogs: "Blogs",
      },
    },
    support: {
      title: "SUPPORT",
      links: {
        shippingPolicy: "Shipping Policy",
        termsConditions: "Terms & Conditions",
        privacyPolicy: "Privacy Policy",
        returnsAndRefund: "Returns & Refund",
      },
    },
    copyright: "2026, DREAMEARL. All rights reserved",
  },
  customOrder: {
    heading: "Customize Your Piece",
    subtitle:
      "Have a vision for your perfect pearl accessory? Share your inspiration with us, and our master artisans will bring your dream to life.",
    form: {
      inspirationImage: "Inspiration Image",
      dropzone: "Drop your image here, or click to browse",
      dropzoneHint: "PNG, JPG up to 10MB",
      fullName: "Full Name",
      fullNamePlaceholder: "Your name",
      email: "Email Address",
      emailPlaceholder: "your@email.com",
      phone: "Phone Number",
      phonePlaceholder: "+91 1234567890",
      productType: "Product Type",
      productTypePlaceholder: "Select a type",
      requirements: "Custom Requirements",
      requirementsPlaceholder:
        "Describe your vision, preferred colors, size, materials, and any special details you'd like to include...",
      submit: "Submit Custom Order",
      submitNote:
        "Our team will review your request and contact you within 24-48 hours with a quote and timeline.",
    },
  },
  about: {
    hero: {
      backgroundImage: "/images/hero/background.jpeg",
      subtitle: "Handmade Luxury Accessories",
      title: "Our Story",
      description:
        "DreamEarl was born from a love for elegance that feels personal, timeless, and unforgettable.",
    },
  },
  jewelleryCare: {
    hero: {
      title: "Care for Your DreamEarl Piece",
      backgroundImage: "/images/hero/background.jpeg",
    },
    intro:
      "At DreamEarl, every piece is handcrafted with patience, precision, and countless woven details. With a little extra care, your DreamEarl creation will continue to look beautiful for years to come. Treat it gently, store it thoughtfully, and let it accompany you through many memorable moments.",
    sections: [
      {
        title: "Last To Put On, First To Take Off",
        content:
          "Your DreamEarl piece should be the finishing touch to your look. Put on your pearls at the end of your routine and take them off first thing while unwinding. Be very careful with chemical substances as they can erode your pearl's surface.",
      },
      {
        title: "No Sweat",
        content:
          "While made to be enjoyed, DreamEarl pieces are best kept away from excessive moisture and perspiration. Remove your bag before activities involving heavy sweat or prolonged exposure to rain to help preserve its beauty. Gently wipe your product off with a soft cloth once you take them off, to remove sweat, excess oils or dirt.",
      },
      {
        title: "Stay Away From Chemicals",
        content:
          "Avoid direct contact with perfumes, lotions, hairsprays, sanitizers, makeup, and other beauty products. These can gradually affect the finish and shine of pearls, crystals, and metal hardware.",
      },
      {
        title: "Swaddle In Softness",
        content:
          "When not in use, store your DreamEarl piece in its dust bag or a soft fabric pouch. Keep it away from rough surfaces and avoid stacking heavy objects on top to protect the woven structure and pearl finish from scratches.",
      },
      {
        title: "Handle With Care",
        content:
          "Every DreamEarl bag is individually handwoven, making each piece beautifully unique. Although the weaving is carefully crafted for everyday use, avoid pulling, twisting, or placing excessive weight on the bag to help maintain its shape and craftsmanship.",
      },
      {
        title: "Thread With Care",
        content:
          "Every bead is woven together using premium-quality thread selected for strength and durability. Like all handcrafted woven creations, continuous strain or excessive weight may gradually loosen the weaving over time.",
      },
    ],
    metalCare: {
      title: "Metal Care",
      intro:
        "The metal rings, chains, clasps, magnets, and other hardware on your DreamEarl piece are carefully chosen to complement its elegant design.",
      subheading: "To keep them looking their best:",
      bullets: [
        "Avoid prolonged contact with water, humidity, and harsh chemicals.",
        "Wipe gently with a soft, dry microfiber cloth after use.",
        "Store your piece in a dry place to help preserve its finish.",
        "Avoid dropping or knocking the hardware against hard surfaces to minimize scratches.",
      ],
    },
    closingNote: {
      title: "A Note from DreamEarl",
      body: "Every DreamEarl piece is lovingly handcrafted\u2014not mass produced. Slight variations are a reflection of the artisan\u2019s touch and make each creation uniquely yours. With thoughtful care, your DreamEarl piece is made to be treasured, carried, and admired for years to come.",
      tagline: "Crafted by hand. Carried with love. Treasured for years.",
    },
  },
};

export type Translations = typeof translations;
