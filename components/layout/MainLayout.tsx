"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnimatedLogo from "@/components/logo/AnimatedLogo";
import MiniCart from "@/components/cart/MiniCart";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: Readonly<MainLayoutProps>) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      {isHomePage && <AnimatedLogo />}
      <Navbar isHomePage={isHomePage} />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
      <MiniCart />
    </div>
  );
}
