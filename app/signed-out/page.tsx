import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { translations } from "@/lib/constants/translations";

export default function SignedOutPage() {
  const { signedOut } = translations.account;

  return (
    <div
      id="signed-out-page"
      className="min-h-screen bg-white flex flex-col md:flex-row"
    >
      <div
        id="signed-out-page-image"
        className="relative w-full h-64 md:h-auto md:w-1/2"
      >
        <Image
          src="/images/hero/background.jpeg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div
        id="signed-out-page-content"
        className="flex-1 flex flex-col justify-center px-6 py-16 md:px-20"
      >
        <Text
          id="signed-out-page-eyebrow"
          variant="small"
          className="uppercase mb-4"
        >
          {signedOut.eyebrow}
        </Text>
        <Heading
          id="signed-out-page-title"
          variant="login"
          className="!text-left mb-5"
        >
          {signedOut.title}
        </Heading>
        <div className="w-10 h-px bg-[#5f1631] mb-6" />
        <Text
          id="signed-out-page-subtitle"
          variant="small"
          className="uppercase mb-8"
        >
          {signedOut.subtitle}
        </Text>

        <div
          id="signed-out-page-actions"
          className="flex flex-col gap-3 w-full max-w-xs"
        >
          <Button id="signed-out-page-sign-in" variant="primary" href="/login">
            {signedOut.signIn}
          </Button>
          <Button id="signed-out-page-explore" variant="outline" href="/shop">
            {signedOut.explore}
          </Button>
        </div>
      </div>
    </div>
  );
}
