import { render, screen } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import SignOutButton from "@/components/account/SignOutButton";
import { translations } from "@/lib/constants/translations";

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockSignOut = jest.fn().mockResolvedValue({ error: null });

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signOut: (...args: unknown[]) => mockSignOut(...args),
    },
  }),
}));

describe("SignOutButton", () => {
  const { account } = translations;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the sign out label", () => {
    render(<SignOutButton />);
    expect(
      screen.getByRole("button", { name: account.signOut }),
    ).toBeInTheDocument();
  });

  it("shows a confirmation dialog instead of signing out immediately", async () => {
    const user = userEvent.setup();
    render(<SignOutButton />);

    await user.click(screen.getByRole("button", { name: account.signOut }));

    expect(screen.getByText(account.signOutConfirm.title)).toBeInTheDocument();
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("does nothing and closes the dialog when Cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<SignOutButton />);

    await user.click(screen.getByRole("button", { name: account.signOut }));
    await user.click(
      screen.getByRole("button", { name: account.signOutConfirm.cancel }),
    );

    expect(
      screen.queryByText(account.signOutConfirm.title),
    ).not.toBeInTheDocument();
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("signs the user out and redirects to /signed-out when confirmed", async () => {
    const user = userEvent.setup();
    render(<SignOutButton />);

    await user.click(screen.getByRole("button", { name: account.signOut }));
    await user.click(
      screen.getByRole("button", { name: account.signOutConfirm.confirm }),
    );

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/signed-out");
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
