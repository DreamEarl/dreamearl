import { render, screen } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import ProductDetailClient from "@/app/products/[slug]/ProductDetailClient";
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
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />;
  },
}));

const singleImageProduct = {
  brand: "DREAMEARL",
  name: "Pearl Stud Earrings",
  price: 2500,
  currency: "Rs.",
  images: ["/image1.jpg"],
  details: {
    product: "Earrings",
    craftTechnique: "Hand-knotted",
    pearlType: "Freshwater",
    pearlColour: "White",
    size: "8mm",
  },
  note: "Handcrafted with care",
  careInstructions: "Store in a dry place",
  shippingInfo: "Ships in 3-5 days",
  packagingInfo: "Gift wrapped",
};

const multiImageProduct = {
  ...singleImageProduct,
  images: ["/image1.jpg", "/image2.jpg", "/image3.jpg"],
};

describe("ProductDetailClient Component", () => {
  describe("Product Information", () => {
    it("renders product brand", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(screen.getByText("DREAMEARL")).toBeInTheDocument();
    });

    it("renders product name", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(screen.getByText("Pearl Stud Earrings")).toBeInTheDocument();
    });

    it("renders product price with currency", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(screen.getByText("Rs. 2,500")).toBeInTheDocument();
    });

    it("renders Add to Cart button", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(
        screen.getByText(translations.product.addToCart),
      ).toBeInTheDocument();
    });

    it("renders Buy Now button", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(screen.getByText(translations.product.buyNow)).toBeInTheDocument();
    });
  });

  describe("Product Details", () => {
    it("renders product type label", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(
        screen.getByText(translations.product.labels.product),
      ).toBeInTheDocument();
    });

    it("renders product type value", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(screen.getByText("Earrings")).toBeInTheDocument();
    });

    it("renders craft technique", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(screen.getByText("Hand-knotted")).toBeInTheDocument();
    });

    it("renders pearl type", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(screen.getByText("Freshwater")).toBeInTheDocument();
    });

    it("renders pearl colour", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(screen.getByText("White")).toBeInTheDocument();
    });

    it("renders size", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(screen.getByText("8mm")).toBeInTheDocument();
    });

    it("renders note", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(screen.getByText("Handcrafted with care")).toBeInTheDocument();
    });
  });

  describe("Image Carousel - Single Image", () => {
    it("renders the product image", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(
        screen.getByAltText("Pearl Stud Earrings – image 1"),
      ).toBeInTheDocument();
    });

    it("does not render navigation buttons for a single image", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(screen.queryByLabelText("Previous image")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Next image")).not.toBeInTheDocument();
    });
  });

  describe("Image Carousel - Multiple Images", () => {
    it("renders navigation buttons when multiple images exist", () => {
      render(<ProductDetailClient product={multiImageProduct} />);
      expect(screen.getByLabelText("Previous image")).toBeInTheDocument();
      expect(screen.getByLabelText("Next image")).toBeInTheDocument();
    });

    it("renders dot indicators for each image", () => {
      render(<ProductDetailClient product={multiImageProduct} />);
      const dots = screen.getAllByLabelText(/Go to image/);
      expect(dots).toHaveLength(3);
    });

    it("renders thumbnail buttons for each image", () => {
      render(<ProductDetailClient product={multiImageProduct} />);
      const thumbs = screen.getAllByLabelText(/View image/);
      expect(thumbs).toHaveLength(3);
    });

    it("clicking next shows the next image", async () => {
      const user = userEvent.setup();
      render(<ProductDetailClient product={multiImageProduct} />);
      const nextBtn = screen.getByLabelText("Next image");
      await user.click(nextBtn);
      expect(
        screen.getByAltText("Pearl Stud Earrings – image 2"),
      ).toBeInTheDocument();
    });

    it("clicking previous wraps around to the last image", async () => {
      const user = userEvent.setup();
      render(<ProductDetailClient product={multiImageProduct} />);
      const prevBtn = screen.getByLabelText("Previous image");
      await user.click(prevBtn);
      expect(
        screen.getByAltText("Pearl Stud Earrings – image 3"),
      ).toBeInTheDocument();
    });
  });

  describe("Collapsible Sections", () => {
    it("renders Care Instructions section button", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(
        screen.getByText(translations.productSections.careInstructions.title),
      ).toBeInTheDocument();
    });

    it("renders Shipping Information section button", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(
        screen.getByText(
          translations.productSections.shippingInformation.title,
        ),
      ).toBeInTheDocument();
    });

    it("renders Packaging Information section button", () => {
      render(<ProductDetailClient product={singleImageProduct} />);
      expect(
        screen.getByText(
          translations.productSections.packagingInformation.title,
        ),
      ).toBeInTheDocument();
    });

    it("expands a section when clicked", async () => {
      const user = userEvent.setup();
      render(<ProductDetailClient product={singleImageProduct} />);
      const careButton = screen.getByText(
        translations.productSections.careInstructions.title,
      );
      await user.click(careButton);
      expect(screen.getByText("Store in a dry place")).toBeInTheDocument();
    });

    it("collapses a section when clicked again", async () => {
      const user = userEvent.setup();
      render(<ProductDetailClient product={singleImageProduct} />);
      const careButton = screen.getByText(
        translations.productSections.careInstructions.title,
      );
      await user.click(careButton);
      await user.click(careButton);
      expect(
        screen.queryByText("Store in a dry place"),
      ).not.toBeInTheDocument();
    });

    it("does not render a section whose content is empty", () => {
      render(
        <ProductDetailClient
          product={{ ...singleImageProduct, packagingInfo: "" }}
        />,
      );
      expect(
        screen.queryByText(
          translations.productSections.packagingInformation.title,
        ),
      ).not.toBeInTheDocument();
    });
  });
});
