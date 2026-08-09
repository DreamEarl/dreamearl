import { render, screen, act } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import CustomizeGalleryCarousel from "@/components/home/CustomizeGalleryCarousel";

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

const mockImages = [
  { _key: "img1", src: "/image1.jpg", alt: "Image One" },
  { _key: "img2", src: "/image2.jpg", alt: "Image Two" },
  { _key: "img3", src: "/image3.jpg", alt: null },
];

describe("CustomizeGalleryCarousel", () => {
  describe("Rendering", () => {
    it("renders all images with provided alt text", () => {
      render(<CustomizeGalleryCarousel images={mockImages} />);
      expect(screen.getByAltText("Image One")).toBeInTheDocument();
      expect(screen.getByAltText("Image Two")).toBeInTheDocument();
    });

    it("uses fallback alt text when alt is null", () => {
      render(<CustomizeGalleryCarousel images={mockImages} />);
      expect(
        screen.getByAltText("Custom order inspiration 3"),
      ).toBeInTheDocument();
    });

    it("does not show scroll buttons initially", () => {
      render(<CustomizeGalleryCarousel images={mockImages} />);
      expect(
        screen.queryByLabelText("Previous images"),
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Next images")).not.toBeInTheDocument();
    });

    it("renders empty carousel without errors", () => {
      render(<CustomizeGalleryCarousel images={[]} />);
      expect(
        screen.queryByLabelText("Previous images"),
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Next images")).not.toBeInTheDocument();
    });
  });

  describe("Scroll buttons", () => {
    it("shows right scroll button when content overflows", () => {
      render(<CustomizeGalleryCarousel images={mockImages} />);
      const container = document.getElementById("customize-gallery")!;
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

      expect(screen.getByLabelText("Next images")).toBeInTheDocument();
    });

    it("shows left scroll button when scrolled right", () => {
      render(<CustomizeGalleryCarousel images={mockImages} />);
      const container = document.getElementById("customize-gallery")!;
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

      expect(screen.getByLabelText("Previous images")).toBeInTheDocument();
    });

    it("calls scrollBy with smooth behavior when right button is clicked", async () => {
      const user = userEvent.setup();
      render(<CustomizeGalleryCarousel images={mockImages} />);
      const container = document.getElementById("customize-gallery")!;
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

      await user.click(screen.getByLabelText("Next images"));
      expect(scrollBySpy).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: "smooth" }),
      );
    });

    it("calls scrollBy with negative left when left button is clicked", async () => {
      const user = userEvent.setup();
      render(<CustomizeGalleryCarousel images={mockImages} />);
      const container = document.getElementById("customize-gallery")!;
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

      await user.click(screen.getByLabelText("Previous images"));
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
