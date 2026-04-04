import { translations } from "@/lib/constants/translations";

describe("Translations", () => {
  describe("Structure", () => {
    it("has all main sections", () => {
      expect(translations).toHaveProperty("common");
      expect(translations).toHaveProperty("navigation");
      expect(translations).toHaveProperty("hero");
      expect(translations).toHaveProperty("brandDescription");
      expect(translations).toHaveProperty("shopByCategory");
      expect(translations).toHaveProperty("product");
      expect(translations).toHaveProperty("productSections");
      expect(translations).toHaveProperty("shop");
      expect(translations).toHaveProperty("cart");
      expect(translations).toHaveProperty("login");
      expect(translations).toHaveProperty("footer");
    });
  });

  describe("Common Translations", () => {
    it("has brand name", () => {
      expect(translations.common.brand).toBe("DREAMEARL");
    });

    it("has currency", () => {
      expect(translations.common.currency).toBe("Rs.");
    });
  });

  describe("Navigation Translations", () => {
    it("has all navigation items", () => {
      expect(translations.navigation).toMatchObject({
        home: "Home",
        shop: "Shop",
        about: "About",
        contact: "Contact",
        cart: "Cart",
      });
    });
  });

  describe("Hero Translations", () => {
    it("has tagline", () => {
      expect(translations.hero.tagline).toBe(
        "Handcrafted Luxury in Every Pearl",
      );
    });
  });

  describe("Brand Description Translations", () => {
    it("has description lines", () => {
      expect(translations.brandDescription.line1).toBeTruthy();
      expect(translations.brandDescription.line2).toBeTruthy();
      expect(translations.brandDescription.line1).toContain("Pearl");
      expect(translations.brandDescription.line2).toContain("women");
    });
  });

  describe("Shop By Category Translations", () => {
    it("has title", () => {
      expect(translations.shopByCategory.title).toBe("SHOP BY CATEGORY");
    });
  });

  describe("Product Translations", () => {
    it("has action buttons", () => {
      expect(translations.product.addToCart).toBe("ADD TO CART");
      expect(translations.product.buyNow).toBe("BUY IT NOW");
      expect(translations.product.share).toBe("Share");
    });

    it("has all product labels", () => {
      expect(translations.product.labels).toMatchObject({
        product: "Product:",
        craftTechnique: "Craft Technique:",
        pearlType: "Pearl Type:",
        pearlColour: "Pearl Colour:",
        size: "Size:",
        note: "Note:",
      });
    });
  });

  describe("Product Sections Translations", () => {
    it("has care instructions section", () => {
      expect(translations.productSections.careInstructions.title).toBe(
        "CARE INSTRUCTIONS",
      );
      expect(translations.productSections.careInstructions.icon).toBe("♡");
    });

    it("has shipping information section", () => {
      expect(translations.productSections.shippingInformation.title).toBe(
        "SHIPPING INFORMATION",
      );
      expect(translations.productSections.shippingInformation.icon).toBe("📦");
    });

    it("has packaging information section", () => {
      expect(translations.productSections.packagingInformation.title).toBe(
        "PACKAGING INFORMATION",
      );
      expect(translations.productSections.packagingInformation.icon).toBe("📋");
    });
  });

  describe("Shop Translations", () => {
    it("has title", () => {
      expect(translations.shop.title).toBe("HANDBAGS");
    });
  });

  describe("Cart Translations", () => {
    it("has cart messages", () => {
      expect(translations.cart.emptyMessage).toBe(
        "YOUR CART IS CURRENTLY EMPTY",
      );
      expect(translations.cart.returnToShop).toBe("RETURN TO SHOP");
    });
  });

  describe("Login Translations", () => {
    it("has login content", () => {
      expect(translations.login.title).toBe("LOGIN");
      expect(translations.login.subtitle).toBeTruthy();
      expect(translations.login.continueWith).toBe("Continue with");
    });

    it("has social login options", () => {
      expect(translations.login.google).toBe("Google");
      expect(translations.login.facebook).toBe("Facebook");
      expect(translations.login.apple).toBe("Apple");
    });

    it("has other login options", () => {
      expect(translations.login.orDivider).toBe("OR");
      expect(translations.login.guestCheckout).toBe("Continue as Guest");
      expect(translations.login.returnToStore).toBe("Return to Store");
      expect(translations.login.termsText).toContain("Terms of Service");
      expect(translations.login.termsText).toContain("Privacy Policy");
    });
  });

  describe("Footer Translations", () => {
    it("has contact us section", () => {
      expect(translations.footer.contactUs.title).toBe("CONTACT US");
      expect(translations.footer.contactUs.email).toBe(
        "mydreamearl.shop@gmail.com",
      );
      expect(translations.footer.contactUs.text).toBeTruthy();
      expect(translations.footer.contactUs.responseTime).toContain("24 hours");
    });

    it("has explore section", () => {
      expect(translations.footer.explore.title).toBe("EXPLORE");
      expect(translations.footer.explore.links).toHaveProperty("aboutUs");
      expect(translations.footer.explore.links).toHaveProperty("customization");
      expect(translations.footer.explore.links).toHaveProperty("jewelleryCare");
      expect(translations.footer.explore.links).toHaveProperty("blogs");
    });

    it("has support section", () => {
      expect(translations.footer.support.title).toBe("SUPPORT");
      expect(translations.footer.support.links).toHaveProperty(
        "shippingPolicy",
      );
      expect(translations.footer.support.links).toHaveProperty(
        "termsConditions",
      );
      expect(translations.footer.support.links).toHaveProperty("privacyPolicy");
    });

    it("has copyright", () => {
      expect(translations.footer.copyright).toContain("2026");
      expect(translations.footer.copyright).toContain("DREAMEARL");
    });
  });

  describe("Type Safety", () => {
    it("all translations are strings", () => {
      const checkStrings = (obj: any, path = ""): void => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          if (typeof value === "object" && value !== null) {
            checkStrings(value, currentPath);
          } else {
            expect(typeof value).toBe("string");
          }
        });
      };

      checkStrings(translations);
    });
  });
});
