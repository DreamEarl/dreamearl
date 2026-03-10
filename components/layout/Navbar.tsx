"use client";

import { UserIcon, CartIcon } from "@/components/ui/icons";
import { useEffect, useState } from "react";
import Link from "next/link";

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

  const showLogo = isHomePage ? scrolled : true;
  const isDark = isHomePage ? scrolled : true;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 transition-all duration-300 ${
        isDark ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      {/* Left Side - Logo */}
      <div className="flex items-center">
        <Link href="/">
          <h1
            className={`text-xl md:text-2xl font-light tracking-[0.3em] transition-all duration-300 ${
              showLogo
                ? "opacity-100 text-black"
                : "opacity-0 pointer-events-none text-white"
            }`}
          >
            DREAMEARL
          </h1>
        </Link>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        {/* User Icon */}
        <button
          className={`hover:opacity-80 transition-all duration-300 ${
            isDark ? "text-black" : "text-white"
          }`}
          aria-label="Account"
        >
          <UserIcon />
        </button>

        {/* Shopping Bag Icon */}
        <button
          className={`hover:opacity-80 transition-all duration-300 ${
            isDark ? "text-black" : "text-white"
          }`}
          aria-label="Shopping Cart"
        >
          <CartIcon />
        </button>
      </div>
    </nav>
  );
}
