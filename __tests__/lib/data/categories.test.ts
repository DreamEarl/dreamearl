import { categories } from "@/lib/data/categories";

describe("Categories Data", () => {
  describe("Category Type", () => {
    it("all categories have required fields", () => {
      categories.forEach((category) => {
        expect(category).toHaveProperty("id");
        expect(category).toHaveProperty("name");
        expect(category).toHaveProperty("slug");
        expect(category).toHaveProperty("image");
        expect(category).toHaveProperty("href");
      });
    });
  });

  describe("Categories Array", () => {
    it("contains categories", () => {
      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it("contains expected categories", () => {
      expect(categories.length).toBe(4);

      const names = categories.map((c) => c.name);
      expect(names).toContain("HANDBAGS");
      expect(names).toContain("BRACELETS");
      expect(names).toContain("NECKLACES");
      expect(names).toContain("EARRINGS");
    });

    it("all categories have unique ids", () => {
      const ids = categories.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(categories.length);
    });

    it("all categories have unique slugs", () => {
      const slugs = categories.map((c) => c.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(categories.length);
    });
  });

  describe("Category Data Validation", () => {
    it("all categories have non-empty strings", () => {
      categories.forEach((category) => {
        expect(category.id).toBeTruthy();
        expect(category.name).toBeTruthy();
        expect(category.slug).toBeTruthy();
        expect(category.image).toBeTruthy();
        expect(category.href).toBeTruthy();
      });
    });

    it("all category names are uppercase", () => {
      categories.forEach((category) => {
        expect(category.name).toBe(category.name.toUpperCase());
      });
    });

    it("all category slugs are lowercase", () => {
      categories.forEach((category) => {
        expect(category.slug).toBe(category.slug.toLowerCase());
      });
    });

    it("id matches slug for all categories", () => {
      categories.forEach((category) => {
        expect(category.id).toBe(category.slug);
      });
    });

    it("all images follow correct path pattern", () => {
      categories.forEach((category) => {
        expect(category.image).toMatch(/^\/categories\/.+\.jpg$/);
        expect(category.image).toContain(category.slug);
      });
    });

    it("all hrefs follow correct query pattern", () => {
      categories.forEach((category) => {
        expect(category.href).toBe(`/shop?category=${category.slug}`);
      });
    });
  });

  describe("Individual Categories", () => {
    it("handbags category is correct", () => {
      const handbags = categories.find((c) => c.id === "handbags");
      expect(handbags).toMatchObject({
        id: "handbags",
        name: "HANDBAGS",
        slug: "handbags",
        image: "/categories/handbags.jpg",
        href: "/shop?category=handbags",
      });
    });

    it("bracelets category is correct", () => {
      const bracelets = categories.find((c) => c.id === "bracelets");
      expect(bracelets).toMatchObject({
        id: "bracelets",
        name: "BRACELETS",
        slug: "bracelets",
        image: "/categories/bracelets.jpg",
        href: "/shop?category=bracelets",
      });
    });

    it("necklaces category is correct", () => {
      const necklaces = categories.find((c) => c.id === "necklaces");
      expect(necklaces).toMatchObject({
        id: "necklaces",
        name: "NECKLACES",
        slug: "necklaces",
        image: "/categories/necklaces.jpg",
        href: "/shop?category=necklaces",
      });
    });

    it("earrings category is correct", () => {
      const earrings = categories.find((c) => c.id === "earrings");
      expect(earrings).toMatchObject({
        id: "earrings",
        name: "EARRINGS",
        slug: "earrings",
        image: "/categories/earrings.jpg",
        href: "/shop?category=earrings",
      });
    });
  });
});
