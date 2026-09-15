import { render, screen } from "@/__tests__/utils/test-utils";
import AuthDivider from "@/components/login/AuthDivider";
import { translations } from "@/lib/constants/translations";

describe("AuthDivider", () => {
  it("renders the OR divider text", () => {
    render(<AuthDivider />);
    expect(screen.getByText(translations.login.orDivider)).toBeInTheDocument();
  });
});
