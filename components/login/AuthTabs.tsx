"use client";

import { translations } from "@/lib/constants/translations";
import type { AuthTab } from "./types";

interface AuthTabsProps {
  activeTab: AuthTab;
  onChange: (tab: AuthTab) => void;
}

export default function AuthTabs({
  activeTab,
  onChange,
}: Readonly<AuthTabsProps>) {
  const { tabs } = translations.login;

  const tabClass = (tab: AuthTab) =>
    `pb-4 text-base md:text-lg tracking-widest uppercase border-b-2 transition-colors ${
      activeTab === tab
        ? "border-black text-black"
        : "border-transparent text-gray-400 hover:text-gray-600"
    }`;

  return (
    <div
      role="tablist"
      aria-label="Account access"
      className="flex gap-10 border-b border-gray-300 mb-8"
    >
      <button
        id="signin-tab"
        type="button"
        role="tab"
        aria-selected={activeTab === "signIn"}
        aria-controls="signin-panel"
        onClick={() => onChange("signIn")}
        className={tabClass("signIn")}
      >
        {tabs.signIn}
      </button>
      <button
        id="create-account-tab"
        type="button"
        role="tab"
        aria-selected={activeTab === "createAccount"}
        aria-controls="create-account-panel"
        onClick={() => onChange("createAccount")}
        className={tabClass("createAccount")}
      >
        {tabs.createAccount}
      </button>
    </div>
  );
}
