import { render, screen } from "@/__tests__/utils/test-utils";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { getFeaturedProductsByCategory } from "@/lib/sanity";

// Mock the sanity functions
jest.mock("@/lib/sanity", () => ({
  getFeaturedProductsByCategory: jest.fn(),
  urlFor: jest.fn((image) => ({
    width: jest.fn(() => ({
      url: jest.fn(() => "https://example.com/image.jpg"),
    })),
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

describe("FeaturedProducts", () => {
  const mockProducts = [
    {
      _id: "1",
      _type: "product" as const,
      brand: "DREAMEARL",
      name: "ETHEREAL PEARL",
      slug: { current: "ethereal-pearl" },
      images: [{}],
      price: 4599,
      currency: "Rs.",
      category: { _ref: "handbags", _type: "reference" as const },
      inStock: true,
      featured: true,
    },
    {
      _id: "2",
      _type: "product" as const,
      brand: "DREAMEARL",
      name: "SILVER MINI MUSE",
      slug: { current: "silver-mini-muse" },
      images: [{}],
      price: 2299,
      currency: "Rs.",
      category: { _ref: "handbags", _type: "reference" as const },
      inStock: true,
      featured: true,
    },
    {
      _id: "3",
      _type: "product" as const,
      brand: "DREAMEARL",
      name: "LUMI PERLE'",
      slug: { current: "lumi-perle" },
      images: [{}],
      price: 3999,
      currency: "Rs.",
      category: { _ref: "handbags", _type: "reference" as const },
      inStock: true,
      featured: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders featured products section with products", async () => {
    (getFeaturedProductsByCategory as jest.Mock).mockResolvedValue(
      mockProducts,
    );

    const component = await FeaturedProducts();
    render(component!);

    expect(screen.getByText("HANDBAGS")).toBeInTheDocument();
    expect(screen.getByText("VIEW ALL")).toBeInTheDocument();
    expect(screen.getByText("ETHEREAL PEARL")).toBeInTheDocument();
    expect(screen.getByText("SILVER MINI MUSE")).toBeInTheDocument();
    expect(screen.getByText("LUMI PERLE'")).toBeInTheDocument();
  });

  it("renders null when no products available", async () => {
    (getFeaturedProductsByCategory as jest.Mock).mockResolvedValue([]);

    const component = await FeaturedProducts();
    const { container } = render(component!);

    expect(container.firstChild).toBeNull();
  });

  it("displays product prices correctly", async () => {
    (getFeaturedProductsByCategory as jest.Mock).mockResolvedValue(
      mockProducts,
    );

    const component = await FeaturedProducts();
    render(component!);

    expect(screen.getByText(/4,599/)).toBeInTheDocument();
    expect(screen.getByText(/2,299/)).toBeInTheDocument();
    expect(screen.getByText(/3,999/)).toBeInTheDocument();
  });

  it("has correct link to shop page", async () => {
    (getFeaturedProductsByCategory as jest.Mock).mockResolvedValue(
      mockProducts,
    );

    const component = await FeaturedProducts();
    render(component!);

    const shopAllLink = screen
      .getByText("VIEW ALL")
      .closest("a") as HTMLAnchorElement;
    expect(shopAllLink).toHaveAttribute("href", "/shop?category=handbags");
  });

  it("fetches handbag products with limit of 3", async () => {
    (getFeaturedProductsByCategory as jest.Mock).mockResolvedValue(
      mockProducts,
    );

    await FeaturedProducts();

    expect(getFeaturedProductsByCategory).toHaveBeenCalledWith("handbags", 3);
  });
});
