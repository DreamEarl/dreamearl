import { render } from "@/__tests__/utils/test-utils";
import {
  PhoneIcon,
  MailIcon,
  InstagramIcon,
  CloseIcon,
} from "@/components/ui/icons";

describe("Icon Components", () => {
  describe("PhoneIcon", () => {
    it("renders an SVG element", () => {
      const { container } = render(<PhoneIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("applies default className", () => {
      const { container } = render(<PhoneIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-5", "h-5");
    });

    it("applies custom className", () => {
      const { container } = render(<PhoneIcon className="w-10 h-10" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-10", "h-10");
    });
  });

  describe("MailIcon", () => {
    it("renders an SVG element", () => {
      const { container } = render(<MailIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("applies default className", () => {
      const { container } = render(<MailIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-5", "h-5");
    });

    it("applies custom className", () => {
      const { container } = render(
        <MailIcon className="w-8 h-8 text-blue-500" />,
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-8", "h-8", "text-blue-500");
    });
  });

  describe("InstagramIcon", () => {
    it("renders an SVG element", () => {
      const { container } = render(<InstagramIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("applies default className", () => {
      const { container } = render(<InstagramIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-5", "h-5");
    });

    it("applies custom className", () => {
      const { container } = render(
        <InstagramIcon className="w-6 h-6 text-pink-500" />,
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-6", "h-6", "text-pink-500");
    });

    it("has the correct viewBox for Instagram icon", () => {
      const { container } = render(<InstagramIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });

    it("uses fill for Instagram icon", () => {
      const { container } = render(<InstagramIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("fill", "currentColor");
    });
  });

  describe("CloseIcon", () => {
    it("renders an SVG element", () => {
      const { container } = render(<CloseIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("applies default className", () => {
      const { container } = render(<CloseIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-5", "h-5");
    });

    it("applies custom className", () => {
      const { container } = render(
        <CloseIcon className="w-4 h-4 text-red-500" />,
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-4", "h-4", "text-red-500");
    });
  });

  describe("Icon Reusability", () => {
    it("renders multiple instances of the same icon independently", () => {
      const { container } = render(
        <div>
          <PhoneIcon className="icon-1" />
          <PhoneIcon className="icon-2" />
          <PhoneIcon className="icon-3" />
        </div>,
      );

      const icons = container.querySelectorAll("svg");
      expect(icons).toHaveLength(3);
      expect(icons[0]).toHaveClass("icon-1");
      expect(icons[1]).toHaveClass("icon-2");
      expect(icons[2]).toHaveClass("icon-3");
    });
  });

  describe("Icon Consistency", () => {
    it("all icons accept className prop", () => {
      const customClass = "custom-icon-class";

      const phoneIcon = render(<PhoneIcon className={customClass} />);
      expect(phoneIcon.container.querySelector("svg")).toHaveClass(customClass);

      const mailIcon = render(<MailIcon className={customClass} />);
      expect(mailIcon.container.querySelector("svg")).toHaveClass(customClass);

      const instagramIcon = render(<InstagramIcon className={customClass} />);
      expect(instagramIcon.container.querySelector("svg")).toHaveClass(
        customClass,
      );

      const closeIcon = render(<CloseIcon className={customClass} />);
      expect(closeIcon.container.querySelector("svg")).toHaveClass(customClass);
    });

    it("all icons have default size classes", () => {
      const icons = [
        render(<PhoneIcon />),
        render(<MailIcon />),
        render(<InstagramIcon />),
        render(<CloseIcon />),
      ];

      icons.forEach(({ container }) => {
        const svg = container.querySelector("svg");
        expect(svg).toHaveClass("w-5", "h-5");
      });
    });
  });
});
