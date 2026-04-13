import { render, screen, waitFor } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import SidePanel from "@/components/ui/SidePanel";

describe("SidePanel Component", () => {
  const mockOnClose = jest.fn();
  const testContent = "Test Content";

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe("Rendering", () => {
    it("renders children when open", () => {
      render(
        <SidePanel isOpen={true} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );
      expect(screen.getByText(testContent)).toBeInTheDocument();
    });

    it("renders close button when open", () => {
      render(
        <SidePanel isOpen={true} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );
      expect(screen.getByLabelText("Close panel")).toBeInTheDocument();
    });

    it("applies correct transform class when open", () => {
      const { container } = render(
        <SidePanel isOpen={true} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );
      const panel = container.querySelector(".translate-x-0");
      expect(panel).toBeInTheDocument();
    });

    it("applies correct transform class when closed", () => {
      const { container } = render(
        <SidePanel isOpen={false} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );
      const panel = container.querySelector(".translate-x-full");
      expect(panel).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls onClose when close button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <SidePanel isOpen={true} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );

      const closeButton = screen.getByLabelText("Close panel");
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when backdrop is clicked", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <SidePanel isOpen={true} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );

      const backdrop = container.querySelector(".bg-black");
      if (backdrop) {
        await user.click(backdrop);
      }

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when Escape key is pressed", async () => {
      const user = userEvent.setup();
      render(
        <SidePanel isOpen={true} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );

      await user.keyboard("{Escape}");

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Body Scroll Behavior", () => {
    it("sets body overflow to hidden when panel is open", () => {
      render(
        <SidePanel isOpen={true} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("resets body overflow when panel is closed", () => {
      const { rerender } = render(
        <SidePanel isOpen={true} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );

      expect(document.body.style.overflow).toBe("hidden");

      rerender(
        <SidePanel isOpen={false} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );

      expect(document.body.style.overflow).toBe("unset");
    });

    it("cleans up body overflow on unmount", () => {
      const { unmount } = render(
        <SidePanel isOpen={true} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );

      unmount();

      expect(document.body.style.overflow).toBe("unset");
    });
  });

  describe("Backdrop Opacity", () => {
    it("shows backdrop with opacity when open", () => {
      const { container } = render(
        <SidePanel isOpen={true} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );

      const backdrop = container.querySelector(".opacity-40");
      expect(backdrop).toBeInTheDocument();
    });

    it("hides backdrop with opacity-0 when closed", () => {
      const { container } = render(
        <SidePanel isOpen={false} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );

      const backdrop = container.querySelector(".opacity-0");
      expect(backdrop).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has accessible close button", () => {
      render(
        <SidePanel isOpen={true} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );

      const closeButton = screen.getByLabelText("Close panel");
      expect(closeButton).toBeInTheDocument();
      expect(closeButton.tagName).toBe("BUTTON");
    });

    it("backdrop is marked as aria-hidden", () => {
      const { container } = render(
        <SidePanel isOpen={true} onClose={mockOnClose}>
          <div>{testContent}</div>
        </SidePanel>,
      );

      const backdrop = container.querySelector('[aria-hidden="true"]');
      expect(backdrop).toBeInTheDocument();
    });
  });
});
