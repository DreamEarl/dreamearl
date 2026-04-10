"use client";

import Link from "next/link";
import { UserIcon, CartIcon } from "@/components/ui/icons";
import { useEffect, useState } from "react";
import { translations } from "@/lib/constants/translations";

interface NavbarProps {
  isHomePage?: boolean;
}

export default function Navbar({ isHomePage = false }: Readonly<NavbarProps>) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const isDark = isHomePage ? scrolled : true;
  const showLogo = !isHomePage;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 transition-all duration-300 ${
        isDark ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center w-48">
        {showLogo && (
          <Link
            href="/"
            className="font-glacial font-semibold tracking-[0.3em] text-[30px] whitespace-nowrap text-black hover:opacity-70 transition-opacity"
          >
            {translations.common.brand}
          </Link>
        )}
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        {/* User Icon */}
        <Link
          href="/login"
          className={`hover:opacity-80 transition-all duration-300 ${
            isDark ? "text-black" : "text-white"
          }`}
          aria-label="Account"
        >
          <UserIcon />
        </Link>

        {/* Shopping Bag Icon */}
        <Link
          href="/cart"
          className={`hover:opacity-80 transition-all duration-300 ${
            isDark ? "text-black" : "text-white"
          }`}
          aria-label="Shopping Cart"
        >
          <CartIcon />
        </Link>
      </div>
    </nav>
  );
}
