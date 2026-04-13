"use client";

import { useEffect } from "react";
import { CloseIcon } from "@/components/ui/icons";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SidePanel({
  isOpen,
  onClose,
  children,
}: Readonly<SidePanelProps>) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };

      globalThis.addEventListener("keydown", handleEscape);

      return () => {
        document.body.style.overflow = "unset";
        globalThis.removeEventListener("keydown", handleEscape);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-40" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-125 bg-white z-2000 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 flex items-center justify-center"
          aria-label="Close panel"
        >
          <CloseIcon />
        </button>

        {/* Content */}
        <div className="h-full overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
