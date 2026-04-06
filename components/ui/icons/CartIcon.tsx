import { ShoppingCart } from "lucide-react";

export default function CartIcon({
  className = "w-6 h-6",
}: Readonly<{ className?: string }>) {
  return <ShoppingCart className={className} />;
}
