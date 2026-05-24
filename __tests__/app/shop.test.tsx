import { render, screen } from "@/__tests__/utils/test-utils";
import ShopPage from "@/app/shop/page";
import { translations } from "@/lib/constants/translations";

jest.mock("@/lib/sanity", () => ({
  getProductsByCategory: jest.fn(),
  getAllProducts: jest.fn(),
  urlFor: jest.fn(() => ({
    width: jest.fn().mockReturnThis(),
    url: jest.fn(() => "/mock-product-image.jpg"),
  })),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockProducts = [
  {
    _id: "prod-1",
    name: "Pearl Earrings",
    price: 1500,
    images: [{ asset: { _ref: "image-1" } }],
    slug: { current: "pearl-earrings" },
    brand: "DREAMEARL",
    currency: "Rs.",
  },
  {
    _id: "prod-2",
    name: "Pearl Necklace",
    price: 3000,
    images: [{ asset: { _ref: "image-2" } }],
    slug: { current: "pearl-necklace" },
    brand: "DREAMEARL",
    currency: "Rs.",
  },
];

import { getProductsByCategory, getAllProducts } from "@/lib/sanity";

describe("Shop Page", () => {
  describe("With category filter", () => {
    it("renders the category heading capitalised", async () => {
      (getProductsByCategory as jest.Mock).mockResolvedValue(mockProducts);
      render(
        await ShopPage({
          searchParams: Promise.resolve({ category: "earrings" }),
        }),
      );
      expect(screen.getByText("Earrings")).toBeInTheDocument();
    });

    it("renders product cards", async () => {
      (getProductsByCategory as jest.Mock).mockResolvedValue(mockProducts);
      render(
        await ShopPage({
          searchParams: Promise.resolve({ category: "earrings" }),
        }),
      );
      expect(screen.getByText("Pearl Earrings")).toBeInTheDocument();
      expect(screen.getByText("Pearl Necklace")).toBeInTheDocument();
    });
  });

  describe("Without category filter", () => {
    it("renders generic 'Shop' heading", async () => {
      (getAllProducts as jest.Mock).mockResolvedValue([]);
      render(await ShopPage({ searchParams: Promise.resolve({}) }));
      expect(screen.getByText("Shop")).toBeInTheDocument();
    });

    it("renders empty product grid", async () => {
      (getAllProducts as jest.Mock).mockResolvedValue([]);
      render(await ShopPage({ searchParams: Promise.resolve({}) }));
      expect(screen.queryAllByRole("link")).toHaveLength(0);
    });
  });
});
