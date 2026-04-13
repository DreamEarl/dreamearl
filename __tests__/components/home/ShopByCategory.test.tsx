import { render, screen } from "@/__tests__/utils/test-utils";
import ShopByCategory from "@/components/home/ShopByCategory";
import { translations } from "@/lib/constants/translations";

jest.mock("@/lib/sanity", () => ({
  getAllCategories: jest.fn(),
  urlFor: jest.fn(() => ({
    width: jest.fn().mockReturnThis(),
    url: jest.fn(() => "/mock-category-image.jpg"),
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

const mockCategories = [
  {
    _id: "cat-1",
    name: "Earrings",
    slug: { current: "earrings" },
    image: { asset: { _ref: "image-1" } },
  },
  {
    _id: "cat-2",
    name: "Necklaces",
    slug: { current: "necklaces" },
    image: { asset: { _ref: "image-2" } },
  },
];

import { getAllCategories } from "@/lib/sanity";

describe("ShopByCategory Component", () => {
  beforeEach(() => {
    (getAllCategories as jest.Mock).mockResolvedValue(mockCategories);
  });

  describe("Rendering", () => {
    it("renders section heading", async () => {
      render(await ShopByCategory());
      expect(
        screen.getByText(translations.shopByCategory.title),
      ).toBeInTheDocument();
    });

    it("renders a link for each category", async () => {
      render(await ShopByCategory());
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(mockCategories.length);
    });

    it("renders category names", async () => {
      render(await ShopByCategory());
      expect(screen.getByText("Earrings")).toBeInTheDocument();
      expect(screen.getByText("Necklaces")).toBeInTheDocument();
    });

    it("renders category images with correct alt text", async () => {
      render(await ShopByCategory());
      expect(screen.getByAltText("Earrings")).toBeInTheDocument();
      expect(screen.getByAltText("Necklaces")).toBeInTheDocument();
    });

    it("links to correct category URLs", async () => {
      render(await ShopByCategory());
      const earringsLink = screen.getByText("Earrings").closest("a");
      expect(earringsLink).toHaveAttribute("href", "/shop?category=earrings");
    });
  });

  describe("Empty State", () => {
    it("renders no category cards when categories is empty", async () => {
      (getAllCategories as jest.Mock).mockResolvedValue([]);
      render(await ShopByCategory());
      expect(screen.queryAllByRole("link")).toHaveLength(0);
    });
  });
});
