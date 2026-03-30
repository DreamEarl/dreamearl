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
      <motion.div
        className="fixed z-100"
        initial={false}
        animate={{
          top: scrolled ? "24px" : "50vh",
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
            className="font-light tracking-[0.3em] whitespace-nowrap"
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

      {/* Tagline that disappears on scroll */}
      <motion.div
        className="fixed z-100"
        initial={false}
        animate={{
          top: "calc(50vh + 2.5rem)",
          left: "50%",
          x: "-50%",
          opacity: scrolled ? 0 : 1,
        }}
        transition={{
          opacity: {
            duration: 0.3,
            ease: "easeInOut",
          },
        }}
        style={{
          pointerEvents: scrolled ? "none" : "auto",
        }}
      >
        <motion.p
          className="tracking-[0.2em] text-white text-center whitespace-nowrap"
          animate={{
            fontSize: "clamp(0.875rem, 1.5vw, 1.25rem)",
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          {translations.hero.tagline}
        </motion.p>
      </motion.div>
    </>
  );
}
