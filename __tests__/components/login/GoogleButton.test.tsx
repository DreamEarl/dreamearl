import { render, screen } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import GoogleButton from "@/components/login/GoogleButton";
import { translations } from "@/lib/constants/translations";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe("GoogleButton", () => {
  const { continueWith, google } = translations.login;
  const label = `${continueWith} ${google}`;

  it("renders the continue with google label", () => {
    render(<GoogleButton loading={false} onClick={jest.fn()} />);
    expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
  });

  it("shows a redirecting label and disables the button while loading", () => {
    render(<GoogleButton loading={true} onClick={jest.fn()} />);
    expect(screen.getByRole("button", { name: label })).toBeDisabled();
    expect(screen.getByText("Redirecting...")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<GoogleButton loading={false} onClick={handleClick} />);

    await user.click(screen.getByRole("button", { name: label }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("marks the logo image as decorative", () => {
    const { container } = render(
      <GoogleButton loading={false} onClick={jest.fn()} />,
    );
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });
});
