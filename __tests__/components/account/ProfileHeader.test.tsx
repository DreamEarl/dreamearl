import { render, screen } from "@/__tests__/utils/test-utils";
import ProfileHeader from "@/components/account/ProfileHeader";
import { translations } from "@/lib/constants/translations";

describe("ProfileHeader", () => {
  it("renders the profile title", () => {
    render(<ProfileHeader name="Sakshi" email="sakshi@example.com" />);
    expect(screen.getByText(translations.account.title)).toBeInTheDocument();
  });

  it("renders a greeting with the user's name", () => {
    render(<ProfileHeader name="Sakshi" email="sakshi@example.com" />);
    expect(
      screen.getByRole("heading", { name: /hello, sakshi/i }),
    ).toBeInTheDocument();
  });

  it("renders the user's email", () => {
    render(<ProfileHeader name="Sakshi" email="sakshi@example.com" />);
    expect(screen.getByText("sakshi@example.com")).toBeInTheDocument();
  });
});
