import { render, screen } from "@/__tests__/utils/test-utils";
import AboutPage from "@/app/about/page";

jest.mock("@/lib/sanity/queries", () => ({
  getAboutPage: jest.fn(() => Promise.resolve(null)),
}));

jest.mock("@/lib/sanity/client", () => ({
  urlFor: jest.fn(() => ({
    width: jest.fn().mockReturnThis(),
    quality: jest.fn().mockReturnThis(),
    url: jest.fn(() => "/mock-image.jpg"),
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
    return <img src={src} alt={alt} />;
  },
}));

describe("About Page", () => {
  describe("Rendering", () => {
    it("renders the page heading", async () => {
      render(await AboutPage());
      expect(
        screen.getByRole("heading", { name: /our story/i }),
      ).toBeInTheDocument();
    });

    it("renders hero subtitle", async () => {
      render(await AboutPage());
      expect(
        screen.getByText(/Handmade Luxury Accessories/i),
      ).toBeInTheDocument();
    });

    it("renders brand description", async () => {
      render(await AboutPage());
      expect(screen.getByAltText(/pearl accessories/i)).toBeInTheDocument();
    });

    it("renders as a full-page layout with min height", async () => {
      const { container } = render(await AboutPage());
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("min-h-screen");
    });
  });
});
