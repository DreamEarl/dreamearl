import { render, screen, fireEvent } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import CustomOrderPage from "@/app/custom-order/page";
import { translations } from "@/lib/constants/translations";

const { heading, subtitle, form } = translations.customOrder;

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

    it("hides dropzone text after a file is selected", async () => {
      const { container } = render(<CustomOrderPage />);
      const fileInput = container.querySelector(
        "input[type='file']",
      ) as HTMLInputElement;
      const file = new File(["img"], "photo.jpg", { type: "image/jpeg" });
      await userEvent.upload(fileInput, file);
      expect(screen.queryByText(form.dropzone)).not.toBeInTheDocument();
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
