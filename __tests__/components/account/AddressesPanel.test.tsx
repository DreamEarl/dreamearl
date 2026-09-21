import { render, screen, waitFor } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import AddressesPanel from "@/components/account/AddressesPanel";
import type { Address } from "@/lib/addresses/types";

const baseAddress: Address = {
  id: "addr-1",
  user_id: "user-1",
  full_name: "Sakshi Mandlik",
  phone: "9876543210",
  line1: "A-102, Shree Residency",
  line2: "College Road, Sangamner",
  city: "Ahmednagar",
  state: "Maharashtra",
  pincode: "422605",
  is_default: true,
  created_at: "2025-01-01T00:00:00.000Z",
  updated_at: "2025-01-01T00:00:00.000Z",
};

describe("AddressesPanel", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("shows an empty state with a call to action when there are no addresses", () => {
    render(<AddressesPanel addresses={[]} />);
    expect(screen.getByText("No saved addresses yet")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add New Address" }),
    ).toBeInTheDocument();
  });

  it("renders saved addresses with a default badge", () => {
    render(<AddressesPanel addresses={[baseAddress]} />);
    expect(screen.getByText("Sakshi Mandlik")).toBeInTheDocument();
    expect(screen.getByText("Default Address")).toBeInTheDocument();
    expect(
      screen.queryByText("Set as default address"),
    ).not.toBeInTheDocument();
  });

  it("shows the 'set as default' link for a non-default address", () => {
    render(
      <AddressesPanel addresses={[{ ...baseAddress, is_default: false }]} />,
    );
    expect(screen.getByText("Set as default address")).toBeInTheDocument();
  });

  it("opens the add address form and creates a new address", async () => {
    const user = userEvent.setup();
    const newAddress = {
      ...baseAddress,
      id: "addr-2",
      full_name: "New Person",
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ address: newAddress }),
    }) as unknown as typeof fetch;

    render(<AddressesPanel addresses={[]} />);
    await user.click(screen.getByRole("button", { name: "Add New Address" }));

    expect(screen.getByText("Add New Address")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Full Name*"), "New Person");
    await user.type(screen.getByLabelText("Phone Number*"), "9876543210");
    await user.type(screen.getByLabelText("Address Line 1*"), "Line 1");
    await user.type(screen.getByLabelText("City*"), "City");
    await user.type(screen.getByLabelText("State*"), "State");

    await user.click(screen.getByRole("button", { name: "Save Address" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/addresses",
        expect.objectContaining({ method: "POST" }),
      );
    });
    expect(await screen.findByText("New Person")).toBeInTheDocument();
  });

  it("removes an address when Remove is clicked", async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    }) as unknown as typeof fetch;

    render(<AddressesPanel addresses={[baseAddress]} />);
    await user.click(screen.getByRole("button", { name: "Remove" }));

    await waitFor(() => {
      expect(screen.queryByText("Sakshi Mandlik")).not.toBeInTheDocument();
    });
  });
});
