"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { translations } from "@/lib/constants/translations";

export default function AnimatedLogo() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Brand name at top */}
      <motion.div
        className="fixed z-100"
        initial={false}
        animate={{
          top: scrolled ? "24px" : "20vh",
          left: scrolled ? "24px" : "50%",
          x: scrolled ? "0%" : "-50%",
          y: scrolled ? "0%" : "-50%",
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.8,
        }}
      >
        <Link href="/">
          <motion.h1
            className="font-light font-glacial tracking-[0.3em] whitespace-nowrap"
            animate={{
              fontSize: scrolled
                ? "clamp(1.25rem, 2vw, 1.5rem)"
                : "clamp(3rem, 8vw, 6rem)",
              color: scrolled ? "#000000" : "#ffffff",
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            {translations.common.brand}
          </motion.h1>
        </Link>
      </motion.div>
    </>
  );
}
