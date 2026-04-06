import { Menu } from "lucide-react";

export default function MenuIcon({
  className = "w-6 h-6",
}: Readonly<{ className?: string }>) {
  return <Menu className={className} />;
}
