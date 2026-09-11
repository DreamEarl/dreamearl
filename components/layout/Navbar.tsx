"use client";

import Link from "next/link";
import { UserIcon, CartIcon } from "@/components/ui/icons";
import { useEffect, useState } from "react";
import { translations } from "@/lib/constants/translations";
import SidePanel from "@/components/ui/SidePanel";
import ContactUs from "@/components/layout/ContactUs";
import { useCart } from "@/lib/cart/CartContext";

interface NavbarProps {
  isHomePage?: boolean;
}

export default function Navbar({ isHomePage = false }: Readonly<NavbarProps>) {
  const [scrolled, setScrolled] = useState(false);
  const [isContactPanelOpen, setIsContactPanelOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setCartBump(true);
    const t = setTimeout(() => setCartBump(false), 500);
    return () => clearTimeout(t);
  }, [itemCount]);

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
    <>
      <nav
        id="navbar"
        className={`${isHomePage ? "fixed" : "sticky"} top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 transition-all duration-300 ${
          isDark ? "bg-white shadow-sm" : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <div id="navbar-logo" className="flex items-center w-48">
          {showLogo && (
            <Link
              href="/"
              className="font-glacial font-light tracking-[0.3em] text-[30px] whitespace-nowrap text-black hover:opacity-70 transition-opacity"
            >
              {translations.common.brand}
            </Link>
          )}
        </div>

        {/* Right Icons */}
        <div id="navbar-actions" className="flex items-center gap-6">
          <button
            id="navbar-contact-btn"
            type="button"
            onClick={() => setIsContactPanelOpen(true)}
            className={`hidden md:inline text-md hover:opacity-80 transition-opacity cursor-pointer ${
              isDark ? "text-gray-700" : "text-white"
            }`}
          >
            Contact Us
          </button>
          {/* User Icon */}
          <Link
            id="navbar-account-link"
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
            id="navbar-cart-link"
            href="/cart"
            className={`relative hover:opacity-80 transition-all duration-300 ${
              isDark ? "text-black" : "text-white"
            }`}
            aria-label="Shopping Cart"
          >
            <CartIcon />
            {mounted && itemCount > 0 && (
              <span
                className={`absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center leading-none ${
                  cartBump ? "animate-cart-bounce" : ""
                }`}
              >
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Contact Us Side Panel */}
      <SidePanel
        isOpen={isContactPanelOpen}
        onClose={() => setIsContactPanelOpen(false)}
      >
        <ContactUs />
      </SidePanel>
    </>
  );
}
