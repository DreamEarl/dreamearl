"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import AuthTabs from "@/components/login/AuthTabs";
import SignInForm from "@/components/login/SignInForm";
import CreateAccountForm from "@/components/login/CreateAccountForm";
import type { AuthTab } from "@/components/login/types";
import { translations } from "@/lib/constants/translations";

export default function LoginPage() {
  const { login } = translations;
  const [activeTab, setActiveTab] = useState<AuthTab>("signIn");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-md">
        <AuthTabs activeTab={activeTab} onChange={setActiveTab} />

        <div
          id={activeTab === "signIn" ? "signin-panel" : "create-account-panel"}
          role="tabpanel"
          aria-labelledby={
            activeTab === "signIn" ? "signin-tab" : "create-account-tab"
          }
        >
          {activeTab === "signIn" ? <SignInForm /> : <CreateAccountForm />}
        </div>

        <Button
          id="guest-checkout"
          variant="underline"
          href="/shop"
          className="block w-full text-center"
        >
          {login.guestCheckout}
        </Button>
      </div>
    </div>
  );
}
