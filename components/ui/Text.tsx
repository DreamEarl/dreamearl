import { ReactNode } from "react";

type TextVariant = "body" | "small" | "muted" | "price" | "label" | "caption";
type TextAs = "p" | "span" | "div";

interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  as?: TextAs;
  className?: string;
}

const variantClasses: Record<TextVariant, string> = {
  body: "text-sm leading-relaxed",
  small: "text-xs tracking-widest text-gray-600",
  muted: "text-sm text-gray-700 leading-relaxed",
  price: "text-2xl",
  label: "text-sm tracking-widest text-gray-700",
  caption: "text-xs text-gray-500 leading-relaxed",
};

export default function Text({
  children,
  variant = "body",
  as: Tag = "p",
  className = "",
}: Readonly<TextProps>) {
  return (
    <Tag className={`${variantClasses[variant]} ${className}`}>{children}</Tag>
  );
}
