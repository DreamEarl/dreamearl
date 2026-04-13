import { Mail } from "lucide-react";

export default function MailIcon({
  className = "w-5 h-5",
}: Readonly<{ className?: string }>) {
  return <Mail className={className} />;
}
