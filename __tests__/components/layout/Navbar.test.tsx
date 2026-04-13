import { render, screen, waitFor } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/layout/Navbar";
import { translations } from "@/lib/constants/translations";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("Navbar Component", () => {
  beforeEach(() => {
    // Reset scroll position
    window.scrollY = 0;
  });

  describe("Rendering", () => {
    it("renders navigation element", () => {
      render(<Navbar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });

    it("renders Contact Us button", () => {
      render(<Navbar />);
      expect(screen.getByText("Contact Us")).toBeInTheDocument();
    });

    it("renders user icon link", () => {
      render(<Navbar />);
      const userLink = screen.getByLabelText("Account");
      expect(userLink).toHaveAttribute("href", "/login");
    });

    it("renders cart icon link", () => {
      render(<Navbar />);
      const cartLink = screen.getByLabelText("Shopping Cart");
      expect(cartLink).toHaveAttribute("href", "/cart");
    });
  });

  describe("Logo Visibility", () => {
    it("shows logo when not on home page", () => {
      render(<Navbar isHomePage={false} />);
      expect(screen.getByText(translations.common.brand)).toBeInTheDocument();
    });

    it("hides logo when on home page", () => {
      render(<Navbar isHomePage={true} />);
      expect(
        screen.queryByText(translations.common.brand),
      ).not.toBeInTheDocument();
    });

    it("logo links to home page", () => {
      render(<Navbar isHomePage={false} />);
      const logo = screen.getByText(translations.common.brand);
      expect(logo.closest("a")).toHaveAttribute("href", "/");
    });
  });

  describe("Styling Based on Context", () => {
    it("applies dark styling when not on home page", () => {
      const { container } = render(<Navbar isHomePage={false} />);
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("bg-white", "shadow-sm");
    });

    it("applies transparent styling on home page before scroll", () => {
      const { container } = render(<Navbar isHomePage={true} />);
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("bg-transparent");
    });

    it("applies dark styling on home page after scrolling", async () => {
      const { container } = render(<Navbar isHomePage={true} />);

      // Simulate scroll
      Object.defineProperty(window, "scrollY", {
        writable: true,
        value: 150,
      });

      window.dispatchEvent(new Event("scroll"));

      await waitFor(() => {
        const nav = container.querySelector("nav");
        expect(nav).toHaveClass("bg-white", "shadow-sm");
      });
    });
  });

  describe("Contact Panel", () => {
    it("contact panel is initially closed", () => {
      render(<Navbar />);
      expect(
        screen.queryByText(
          "Choose your preferred method of contact and connect with us",
        ),
      ).not.toBeInTheDocument();
    });

    it("opens contact panel when Contact Us button is clicked", async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      const contactButton = screen.getByText("Contact Us");
      await user.click(contactButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Choose your preferred method of contact and connect with us",
          ),
        ).toBeInTheDocument();
      });
    });

    it("closes contact panel when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      // Open panel
      const contactButton = screen.getByText("Contact Us");
      await user.click(contactButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Choose your preferred method of contact and connect with us",
          ),
        ).toBeInTheDocument();
      });

      // Close panel
      const closeButton = screen.getByLabelText("Close panel");
      await user.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByText(
            "Choose your preferred method of contact and connect with us",
          ),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Scroll Event Handling", () => {
    it("does not add scroll listener when not on home page", () => {
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");
      render(<Navbar isHomePage={false} />);

      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
      );

      addEventListenerSpy.mockRestore();
    });

    it("adds scroll listener when on home page", () => {
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");
      render(<Navbar isHomePage={true} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
      );

      addEventListenerSpy.mockRestore();
    });

    it("removes scroll listener on unmount", () => {
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
      const { unmount } = render(<Navbar isHomePage={true} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe("Responsive Behavior", () => {
    it("Contact Us button has hidden class for mobile", () => {
      render(<Navbar />);
      const contactButton = screen.getByText("Contact Us");
      expect(contactButton).toHaveClass("hidden", "md:inline");
    });
  });

  describe("Accessibility", () => {
    it("user link has accessible label", () => {
      render(<Navbar />);
      const userLink = screen.getByLabelText("Account");
      expect(userLink).toBeInTheDocument();
    });

    it("cart link has accessible label", () => {
      render(<Navbar />);
      const cartLink = screen.getByLabelText("Shopping Cart");
      expect(cartLink).toBeInTheDocument();
    });

    it("Contact Us button is a button element", () => {
      render(<Navbar />);
      const contactButton = screen.getByText("Contact Us");
      expect(contactButton.tagName).toBe("BUTTON");
    });
  });

  describe("Hover States", () => {
    it("logo has hover opacity class", () => {
      render(<Navbar isHomePage={false} />);
      const logo = screen.getByText(translations.common.brand);
      expect(logo).toHaveClass("hover:opacity-70");
    });

    it("user icon has hover opacity class", () => {
      render(<Navbar />);
      const userLink = screen.getByLabelText("Account");
      expect(userLink).toHaveClass("hover:opacity-80");
    });

    it("cart icon has hover opacity class", () => {
      render(<Navbar />);
      const cartLink = screen.getByLabelText("Shopping Cart");
      expect(cartLink).toHaveClass("hover:opacity-80");
    });

    it("Contact Us button has hover opacity class", () => {
      render(<Navbar />);
      const contactButton = screen.getByText("Contact Us");
      expect(contactButton).toHaveClass("hover:opacity-80");
    });
  });
});
