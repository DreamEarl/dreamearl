import { render, screen } from "@/__tests__/utils/test-utils";
import Hero from "@/components/home/Hero";
import { translations } from "@/lib/constants/translations";

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

describe("Hero Component", () => {
  describe("Rendering", () => {
    it("renders the hero section", () => {
      const { container } = render(<Hero />);
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("renders hero background image", () => {
      render(<Hero />);
      const backgroundImages = screen.getAllByAltText(
        "Pearl handbag hero image",
      );
      expect(backgroundImages.length).toBeGreaterThan(0);
    });

    it("renders the logo image", () => {
      render(<Hero />);
      const logoImage = screen.getByAltText("DreamEarl Logo");
      expect(logoImage).toBeInTheDocument();
    });

    it("renders tagline text", () => {
      render(<Hero />);
      expect(screen.getByText(translations.hero.tagline)).toBeInTheDocument();
    });
  });

  describe("CTA Buttons", () => {
    it("renders Explore Collection button", () => {
      render(<Hero />);
      expect(
        screen.getByText(translations.hero.exploreCollection),
      ).toBeInTheDocument();
    });

    it("renders Our Story button", () => {
      render(<Hero />);
      expect(screen.getByText(translations.hero.ourStory)).toBeInTheDocument();
    });

    it("Explore Collection links to /shop", () => {
      render(<Hero />);
      const exploreLink = screen
        .getByText(translations.hero.exploreCollection)
        .closest("a");
      expect(exploreLink).toHaveAttribute("href", "/shop");
    });

    it("Our Story links to /about", () => {
      render(<Hero />);
      const storyLink = screen
        .getByText(translations.hero.ourStory)
        .closest("a");
      expect(storyLink).toHaveAttribute("href", "/about");
    });
  });
});
