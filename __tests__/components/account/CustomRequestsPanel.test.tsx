import { render, screen } from "@/__tests__/utils/test-utils";
import CustomRequestsPanel from "@/components/account/CustomRequestsPanel";
import type { CustomRequest } from "@/lib/customRequests/types";

const baseRequest: CustomRequest = {
  id: "req-1",
  user_id: "user-1",
  product_type: "Necklace",
  message: "Pearl bag in pastel pink with detachable chain.",
  image_url: null,
  status: "IN_DISCUSSION",
  created_at: "2025-09-05T00:00:00.000Z",
  updated_at: "2025-09-06T00:00:00.000Z",
};

describe("CustomRequestsPanel", () => {
  it("shows an empty state with a call to action when there are no requests", () => {
    render(<CustomRequestsPanel requests={[]} />);
    expect(screen.getByText("No custom requests yet")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Place a Custom Request" }),
    ).toHaveAttribute("href", "/custom-order");
  });

  it("renders custom requests with status and a view details link", () => {
    render(<CustomRequestsPanel requests={[baseRequest]} />);
    expect(screen.getByText("Custom Necklace")).toBeInTheDocument();
    expect(screen.getByText("In Discussion")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Details" })).toHaveAttribute(
      "href",
      "/account/custom-requests/req-1",
    );
  });

  it("renders multiple requests", () => {
    const second = {
      ...baseRequest,
      id: "req-2",
      status: "CONFIRMED" as const,
    };
    render(<CustomRequestsPanel requests={[baseRequest, second]} />);
    expect(screen.getAllByText("Custom Necklace")).toHaveLength(2);
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });
});
