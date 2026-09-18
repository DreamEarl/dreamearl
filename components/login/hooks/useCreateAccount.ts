"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { translations } from "@/lib/constants/translations";

export function useCreateAccount() {
  const router = useRouter();
  const supabase = createClient();
  const { errors, success } = translations.login;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [updatesOptIn, setUpdatesOptIn] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const createAccount = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!agreedToTerms) {
      setError(errors.termsRequired);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone,
          updates_opt_in: updatesOptIn,
        },
      },
    });
    setLoading(false);
    if (error) {
      setError(errors.signUp);
      return;
    }
    // A session is already present when email confirmation is disabled
    if (data.session) {
      router.push("/account");
      return;
    }
    setNotice(success.signUpConfirm);
    resetForm();
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setUpdatesOptIn(false);
    setAgreedToTerms(false);
  };

  return {
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
  };
}
