"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { translations } from "@/lib/constants/translations";

export function useSignIn() {
  const router = useRouter();
  const supabase = createClient();
  const { errors, success } = translations.login;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const signIn = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(errors.signIn);
      return;
    }
    router.push("/account");
  };

  const sendPasswordReset = async () => {
    setError(null);
    setNotice(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError(errors.emailRequired);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: `${window.location.origin}/auth/callback?next=/login`,
    });
    setLoading(false);
    if (error) {
      setError(errors.forgotPassword);
    } else {
      setNotice(success.forgotPassword);
    }
  };

  return {
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
  };
}
