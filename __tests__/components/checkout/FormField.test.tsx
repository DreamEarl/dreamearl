import { render, screen } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import FormField from "@/components/checkout/FormField";

describe("FormField", () => {
  it("renders the label and forwards input props", () => {
    render(
      <FormField
        id="name"
        label="Full Name"
        value="Jane"
        onChange={() => {}}
      />,
    );
    expect(screen.getByLabelText("Full Name")).toHaveValue("Jane");
  });

  it("calls onChange as the user types", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(
      <FormField
        id="name"
        label="Full Name"
        value=""
        onChange={handleChange}
      />,
    );

    await user.type(screen.getByLabelText("Full Name"), "J");

    expect(handleChange).toHaveBeenCalled();
  });

  it("does not render an error message by default", () => {
    render(
      <FormField id="name" label="Full Name" value="" onChange={() => {}} />,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders and associates an error message when provided", () => {
    render(
      <FormField
        id="name"
        label="Full Name"
        value=""
        onChange={() => {}}
        error="Full name is required."
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Full name is required.",
    );
    expect(screen.getByLabelText("Full Name")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
