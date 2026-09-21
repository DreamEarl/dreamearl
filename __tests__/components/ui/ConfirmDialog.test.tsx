import { render, screen } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const baseProps = {
  id: "test-confirm-dialog",
  title: "Sign out of your account?",
  message: "Are you sure you want to sign out?",
  cancelLabel: "Cancel",
  confirmLabel: "Signout",
};

describe("ConfirmDialog", () => {
  it("renders nothing when closed", () => {
    render(
      <ConfirmDialog
        {...baseProps}
        isOpen={false}
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );
    expect(screen.queryByText(baseProps.title)).not.toBeInTheDocument();
  });

  it("renders the title, message and actions when open", () => {
    render(
      <ConfirmDialog
        {...baseProps}
        isOpen
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );
    expect(screen.getByText(baseProps.title)).toBeInTheDocument();
    expect(screen.getByText(baseProps.message)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: baseProps.cancelLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: baseProps.confirmLabel }),
    ).toBeInTheDocument();
  });

  it("calls onCancel when the Cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    render(
      <ConfirmDialog
        {...baseProps}
        isOpen
        onCancel={onCancel}
        onConfirm={jest.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: baseProps.cancelLabel }),
    );
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when the confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    render(
      <ConfirmDialog
        {...baseProps}
        isOpen
        onCancel={jest.fn()}
        onConfirm={onConfirm}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: baseProps.confirmLabel }),
    );
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    render(
      <ConfirmDialog
        {...baseProps}
        isOpen
        onCancel={onCancel}
        onConfirm={jest.fn()}
      />,
    );

    await user.click(document.getElementById(`${baseProps.id}-backdrop`)!);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when the Escape key is pressed", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    render(
      <ConfirmDialog
        {...baseProps}
        isOpen
        onCancel={onCancel}
        onConfirm={jest.fn()}
      />,
    );

    await user.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("disables the actions while confirming", () => {
    render(
      <ConfirmDialog
        {...baseProps}
        isOpen
        isConfirming
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: baseProps.cancelLabel }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: baseProps.confirmLabel }),
    ).toBeDisabled();
  });
});
