import { sampleProducts, getProductBySlug } from "@/lib/data/products";

describe("Products Data", () => {
  describe("Product Type", () => {
    it("all products have required fields", () => {
      sampleProducts.forEach((product) => {
        expect(product).toHaveProperty("id");
        expect(product).toHaveProperty("slug");
        expect(product).toHaveProperty("brand");
        expect(product).toHaveProperty("name");
        expect(product).toHaveProperty("price");
        expect(product).toHaveProperty("currency");
        expect(product).toHaveProperty("image");
        expect(product).toHaveProperty("category");
        expect(product).toHaveProperty("details");
        expect(product).toHaveProperty("note");
        expect(product).toHaveProperty("careInstructions");
        expect(product).toHaveProperty("shippingInfo");
        expect(product).toHaveProperty("packagingInfo");
      });
    });

    it("all products have valid details object", () => {
      sampleProducts.forEach((product) => {
        expect(product.details).toHaveProperty("product");
        expect(product.details).toHaveProperty("craftTechnique");
        expect(product.details).toHaveProperty("pearlType");
        expect(product.details).toHaveProperty("pearlColour");
        expect(product.details).toHaveProperty("size");
      });
    });
  });

  describe("Sample Products Array", () => {
    it("contains products", () => {
      expect(sampleProducts).toBeDefined();
      expect(Array.isArray(sampleProducts)).toBe(true);
      expect(sampleProducts.length).toBeGreaterThan(0);
    });

    it("contains expected products", () => {
      expect(sampleProducts.length).toBe(3);

      const slugs = sampleProducts.map((p) => p.slug);
      expect(slugs).toContain("ethereal-pearl");
      expect(slugs).toContain("silver-mini-muse");
      expect(slugs).toContain("lumi-perle");
    });

    it("all products have unique ids", () => {
      const ids = sampleProducts.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(sampleProducts.length);
    });

    it("all products have unique slugs", () => {
      const slugs = sampleProducts.map((p) => p.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(sampleProducts.length);
    });
  });

  describe("Product Data Validation", () => {
    it("all products have valid prices", () => {
      sampleProducts.forEach((product) => {
        expect(typeof product.price).toBe("number");
        expect(product.price).toBeGreaterThan(0);
      });
    });

    it("all products have non-empty strings", () => {
      sampleProducts.forEach((product) => {
        expect(product.id).toBeTruthy();
        expect(product.slug).toBeTruthy();
        expect(product.brand).toBeTruthy();
        expect(product.name).toBeTruthy();
        expect(product.currency).toBeTruthy();
        expect(product.image).toBeTruthy();
        expect(product.category).toBeTruthy();
      });
    });

    it("all products have DREAMEARL brand", () => {
      sampleProducts.forEach((product) => {
        expect(product.brand).toBe("DREAMEARL");
      });
    });

    it("all products use Rs. currency", () => {
      sampleProducts.forEach((product) => {
        expect(product.currency).toBe("Rs.");
      });
    });

    it("all products are in handbags category", () => {
      sampleProducts.forEach((product) => {
        expect(product.category).toBe("handbags");
      });
    });
  });

  describe("getProductBySlug()", () => {
    it("returns product when slug exists", () => {
      const product = getProductBySlug("ethereal-pearl");
      expect(product).toBeDefined();
      expect(product?.slug).toBe("ethereal-pearl");
      expect(product?.name).toBe("ETHEREAL PEARL");
    });

    it("returns correct product for each slug", () => {
      const ethereal = getProductBySlug("ethereal-pearl");
      expect(ethereal?.id).toBe("1");
      expect(ethereal?.price).toBe(4599);

      const silverMini = getProductBySlug("silver-mini-muse");
      expect(silverMini?.id).toBe("2");
      expect(silverMini?.price).toBe(2299);

      const lumiPerle = getProductBySlug("lumi-perle");
      expect(lumiPerle?.id).toBe("3");
      expect(lumiPerle?.price).toBe(3999);
    });

    it("returns undefined for non-existent slug", () => {
      const product = getProductBySlug("non-existent-product");
      expect(product).toBeUndefined();
    });

    it("is case-sensitive", () => {
      const product = getProductBySlug("ETHEREAL-PEARL");
      expect(product).toBeUndefined();
    });

    it("returns complete product object with all fields", () => {
      const product = getProductBySlug("ethereal-pearl");

      expect(product).toMatchObject({
        id: "1",
        slug: "ethereal-pearl",
        brand: "DREAMEARL",
        name: "ETHEREAL PEARL",
        price: 4599,
        currency: "Rs.",
        image: "/products/ethereal-pearl.jpg",
        category: "handbags",
      });

      expect(product?.details).toMatchObject({
        product: "Handbag",
        craftTechnique: "Handmade / Handwoven",
        pearlType: "Manufactured",
        pearlColour: "Ivory",
        size: '7"W x 9"H',
      });

      expect(product?.note).toBeTruthy();
      expect(product?.careInstructions).toBeTruthy();
      expect(product?.shippingInfo).toBeTruthy();
      expect(product?.packagingInfo).toBeTruthy();
    });
  });

  describe("Product Details", () => {
    it("ethereal-pearl has correct details", () => {
      const product = getProductBySlug("ethereal-pearl");
      expect(product?.details.pearlColour).toBe("Ivory");
      expect(product?.details.size).toBe('7"W x 9"H');
    });

    it("silver-mini-muse has correct details", () => {
      const product = getProductBySlug("silver-mini-muse");
      expect(product?.details.pearlColour).toBe("Silver");
      expect(product?.details.size).toBe('6"W x 8"H');
    });

    it("lumi-perle has correct details", () => {
      const product = getProductBySlug("lumi-perle");
      expect(product?.details.pearlColour).toBe("Champagne");
      expect(product?.details.size).toBe('8"W x 10"H');
    });
  });
});
