"use client";

import { MenuIcon, UserIcon, CartIcon } from "@/components/ui/icons";

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-6 md:px-12">
      {/* Menu Icon */}
      <button
        className="text-white hover:opacity-80 transition-opacity"
        aria-label="Menu"
      >
        <MenuIcon />
      </button>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        {/* User Icon */}
        <button
          className="text-white hover:opacity-80 transition-opacity"
          aria-label="Account"
        >
          <UserIcon />
        </button>

        {/* Shopping Bag Icon */}
        <button
          className="text-white hover:opacity-80 transition-opacity"
          aria-label="Shopping Cart"
        >
          <CartIcon />
        </button>
      </div>
    </nav>
  );
}
