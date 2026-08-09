import { render, screen, act } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import ProductCarousel from "@/components/home/ProductCarousel";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
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
    _id: "1",
    name: "Product One",
    price: 1000,
    image: "/img1.jpg",
    href: "/products/one",
    brand: "DREAMEARL",
    currency: "Rs.",
  },
  {
    _id: "2",
    name: "Product Two",
    price: 2000,
    image: "/img2.jpg",
    href: "/products/two",
    brand: "DREAMEARL",
    currency: "Rs.",
  },
  {
    _id: "3",
    name: "Product Three",
    price: 3000,
    image: "/img3.jpg",
    href: "/products/three",
  },
];

describe("ProductCarousel", () => {
  describe("Rendering", () => {
    it("renders all product names", () => {
      render(<ProductCarousel products={mockProducts} />);
      expect(screen.getByText("Product One")).toBeInTheDocument();
      expect(screen.getByText("Product Two")).toBeInTheDocument();
      expect(screen.getByText("Product Three")).toBeInTheDocument();
    });

    it("renders product links with correct hrefs", () => {
      render(<ProductCarousel products={mockProducts} />);
      const links = screen.getAllByRole("link");
      expect(
        links.some((l) => l.getAttribute("href") === "/products/one"),
      ).toBe(true);
      expect(
        links.some((l) => l.getAttribute("href") === "/products/two"),
      ).toBe(true);
      expect(
        links.some((l) => l.getAttribute("href") === "/products/three"),
      ).toBe(true);
    });

    it("renders product images with correct alt text", () => {
      render(<ProductCarousel products={mockProducts} />);
      expect(screen.getByAltText("Product One")).toBeInTheDocument();
      expect(screen.getByAltText("Product Two")).toBeInTheDocument();
    });

    it("does not show scroll buttons initially", () => {
      render(<ProductCarousel products={mockProducts} />);
      expect(
        screen.queryByLabelText("Previous products"),
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Next products")).not.toBeInTheDocument();
    });

    it("renders empty carousel without errors", () => {
      render(<ProductCarousel products={[]} />);
      expect(
        screen.queryByLabelText("Previous products"),
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Next products")).not.toBeInTheDocument();
    });
  });

  describe("Scroll buttons", () => {
    it("shows right scroll button when content overflows", () => {
      render(<ProductCarousel products={mockProducts} />);
      const container = document.getElementById("featured-products-grid")!;
      Object.defineProperty(container, "scrollWidth", {
        value: 1000,
        configurable: true,
      });
      Object.defineProperty(container, "clientWidth", {
        value: 400,
        configurable: true,
      });

      act(() => {
        container.dispatchEvent(new Event("scroll"));
      });

      expect(screen.getByLabelText("Next products")).toBeInTheDocument();
    });

    it("shows left scroll button when scrolled right", () => {
      render(<ProductCarousel products={mockProducts} />);
      const container = document.getElementById("featured-products-grid")!;
      Object.defineProperty(container, "scrollLeft", {
        value: 100,
        configurable: true,
      });
      Object.defineProperty(container, "scrollWidth", {
        value: 1000,
        configurable: true,
      });
      Object.defineProperty(container, "clientWidth", {
        value: 400,
        configurable: true,
      });

      act(() => {
        container.dispatchEvent(new Event("scroll"));
      });

      expect(screen.getByLabelText("Previous products")).toBeInTheDocument();
    });

    it("calls scrollBy with smooth behavior when right button is clicked", async () => {
      const user = userEvent.setup();
      render(<ProductCarousel products={mockProducts} />);
      const container = document.getElementById("featured-products-grid")!;
      Object.defineProperty(container, "scrollWidth", {
        value: 1000,
        configurable: true,
      });
      Object.defineProperty(container, "clientWidth", {
        value: 400,
        configurable: true,
      });

      act(() => {
        container.dispatchEvent(new Event("scroll"));
      });

      const scrollBySpy = jest.fn();
      container.scrollBy = scrollBySpy;

      await user.click(screen.getByLabelText("Next products"));
      expect(scrollBySpy).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: "smooth" }),
      );
    });

    it("calls scrollBy with negative left when left button is clicked", async () => {
      const user = userEvent.setup();
      render(<ProductCarousel products={mockProducts} />);
      const container = document.getElementById("featured-products-grid")!;
      Object.defineProperty(container, "scrollLeft", {
        value: 100,
        configurable: true,
      });
      Object.defineProperty(container, "scrollWidth", {
        value: 1000,
        configurable: true,
      });
      Object.defineProperty(container, "clientWidth", {
        value: 400,
        configurable: true,
      });

      act(() => {
        container.dispatchEvent(new Event("scroll"));
      });

      const scrollBySpy = jest.fn();
      container.scrollBy = scrollBySpy;

      await user.click(screen.getByLabelText("Previous products"));
      expect(scrollBySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          left: expect.any(Number),
          behavior: "smooth",
        }),
      );
      expect(scrollBySpy.mock.calls[0][0].left).toBeLessThan(0);
    });
  });
});
