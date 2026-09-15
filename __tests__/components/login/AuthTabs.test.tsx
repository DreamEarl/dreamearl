import { render, screen } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import AuthTabs from "@/components/login/AuthTabs";
import { translations } from "@/lib/constants/translations";

describe("AuthTabs", () => {
  const { tabs } = translations.login;

  it("renders both tabs", () => {
    render(<AuthTabs activeTab="signIn" onChange={jest.fn()} />);
    expect(screen.getByRole("tab", { name: tabs.signIn })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: tabs.createAccount }),
    ).toBeInTheDocument();
  });

  it("marks the active tab as selected", () => {
    render(<AuthTabs activeTab="createAccount" onChange={jest.fn()} />);
    expect(screen.getByRole("tab", { name: tabs.signIn })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(
      screen.getByRole("tab", { name: tabs.createAccount }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("associates each tab with its panel via aria-controls", () => {
    render(<AuthTabs activeTab="signIn" onChange={jest.fn()} />);
    expect(screen.getByRole("tab", { name: tabs.signIn })).toHaveAttribute(
      "aria-controls",
      "signin-panel",
    );
    expect(
      screen.getByRole("tab", { name: tabs.createAccount }),
    ).toHaveAttribute("aria-controls", "create-account-panel");
  });

  it("calls onChange with the clicked tab", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<AuthTabs activeTab="signIn" onChange={handleChange} />);

    await user.click(screen.getByRole("tab", { name: tabs.createAccount }));

    expect(handleChange).toHaveBeenCalledWith("createAccount");
  });
});
