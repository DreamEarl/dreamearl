import { render, screen } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import Button from "@/components/ui/Button";

describe("Button Component", () => {
  describe("Rendering", () => {
    it("renders children correctly", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("renders as a button by default", () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button.tagName).toBe("BUTTON");
    });

    it("renders as a link when href is provided", () => {
      render(<Button href="/test">Click me</Button>);
      const link = screen.getByRole("link", { name: /click me/i });
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  describe("Variants", () => {
    it("applies primary variant classes by default", () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-black", "text-white");
    });

    it("applies outline variant classes", () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border-1", "border-black");
    });

    it("applies ghost variant classes", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("flex", "items-center", "gap-2");
    });

    it("applies social variant classes", () => {
      render(<Button variant="social">Social</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full", "border-2", "border-gray-300");
    });

    it("applies underline variant classes", () => {
      render(<Button variant="underline">Underline</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("underline", "text-sm");
    });
  });

  describe("Sizes", () => {
    it("applies medium size by default", () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("py-4", "px-6");
    });

    it("applies small size classes", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("py-3", "px-6", "text-sm");
    });

    it("does not apply size classes for ghost variant", () => {
      render(
        <Button variant="ghost" size="md">
          Ghost
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("py-4");
    });

    it("does not apply size classes for underline variant", () => {
      render(
        <Button variant="underline" size="md">
          Underline
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("py-4");
    });
  });

  describe("Full Width", () => {
    it("applies full width class when fullWidth is true", () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full");
    });

    it("does not apply full width class for ghost variant", () => {
      render(
        <Button variant="ghost" fullWidth>
          Ghost Full
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("w-full");
    });

    it("does not apply full width class for underline variant", () => {
      render(
        <Button variant="underline" fullWidth>
          Underline Full
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("w-full");
    });
  });

  describe("Custom className", () => {
    it("applies custom className", () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("combines custom className with variant classes", () => {
      render(
        <Button variant="outline" className="custom-class">
          Combined
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border-1", "border-black", "custom-class");
    });
  });

  describe("Interactions", () => {
    it("calls onClick handler when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("passes through other button props", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("supports type attribute", () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });
  });

  describe("Accessibility", () => {
    it("supports aria-label", () => {
      render(<Button aria-label="Close">×</Button>);
      expect(screen.getByLabelText("Close")).toBeInTheDocument();
    });

    it("is keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Press me</Button>);

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalled();
    });
  });
});
