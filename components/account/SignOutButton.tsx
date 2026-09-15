"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { translations } from "@/lib/constants/translations";

export default function SignOutButton() {
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
      variant="primary"
      fullWidth
      onClick={handleSignOut}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? account.signingOut : account.signOut}
    </Button>
  );
}
