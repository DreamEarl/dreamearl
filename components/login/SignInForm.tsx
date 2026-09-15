"use client";

import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import AuthDivider from "./AuthDivider";
import GoogleButton from "./GoogleButton";
import { useSignIn } from "./hooks/useSignIn";
import { useGoogleAuth } from "./hooks/useGoogleAuth";
import { translations } from "@/lib/constants/translations";

export default function SignInForm() {
  const { signIn: signInText } = translations.login;
  const {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    loading,
    error,
    notice,
    signIn,
    sendPasswordReset,
  } = useSignIn();
  const {
    loading: googleLoading,
    error: googleError,
    signInWithGoogle,
  } = useGoogleAuth();

  const feedback = error || googleError;

  return (
    <>
      <form onSubmit={signIn} className="mb-8" aria-label="Sign in">
        <label htmlFor="signin-email" className="sr-only">
          {signInText.emailPlaceholder}
        </label>
        <input
          id="signin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={signInText.emailPlaceholder}
          className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black mb-4"
          autoComplete="email"
          required
        />
        <label htmlFor="signin-password" className="sr-only">
          {signInText.passwordPlaceholder}
        </label>
        <input
          id="signin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={signInText.passwordPlaceholder}
          className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black mb-4"
          autoComplete="current-password"
          required
        />
        <div className="flex items-center justify-between mb-6">
          <label
            htmlFor="remember-me"
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="border-gray-300"
            />
            {signInText.rememberMe}
          </label>
          <button
            id="forgot-password"
            type="button"
            onClick={sendPasswordReset}
            className="text-sm text-gray-700 hover:text-black hover:underline"
          >
            {signInText.forgotPassword}
          </button>
        </div>

        {feedback && (
          <Text
            id="signin-error"
            role="alert"
            variant="caption"
            className="text-center text-red-600 mb-4"
          >
            {feedback}
          </Text>
        )}
        {notice && (
          <Text
            id="signin-notice"
            role="status"
            aria-live="polite"
            variant="caption"
            className="text-center text-green-700 mb-4"
          >
            {notice}
          </Text>
        )}

        <Button
          id="signin-submit"
          variant="primary"
          fullWidth
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? signInText.submitting : signInText.submit}
        </Button>
      </form>

      <AuthDivider />

      <div className="mb-8">
        <GoogleButton loading={googleLoading} onClick={signInWithGoogle} />
      </div>
    </>
  );
}
