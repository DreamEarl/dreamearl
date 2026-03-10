"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/background.jpeg"
          alt="Pearl handbag hero image"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <h1
          className={`text-white text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.3em] text-center transition-all duration-300 ${
            scrolled ? "opacity-0 -translate-y-5" : "opacity-100 translate-y-0"
          }`}
        >
          DREAMEARL
        </h1>
      </div>
    </section>
  );
}
