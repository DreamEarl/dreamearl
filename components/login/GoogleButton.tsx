import Image from "next/image";
import Button from "@/components/ui/Button";
import { translations } from "@/lib/constants/translations";

interface GoogleButtonProps {
  loading: boolean;
  onClick: () => void;
}

export default function GoogleButton({
  loading,
  onClick,
}: Readonly<GoogleButtonProps>) {
  const { continueWith, google } = translations.login;

  return (
    <Button
      id="google-signin-button"
      variant="social"
      onClick={onClick}
      disabled={loading}
      aria-label={`${continueWith} ${google}`}
    >
      <Image
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt=""
        aria-hidden="true"
        width={20}
        height={20}
        unoptimized
      />
      {loading ? "Redirecting..." : `${continueWith} ${google}`}
    </Button>
  );
}
