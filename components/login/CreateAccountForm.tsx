"use client";

import Link from "next/link";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { useCreateAccount } from "./hooks/useCreateAccount";
import { translations } from "@/lib/constants/translations";

export default function CreateAccountForm() {
  const { createAccount: createAccountText } = translations.login;
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    updatesOptIn,
    setUpdatesOptIn,
    agreedToTerms,
    setAgreedToTerms,
    loading,
    error,
    notice,
    createAccount,
  } = useCreateAccount();

  return (
    <form onSubmit={createAccount} className="mb-8" aria-label="Create account">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label htmlFor="create-account-first-name" className="sr-only">
          {createAccountText.firstNamePlaceholder}
        </label>
        <input
          id="create-account-first-name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={createAccountText.firstNamePlaceholder}
          className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
          autoComplete="given-name"
          required
        />
        <label htmlFor="create-account-last-name" className="sr-only">
          {createAccountText.lastNamePlaceholder}
        </label>
        <input
          id="create-account-last-name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder={createAccountText.lastNamePlaceholder}
          className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
          autoComplete="family-name"
          required
        />
      </div>
      <label htmlFor="create-account-email" className="sr-only">
        {createAccountText.emailPlaceholder}
      </label>
      <input
        id="create-account-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={createAccountText.emailPlaceholder}
        className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black mb-4"
        autoComplete="email"
        required
      />
      <label htmlFor="create-account-phone" className="sr-only">
        {createAccountText.phonePlaceholder}
      </label>
      <input
        id="create-account-phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder={createAccountText.phonePlaceholder}
        className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black mb-4"
        autoComplete="tel"
      />
      <label htmlFor="create-account-password" className="sr-only">
        {createAccountText.passwordPlaceholder}
      </label>
      <input
        id="create-account-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={createAccountText.passwordPlaceholder}
        className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black mb-4"
        autoComplete="new-password"
        required
      />

      <label className="flex items-start gap-2 text-sm text-gray-700 mb-3">
        <input
          id="create-account-updates-optin"
          type="checkbox"
          checked={updatesOptIn}
          onChange={(e) => setUpdatesOptIn(e.target.checked)}
          className="mt-1 border-gray-300"
        />
        {createAccountText.updatesOptIn}
      </label>
      <label className="flex items-start gap-2 text-sm text-gray-700 mb-6">
        <input
          id="create-account-agree-terms"
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-1 border-gray-300"
          aria-describedby="create-account-terms-text"
        />
        <span id="create-account-terms-text">
          {createAccountText.agreeToTerms}{" "}
          <Link href="/terms-conditions" className="underline">
            {createAccountText.termsOfService}
          </Link>{" "}
          {createAccountText.andSeparator}{" "}
          <Link href="/privacy-policy" className="underline">
            {createAccountText.privacyPolicy}
          </Link>
        </span>
      </label>

      {error && (
        <Text
          id="create-account-error"
          role="alert"
          variant="caption"
          className="text-center text-red-600 mb-4"
        >
          {error}
        </Text>
      )}
      {notice && (
        <Text
          id="create-account-notice"
          role="status"
          aria-live="polite"
          variant="caption"
          className="text-center text-green-700 mb-4"
        >
          {notice}
        </Text>
      )}

      <Button
        id="create-account-submit"
        variant="primary"
        fullWidth
        type="submit"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? createAccountText.submitting : createAccountText.submit}
      </Button>
    </form>
  );
}
