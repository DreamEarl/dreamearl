import { Phone } from "lucide-react";

export default function PhoneIcon({
  className = "w-5 h-5",
}: Readonly<{ className?: string }>) {
  return <Phone className={className} />;
}
