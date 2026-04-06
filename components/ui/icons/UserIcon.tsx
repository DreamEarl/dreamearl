import { User } from "lucide-react";

export default function UserIcon({
  className = "w-6 h-6",
}: Readonly<{ className?: string }>) {
  return <User className={className} />;
}
