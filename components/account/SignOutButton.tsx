"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { account } = translations;
  const { signOutConfirm } = account;

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/signed-out");
    router.refresh();
  };

  return (
    <>
      <Button
        id="sign-out-button"
        variant={variant}
        fullWidth
        onClick={() => setIsConfirmOpen(true)}
        disabled={loading}
        aria-busy={loading}
        className={className}
      >
        {loading ? account.signingOut : account.signOut}
      </Button>

      <ConfirmDialog
        id="sign-out-confirm-dialog"
        isOpen={isConfirmOpen}
        title={signOutConfirm.title}
        message={signOutConfirm.message}
        cancelLabel={signOutConfirm.cancel}
        confirmLabel={signOutConfirm.confirm}
        isConfirming={loading}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleSignOut}
      />
    </>
  );
}
