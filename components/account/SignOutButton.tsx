"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { translations } from "@/lib/constants/translations";

interface SignOutButtonProps {
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export default function SignOutButton({
  variant = "primary",
  className = "",
}: Readonly<SignOutButtonProps>) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const { account } = translations;

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <Button
      id="sign-out-button"
      variant={variant}
      fullWidth
      onClick={handleSignOut}
      disabled={loading}
      aria-busy={loading}
      className={className}
    >
      {loading ? account.signingOut : account.signOut}
    </Button>
  );
}
