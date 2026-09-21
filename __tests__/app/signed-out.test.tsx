import { render, screen } from "@/__tests__/utils/test-utils";
import SignedOutPage from "@/app/signed-out/page";
import { translations } from "@/lib/constants/translations";

describe("Signed Out Page", () => {
  const { signedOut } = translations.account;

  it("renders the signed-out messaging", () => {
    render(<SignedOutPage />);
    expect(screen.getByText(signedOut.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: signedOut.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(signedOut.subtitle)).toBeInTheDocument();
  });

  it("links to the login page to sign back in", () => {
    render(<SignedOutPage />);
    expect(
      screen.getByRole("link", { name: signedOut.signIn }),
    ).toHaveAttribute("href", "/login");
  });

  it("links to the shop to keep exploring", () => {
    render(<SignedOutPage />);
    expect(
      screen.getByRole("link", { name: signedOut.explore }),
    ).toHaveAttribute("href", "/shop");
  });
});
