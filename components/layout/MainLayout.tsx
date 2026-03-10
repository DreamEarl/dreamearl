"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: Readonly<MainLayoutProps>) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      <Navbar isHomePage={isHomePage} />
      {children}
      <Footer />
    </>
  );
}
