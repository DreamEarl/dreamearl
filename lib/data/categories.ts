export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  href: string;
}

export const categories: Category[] = [
  {
    id: "handbags",
    name: "HANDBAGS",
    slug: "handbags",
    image: "/categories/handbags.jpg",
    href: "/shop?category=handbags",
  },
  {
    id: "bracelets",
    name: "BRACELETS",
    slug: "bracelets",
    image: "/categories/bracelets.jpg",
    href: "/shop?category=bracelets",
  },
  {
    id: "necklaces",
    name: "NECKLACES",
    slug: "necklaces",
    image: "/categories/necklaces.jpg",
    href: "/shop?category=necklaces",
  },
  {
    id: "earrings",
    name: "EARRINGS",
    slug: "earrings",
    image: "/categories/earrings.jpg",
    href: "/shop?category=earrings",
  },
];
