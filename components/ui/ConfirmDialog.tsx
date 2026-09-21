"use client";

import { useEffect } from "react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

interface ConfirmDialogProps {
  id: string;
  isOpen: boolean;
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  isConfirming?: boolean;
}

export default function ConfirmDialog({
  id,
  isOpen,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  isConfirming = false,
}: Readonly<ConfirmDialogProps>) {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    globalThis.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      globalThis.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      <div
        id={`${id}-backdrop`}
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        id={`${id}-card`}
        className="relative bg-white w-full max-w-md p-10 text-center"
      >
        <Heading id={`${id}-title`} variant="login" className="mb-3">
          {title}
        </Heading>
        <div className="w-10 h-px bg-[#5f1631] mx-auto mb-5" />
        <Text id={`${id}-message`} variant="muted" className="mb-8">
          {message}
        </Text>
        <div className="flex gap-4">
          <Button
            id={`${id}-cancel`}
            variant="outline"
            fullWidth
            onClick={onCancel}
            disabled={isConfirming}
          >
            {cancelLabel}
          </Button>
          <Button
            id={`${id}-confirm`}
            variant="primary"
            fullWidth
            onClick={onConfirm}
            disabled={isConfirming}
            aria-busy={isConfirming}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
