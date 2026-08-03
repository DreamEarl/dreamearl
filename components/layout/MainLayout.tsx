"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnimatedLogo from "@/components/logo/AnimatedLogo";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: Readonly<MainLayoutProps>) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      {isHomePage && <AnimatedLogo />}
      <Navbar isHomePage={isHomePage} />
      {children}
      <Footer />
    </>
  );
}
