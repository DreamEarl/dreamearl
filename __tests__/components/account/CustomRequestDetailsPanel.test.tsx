import { render, screen } from "@/__tests__/utils/test-utils";
import CustomRequestDetailsPanel from "@/components/account/CustomRequestDetailsPanel";
import type { CustomRequest } from "@/lib/customRequests/types";

const baseRequest: CustomRequest = {
  id: "req-12345678",
  user_id: "user-1",
  full_name: "Jane Doe",
  email: "jane@example.com",
  phone: "+91 9876543210",
  product_type: "Necklace",
  message: "Pearl bag in pastel pink with detachable chain.",
  image_urls: [],
  status: "IN_DISCUSSION",
  decline_reason: null,
  created_at: "2025-09-05T00:00:00.000Z",
  updated_at: "2025-09-06T00:00:00.000Z",
};

describe("CustomRequestDetailsPanel", () => {
  it("renders the request number, status and message", () => {
    render(<CustomRequestDetailsPanel request={baseRequest} />);
    expect(screen.getByText(/REQ-1234/)).toBeInTheDocument();
    expect(
      document.getElementById("custom-request-details-panel-status"),
    ).toHaveTextContent("In Discussion");
    expect(screen.getByText(/Pearl bag in pastel pink/)).toBeInTheDocument();
  });

  it("renders the request timeline", () => {
    render(<CustomRequestDetailsPanel request={baseRequest} />);
    expect(screen.getByText("Request Placed")).toBeInTheDocument();
    // "In Discussion" appears both as the status badge and the current timeline step.
    expect(screen.getAllByText("In Discussion")).toHaveLength(2);
    expect(screen.getByText("Design Finalised")).toBeInTheDocument();
    expect(screen.getByText("In Production")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("renders a contact us link", () => {
    render(<CustomRequestDetailsPanel request={baseRequest} />);
    expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:"),
    );
  });

  it("renders a decline reason banner for a declined request", () => {
    render(
      <CustomRequestDetailsPanel
        request={{
          ...baseRequest,
          status: "DECLINED",
          decline_reason: "We're unable to source this material right now.",
        }}
      />,
    );
    expect(
      document.getElementById("custom-request-details-panel-decline-reason"),
    ).toHaveTextContent("We're unable to source this material right now.");
  });

  it("does not render a decline reason banner when not declined", () => {
    render(<CustomRequestDetailsPanel request={baseRequest} />);
    expect(
      document.getElementById("custom-request-details-panel-decline-reason"),
    ).not.toBeInTheDocument();
  });
});
