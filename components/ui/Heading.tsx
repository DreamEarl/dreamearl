import { ReactNode } from "react";

type HeadingVariant =
  | "page"
  | "section"
  | "product"
  | "cart"
  | "login"
  | "category"
  | "card"
  | "footer-brand"
  | "footer-section";

interface HeadingConfig {
  tag: "h1" | "h2" | "h3" | "h4";
  className: string;
}

interface HeadingProps {
  children: ReactNode;
  variant: HeadingVariant;
  className?: string;
}

const variantConfig: Record<HeadingVariant, HeadingConfig> = {
  page: {
    tag: "h1",
    className: "text-4xl md:text-5xl font-light tracking-wider",
  },
  section: {
    tag: "h2",
    className: "text-3xl md:text-4xl font-light text-center tracking-wide",
  },
  product: {
    tag: "h1",
    className: "text-3xl md:text-4xl font-light tracking-wide",
  },
  cart: {
    tag: "h1",
    className: "text-xl md:text-2xl font-light tracking-wide",
  },
  login: {
    tag: "h1",
    className: "text-3xl md:text-4xl font-light tracking-wide text-center",
  },
  category: {
    tag: "h3",
    className:
      "text-white text-xl md:text-2xl font-light tracking-[0.2em] text-center",
  },
  card: {
    tag: "h3",
    className:
      "text-base font-light tracking-wide hover:text-gray-600 transition-colors",
  },
  "footer-brand": {
    tag: "h3",
    className: "text-2xl font-light tracking-[0.3em]",
  },
  "footer-section": {
    tag: "h4",
    className: "text-sm font-medium tracking-wider",
  },
};

export default function Heading({
  children,
  variant,
  className = "",
}: Readonly<HeadingProps>) {
  const { tag: Tag, className: variantClass } = variantConfig[variant];
  return <Tag className={`${variantClass} ${className}`}>{children}</Tag>;
}
