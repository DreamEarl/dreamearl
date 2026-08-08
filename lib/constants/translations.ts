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
    emptyMessage: "YOUR CART IS CURRENTLY EMPTY",
    returnToShop: "RETURN TO SHOP",
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
        title: "Storage",
        eyebrow: "01",
        content:
          "Store your DreamEarl piece in the dust bag provided or in a cool, dry place away from direct sunlight. Keep it away from other jewellery to avoid scratching or tangling. For handbags and totes, stuff them lightly with tissue paper to help maintain their shape.",
      },
      {
        title: "Cleaning",
        eyebrow: "02",
        content:
          "Wipe your piece gently with a soft, dry cloth after each use to remove any dust or oils. Avoid using chemical cleaners, alcohol, or harsh detergents. For a deeper clean, use a slightly damp soft cloth and let it air dry completely before storing.",
      },
      {
        title: "Handling",
        eyebrow: "03",
        content:
          "Apply perfume, hairspray, and lotions before putting on your piece — chemicals can dull the lustre of pearls over time. Avoid exposing your piece to extreme heat or water. Remove it before swimming, bathing, or exercising.",
      },
      {
        title: "Pearl Care",
        eyebrow: "04",
        content:
          "Pearls are organic gems that need special attention. They are sensitive to acids, so avoid contact with vinegar, lemon juice, or sweat. Restring knotted pearl pieces periodically to prevent breakage. The more you wear your pearls, the more they radiate — they thrive on your body's natural warmth.",
      },
    ],
  },
};

export type Translations = typeof translations;
