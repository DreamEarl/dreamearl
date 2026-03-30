"use client";

import Image from "next/image";
import { translations } from "@/lib/constants/translations";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";

export default function LoginPage() {
  const { login } = translations;

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-md">
        <Heading variant="login" className="mb-3">
          {login.title}
        </Heading>
        <Text variant="muted" className="text-center mb-12">
          {login.subtitle}
        </Text>

        {/* Social Login Buttons */}
        <div className="space-y-4 mb-8">
          <Button variant="social" onClick={() => handleSocialLogin("google")}>
            <Image
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              width={20}
              height={20}
              unoptimized
            />
            {login.continueWith} {login.google}
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <Text variant="caption" as="span" className="px-4 bg-white">
              {login.orDivider}
            </Text>
          </div>
        </div>

        <Button
          variant="primary"
          fullWidth
          href="/shop"
          className="mb-6 block text-center"
        >
          {login.guestCheckout}
        </Button>

        <Button variant="underline" href="/" className="block mb-8">
          {login.returnToStore}
        </Button>

        <Text variant="caption" className="text-center">
          {login.termsText}
        </Text>
      </div>
    </div>
  );
}
