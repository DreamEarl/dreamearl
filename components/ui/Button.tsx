import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "social"
  | "underline";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  href?: string;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#5f1631] text-white font-light tracking-wide transition-colors active:scale-95 active:brightness-90 transition-transform",
  secondary:
    "bg-white text-black font-light tracking-wide transition-colors active:scale-95 active:brightness-90 transition-transform",
  outline:
    "border-1 border-black bg-white text-black font-light tracking-wide hover:bg-gray-50 transition-colors active:scale-95 active:bg-gray-100 transition-transform",
  ghost:
    "flex items-center gap-2 text-sm tracking-wider hover:text-gray-600 transition-colors active:scale-95 transition-transform",
  social:
    "w-full border-2 border-gray-300 text-gray-900 font-light tracking-wide hover:border-gray-400 transition-colors flex items-center justify-center gap-3 active:scale-95 active:bg-gray-50 transition-transform",
  underline:
    "text-sm text-center text-gray-600 hover:text-gray-900 transition-colors underline active:opacity-60 transition-opacity",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "py-3 px-6 text-sm",
  md: "py-4 px-6",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  href,
  className = "",
  ...props
}: Readonly<ButtonProps>) {
  const isGhostOrUnderline = variant === "ghost" || variant === "underline";
  const combinedClasses = [
    variantClasses[variant],
    isGhostOrUnderline ? "" : sizeClasses[size],
    fullWidth && !isGhostOrUnderline ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
