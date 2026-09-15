import { render, screen } from "@/__tests__/utils/test-utils";
import AccountPage from "@/app/account/page";

const mockRedirect = jest.fn();
const mockGetUser = jest.fn();
const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

jest.mock("@/lib/supabase/server", () => ({
  createClient: () => ({
    auth: {
      getUser: (...args: unknown[]) => mockGetUser(...args),
    },
  }),
}));

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  }),
}));

describe("Account Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to /login when there is no authenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    render(await AccountPage());

    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("renders the greeting with the user's first name and email", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          email: "sakshi@example.com",
          user_metadata: { first_name: "Sakshi" },
        },
      },
    });

    render(await AccountPage());

    expect(screen.getByText("MY PROFILE")).toBeInTheDocument();
    expect(screen.getByText("Sakshi")).toBeInTheDocument();
    expect(screen.getByText("sakshi@example.com")).toBeInTheDocument();
  });

  it("renders quick links and a sign out button", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: { email: "sakshi@example.com", user_metadata: {} },
      },
    });

    render(await AccountPage());

    expect(screen.getByText("Continue Shopping")).toBeInTheDocument();
    expect(screen.getByText("View Cart")).toBeInTheDocument();
    expect(screen.getByText("Custom Orders")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign Out" }),
    ).toBeInTheDocument();
  });
});
