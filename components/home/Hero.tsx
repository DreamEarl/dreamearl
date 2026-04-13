"use client";

import Image from "next/image";
import { translations } from "@/lib/constants/translations";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative h-[150vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
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
        className="absolute z-10 flex justify-center items-center"
        style={{
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            width: "clamp(250px, 35vw, 300px)",
            height: "clamp(250px, 35vw, 300px)",
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
        className="absolute z-10"
        style={{
          top: "calc(35% + clamp(140px, 22vw, 160px))",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <p
          className="font-semibold tracking-[0.2em] text-white text-center whitespace-nowrap"
          style={{
            fontSize: "clamp(1.125rem, 2vw, 1.4rem)",
          }}
        >
          {translations.hero.tagline}
        </p>
      </div>

      {/* CTA Buttons */}
      <div
        className="absolute z-10 flex gap-4 justify-center w-120"
        style={{
          top: "calc(70% + clamp(200px, 28vw, 240px))",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Button
          variant="primary"
          href="/shop"
          className="flex-1 whitespace-nowrap text-center"
        >
          {translations.hero.exploreCollection}
        </Button>
        <Button
          variant="outline"
          href="/about"
          className="flex-1 whitespace-nowrap text-center"
        >
          {translations.hero.ourStory}
        </Button>
      </div>
    </section>
  );
}
