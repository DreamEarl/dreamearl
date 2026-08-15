"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/constants/translations";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";

type PhoneStep = "input" | "otp";

export default function LoginPage() {
  const { login } = translations;

  const disablePhoneFeature = true; // Set to true to disable phone login feature
  const router = useRouter();
  const [phoneStep, setPhoneStep] = useState<PhoneStep>("input");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setError(null);
    setLoadingGoogle(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/`,
      },
    });
    if (error) {
      setError(login.errors.google);
      setLoadingGoogle(false);
    }
  };

  const handleSendOtp = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    const trimmed = phone.trim();
    if (!trimmed.startsWith("+") || trimmed.length < 8) {
      setError(login.phone.invalidPhone);
      return;
    }
    setLoadingPhone(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: trimmed });
    setLoadingPhone(false);
    if (error) {
      setError(login.errors.otpSend);
    } else {
      setPhoneStep("otp");
    }
  };

  const handleVerifyOtp = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    if (otp.length !== 6) {
      setError(login.phone.invalidOtp);
      return;
    }
    setLoadingPhone(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: phone.trim(),
      token: otp,
      type: "sms",
    });
    setLoadingPhone(false);
    if (error) {
      setError(login.errors.otpVerify);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16 md:pt-28 px-6">
      <div className="w-full max-w-md">
        <Heading variant="login" className="mb-3">
          {login.title}
        </Heading>
        <Text variant="muted" className="text-center mb-12">
          {login.subtitle}
        </Text>

        {/* Google */}
        <div className="space-y-4 mb-8">
          <Button
            variant="social"
            onClick={handleGoogleLogin}
            disabled={loadingGoogle}
          >
            <Image
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              width={20}
              height={20}
              unoptimized
            />
            {loadingGoogle
              ? "Redirecting..."
              : `${login.continueWith} ${login.google}`}
          </Button>
        </div>

        {!disablePhoneFeature && (
          <>
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
            {/* Phone OTP */}
            {phoneStep === "input" ? (
              <form onSubmit={handleSendOtp} className="mb-8">
                <label className="block text-xs tracking-widest text-gray-500 uppercase mb-2">
                  {login.phone.label}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={login.phone.placeholder}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black mb-4"
                  autoComplete="tel"
                />
                <Button
                  variant="primary"
                  fullWidth
                  type="submit"
                  disabled={loadingPhone}
                >
                  {loadingPhone ? login.phone.sending : login.phone.sendOtp}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="mb-8">
                <Text variant="caption" className="text-center mb-4">
                  {login.phone.otpSent} {phone.trim()}
                </Text>
                <label className="block text-xs tracking-widest text-gray-500 uppercase mb-2">
                  {login.phone.otpLabel}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder={login.phone.otpPlaceholder}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black mb-4 tracking-widest text-center"
                  autoComplete="one-time-code"
                />
                <Button
                  variant="primary"
                  fullWidth
                  type="submit"
                  disabled={loadingPhone}
                  className="mb-3"
                >
                  {loadingPhone ? login.phone.verifying : login.phone.verify}
                </Button>
                <Button
                  variant="underline"
                  type="button"
                  onClick={() => {
                    setPhoneStep("input");
                    setOtp("");
                    setError(null);
                  }}
                  className="block w-full text-center"
                >
                  {login.phone.changeNumber}
                </Button>
              </form>
            )}

            {error && (
              <Text variant="caption" className="text-center text-red-600 mb-4">
                {error}
              </Text>
            )}
          </>
        )}
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

        <Text variant="caption" className="text-center">
          {login.termsText}
        </Text>
      </div>
    </div>
  );
}
