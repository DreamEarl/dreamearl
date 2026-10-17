import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import CustomOrderPage from "@/app/custom-order/page";
import { translations } from "@/lib/constants/translations";

const { heading, subtitle, form } = translations.customOrder;

const mockGetUser = jest.fn();
const mockOnAuthStateChange = jest.fn();

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: (...args: unknown[]) => mockGetUser(...args),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args),
    },
  }),
}));

beforeEach(() => {
  mockGetUser.mockResolvedValue({ data: { user: null } });
  mockOnAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: jest.fn() } },
  });
});

const PRODUCT_TYPES = [
  "Necklace",
  "Bracelet",
  "Earrings",
  "Ring",
  "Anklet",
  "Hair Accessory",
  "Other",
];

describe("Custom Order Page", () => {
  describe("Rendering", () => {
    it("renders the page heading", () => {
      render(<CustomOrderPage />);
      expect(
        screen.getByRole("heading", { name: heading }),
      ).toBeInTheDocument();
    });

    it("renders the subtitle", () => {
      render(<CustomOrderPage />);
      expect(screen.getByText(subtitle)).toBeInTheDocument();
    });

    it("renders the Inspiration Image label", () => {
      render(<CustomOrderPage />);
      expect(screen.getByText(form.inspirationImage)).toBeInTheDocument();
    });

    it("renders the dropzone hint text", () => {
      render(<CustomOrderPage />);
      expect(screen.getByText(form.dropzone)).toBeInTheDocument();
      expect(screen.getByText(form.dropzoneHint)).toBeInTheDocument();
    });

    it("renders the file input accepting png and jpeg", () => {
      const { container } = render(<CustomOrderPage />);
      const fileInput = container.querySelector("input[type='file']");
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute("accept", "image/png,image/jpeg");
    });

    it("renders Full Name field", () => {
      render(<CustomOrderPage />);
      expect(screen.getByLabelText(form.fullName)).toBeInTheDocument();
    });

    it("renders Email Address field", () => {
      render(<CustomOrderPage />);
      expect(screen.getByLabelText(form.email)).toBeInTheDocument();
    });

    it("renders Phone Number field", () => {
      render(<CustomOrderPage />);
      expect(screen.getByLabelText(form.phone)).toBeInTheDocument();
    });

    it("renders Product Type select", () => {
      render(<CustomOrderPage />);
      expect(screen.getByLabelText(form.productType)).toBeInTheDocument();
    });

    it("renders Custom Requirements textarea", () => {
      render(<CustomOrderPage />);
      expect(screen.getByLabelText(form.requirements)).toBeInTheDocument();
    });

    it("renders Submit button", () => {
      render(<CustomOrderPage />);
      expect(
        screen.getByRole("button", { name: form.submit }),
      ).toBeInTheDocument();
    });

    it("renders submit note text", () => {
      render(<CustomOrderPage />);
      expect(screen.getByText(form.submitNote)).toBeInTheDocument();
    });
  });

  describe("Input types", () => {
    it("email input has type email", () => {
      render(<CustomOrderPage />);
      expect(screen.getByLabelText(form.email)).toHaveAttribute(
        "type",
        "email",
      );
    });

    it("phone input has type tel", () => {
      render(<CustomOrderPage />);
      expect(screen.getByLabelText(form.phone)).toHaveAttribute("type", "tel");
    });

    it("full name input is required", () => {
      render(<CustomOrderPage />);
      expect(screen.getByLabelText(form.fullName)).toBeRequired();
    });

    it("email input is required", () => {
      render(<CustomOrderPage />);
      expect(screen.getByLabelText(form.email)).toBeRequired();
    });

    it("submit button has type submit", () => {
      render(<CustomOrderPage />);
      expect(screen.getByRole("button", { name: form.submit })).toHaveAttribute(
        "type",
        "submit",
      );
    });
  });

  describe("Product Type dropdown", () => {
    it("renders all product type options", () => {
      render(<CustomOrderPage />);
      const select = screen.getByLabelText(form.productType);
      PRODUCT_TYPES.forEach((type) => {
        expect(select).toContainElement(
          screen.getByRole("option", { name: type }),
        );
      });
    });

    it("renders placeholder option as disabled", () => {
      render(<CustomOrderPage />);
      const placeholder = screen.getByRole("option", {
        name: form.productTypePlaceholder,
      });
      expect(placeholder).toBeDisabled();
    });
  });

  describe("File upload interaction", () => {
    it("shows file name after a valid file is selected", async () => {
      const { container } = render(<CustomOrderPage />);
      const fileInput = container.querySelector(
        "input[type='file']",
      ) as HTMLInputElement;
      const file = new File(["img"], "inspiration.png", { type: "image/png" });
      await userEvent.upload(fileInput, file);
      expect(screen.getByText("inspiration.png")).toBeInTheDocument();
    });

    it("still shows the dropzone after a file is selected, to allow adding more", async () => {
      const { container } = render(<CustomOrderPage />);
      const fileInput = container.querySelector(
        "input[type='file']",
      ) as HTMLInputElement;
      const file = new File(["img"], "photo.jpg", { type: "image/jpeg" });
      await userEvent.upload(fileInput, file);
      expect(screen.getByText(form.dropzone)).toBeInTheDocument();
    });

    it("disables the dropzone once the max image count is reached", async () => {
      const { container } = render(<CustomOrderPage />);
      const fileInput = container.querySelector(
        "input[type='file']",
      ) as HTMLInputElement;
      const files = Array.from(
        { length: 5 },
        (_, i) => new File(["img"], `photo-${i}.jpg`, { type: "image/jpeg" }),
      );
      await userEvent.upload(fileInput, files);
      expect(fileInput).toBeDisabled();
    });
  });

  describe("Form submission", () => {
    it("does not throw on submit", async () => {
      render(<CustomOrderPage />);
      const form_ = screen
        .getByRole("button", { name: form.submit })
        .closest("form")!;
      fireEvent.submit(form_);
    });

    it("sends signed-out requests by email without opening WhatsApp", async () => {
      const fetchMock = jest
        .spyOn(global, "fetch")
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        } as Response);
      const openMock = jest.spyOn(window, "open").mockImplementation(() => null);
      render(<CustomOrderPage />);

      await userEvent.type(screen.getByLabelText(form.fullName), "Jane Doe");
      await userEvent.type(
        screen.getByLabelText(form.email),
        "jane@example.com",
      );
      await userEvent.type(
        screen.getByLabelText(form.phone),
        "+919876543210",
      );
      await userEvent.click(screen.getByRole("button", { name: form.submit }));

      await waitFor(() => {
        expect(screen.getByRole("status")).toHaveTextContent(
          "Your custom request has been sent.",
        );
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/send-order",
        expect.objectContaining({ method: "POST" }),
      );
      expect(openMock).not.toHaveBeenCalled();
      fetchMock.mockRestore();
      openMock.mockRestore();
    });

    it("records signed-in requests through the custom request API and emails them", async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: "user-1",
            email: "jane@example.com",
            phone: "+919876543210",
            user_metadata: { first_name: "Jane", last_name: "Doe" },
          },
        },
      });
      const fetchMock = jest
        .spyOn(global, "fetch")
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ customRequest: { id: "request-1" } }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        } as Response);
      render(<CustomOrderPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(form.fullName)).toHaveValue("Jane Doe");
      });
      await userEvent.click(screen.getByRole("button", { name: "Edit" }));
      await userEvent.type(
        screen.getByLabelText(form.requirements),
        "Pearl necklace",
      );
      await userEvent.click(screen.getByRole("button", { name: form.submit }));

      await waitFor(() => {
        expect(screen.getByRole("status")).toHaveTextContent(
          "Your custom request has been sent.",
        );
      });
      expect(fetchMock).toHaveBeenNthCalledWith(
        1,
        "/api/custom-requests",
        expect.objectContaining({ method: "POST" }),
      );
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        "/api/send-order",
        expect.objectContaining({ method: "POST" }),
      );
      fetchMock.mockRestore();
    });
  });

  describe("Account prefill", () => {
    const signedInUser = {
      id: "user-1",
      email: "jane@example.com",
      phone: "+919876543210",
      user_metadata: { first_name: "Jane", last_name: "Doe" },
    };

    it("prefills and greys out contact fields for a signed-in user with account details", async () => {
      mockGetUser.mockResolvedValue({ data: { user: signedInUser } });
      render(<CustomOrderPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(form.fullName)).toHaveValue("Jane Doe");
      });
      expect(screen.getByLabelText(form.email)).toHaveValue("jane@example.com");
      expect(screen.getByLabelText(form.phone)).toHaveValue("+919876543210");
      expect(screen.getByLabelText(form.fullName)).toBeDisabled();
      expect(screen.getByLabelText(form.email)).toBeDisabled();
      expect(screen.getByLabelText(form.phone)).toBeDisabled();
      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    });

    it("unlocks the contact fields when Edit is clicked", async () => {
      mockGetUser.mockResolvedValue({ data: { user: signedInUser } });
      render(<CustomOrderPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(form.fullName)).toBeDisabled();
      });
      expect(screen.queryByText("Auto-filled from your account")).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole("button", { name: "Edit" }));

      expect(screen.getByLabelText(form.fullName)).toBeEnabled();
      expect(screen.getByLabelText(form.email)).toBeEnabled();
      expect(screen.getByLabelText(form.phone)).toBeEnabled();
      expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
      await userEvent.clear(screen.getByLabelText(form.fullName));
      await userEvent.type(screen.getByLabelText(form.fullName), "Jane Smith");
      expect(screen.getByLabelText(form.fullName)).toHaveValue("Jane Smith");
      await userEvent.click(screen.getByRole("button", { name: "Done" }));
      expect(screen.getByLabelText(form.fullName)).toBeDisabled();
    });

    it("does not lock contact fields for a signed-in user with no account details", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-2", email: null, user_metadata: {} } },
      });
      render(<CustomOrderPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(form.fullName)).toBeEnabled();
      });
      expect(
        screen.queryByRole("button", { name: "Edit" }),
      ).not.toBeInTheDocument();
    });

    it("leaves contact fields editable for a signed-out visitor", () => {
      render(<CustomOrderPage />);
      expect(screen.getByLabelText(form.fullName)).toBeEnabled();
      expect(
        screen.queryByRole("button", { name: "Edit" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Placeholders", () => {
    it("full name input has correct placeholder", () => {
      render(<CustomOrderPage />);
      expect(screen.getByLabelText(form.fullName)).toHaveAttribute(
        "placeholder",
        form.fullNamePlaceholder,
      );
    });

    it("email input has correct placeholder", () => {
      render(<CustomOrderPage />);
      expect(screen.getByLabelText(form.email)).toHaveAttribute(
        "placeholder",
        form.emailPlaceholder,
      );
    });

    it("phone input has correct placeholder", () => {
      render(<CustomOrderPage />);
      expect(screen.getByLabelText(form.phone)).toHaveAttribute(
        "placeholder",
        form.phonePlaceholder,
      );
    });

    it("requirements textarea has correct placeholder", () => {
      render(<CustomOrderPage />);
      expect(screen.getByLabelText(form.requirements)).toHaveAttribute(
        "placeholder",
        form.requirementsPlaceholder,
      );
    });
  });
});
