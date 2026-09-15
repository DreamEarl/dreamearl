"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { translations } from "@/lib/constants/translations";

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });
    if (error) {
      setError(translations.login.errors.google);
      setLoading(false);
    }
  };

  return { loading, error, signInWithGoogle };
}
