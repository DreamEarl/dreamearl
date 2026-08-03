"use client";

import Image from "next/image";
import { translations } from "@/lib/constants/translations";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen sm:h-[150vh] w-full bg-[#e8e5e0]">
      {/* Background Image */}
      <div id="hero-bg" className="absolute inset-0">
        <Image
          src="/images/hero/background.jpeg"
          alt="Pearl handbag hero image"
          fill
          sizes="100vw"
          className="object-cover"
          priority
          quality={100}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Logo in center */}
      <div
        id="hero-logo"
        className="absolute z-10 flex justify-center items-center top-[28%] sm:top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{
            width: "clamp(160px, 38vw, 300px)",
            height: "clamp(160px, 38vw, 300px)",
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
        </div>
      </div>

      {/* Tagline at bottom */}
      <div
        id="hero-tagline"
        className="absolute z-10 w-[90vw] sm:w-auto [top:calc(28%+clamp(90px,22vw,160px))] sm:[top:calc(35%+clamp(90px,22vw,160px))] left-1/2 -translate-x-1/2"
      >
        <p
          className="tracking-[0.15em] sm:tracking-[0.2em] text-white text-center"
          style={{
            fontSize: "clamp(1.2rem, 2.5vw, 1.4rem)",
          }}
        >
          {translations.hero.tagline}
        </p>
      </div>

      {/* CTA Buttons */}
      <div
        id="hero-cta"
        className="absolute z-10 flex flex-col sm:flex-row gap-4 justify-center bottom-8 sm:bottom-auto sm:[top:calc(70%_+_clamp(100px,28vw,240px))]"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(90vw, 30rem)",
        }}
      >
        <Button
          variant="primary"
          href="/shop"
          className="w-full sm:flex-1 whitespace-nowrap text-center"
        >
          {translations.hero.exploreCollection}
        </Button>
        <Button
          variant="outline"
          href="/about"
          className="w-full sm:flex-1 whitespace-nowrap text-center"
        >
          {translations.hero.ourStory}
        </Button>
      </div>
    </section>
  );
}
