"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
          top: scrolled ? "24px" : "calc(50vh - clamp(200px, 25vw, 300px))",
          left: scrolled ? "24px" : "50%",
          x: scrolled ? "0%" : "-50%",
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
              fontSize: scrolled ? "30px" : "6rem",
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

      {/* Logo in center */}
      <motion.div
        className="fixed z-100 flex justify-center items-center"
        initial={false}
        animate={{
          top: scrolled ? "-100px" : "50vh",
          left: "50%",
          x: "-50%",
          y: "-50%",
          opacity: scrolled ? 0 : 1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        style={{
          pointerEvents: scrolled ? "none" : "auto",
        }}
      >
        <motion.div
          animate={{
            width: scrolled ? "0px" : "clamp(250px, 35vw, 300px)",
            height: scrolled ? "0px" : "clamp(250px, 35vw, 300px)",
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/images/logo.png"
            alt="DreamEarl Logo"
            width={300}
            height={300}
            className="w-full h-full object-contain"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Tagline at bottom */}
      <motion.div
        className="fixed z-100"
        initial={false}
        animate={{
          top: scrolled ? "-100px" : "calc(50vh + clamp(140px, 22vw, 160px))",
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
            fontSize: "clamp(1.125rem, 2vw, 1.4rem)",
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
