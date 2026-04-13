import { render, screen } from "@/__tests__/utils/test-utils";
import MainLayout from "@/components/layout/MainLayout";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("@/components/layout/Navbar", () => ({
  __esModule: true,
  default: ({ isHomePage }: { isHomePage: boolean }) => (
    <nav data-testid="navbar" data-is-home={String(isHomePage)} />
  ),
}));

jest.mock("@/components/layout/Footer", () => ({
  __esModule: true,
  default: () => <footer data-testid="footer" />,
}));

jest.mock("@/components/logo/AnimatedLogo", () => ({
  __esModule: true,
  default: () => <div data-testid="animated-logo" />,
}));

import { usePathname } from "next/navigation";

describe("MainLayout Component", () => {
  describe("Structure", () => {
    it("renders Navbar", () => {
      (usePathname as jest.Mock).mockReturnValue("/about");
      render(<MainLayout>content</MainLayout>);
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
    });

    it("renders Footer", () => {
      (usePathname as jest.Mock).mockReturnValue("/about");
      render(<MainLayout>content</MainLayout>);
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("renders children", () => {
      (usePathname as jest.Mock).mockReturnValue("/about");
      render(
        <MainLayout>
          <div>page content</div>
        </MainLayout>,
      );
      expect(screen.getByText("page content")).toBeInTheDocument();
    });
  });

  describe("Home page behaviour", () => {
    it("shows AnimatedLogo on home page", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<MainLayout>home</MainLayout>);
      expect(screen.getByTestId("animated-logo")).toBeInTheDocument();
    });

    it("hides AnimatedLogo on non-home pages", () => {
      (usePathname as jest.Mock).mockReturnValue("/shop");
      render(<MainLayout>shop</MainLayout>);
      expect(screen.queryByTestId("animated-logo")).not.toBeInTheDocument();
    });

    it("passes isHomePage=true to Navbar on home route", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<MainLayout>home</MainLayout>);
      expect(screen.getByTestId("navbar")).toHaveAttribute(
        "data-is-home",
        "true",
      );
    });

    it("passes isHomePage=false to Navbar on other routes", () => {
      (usePathname as jest.Mock).mockReturnValue("/about");
      render(<MainLayout>about</MainLayout>);
      expect(screen.getByTestId("navbar")).toHaveAttribute(
        "data-is-home",
        "false",
      );
    });
  });
});
