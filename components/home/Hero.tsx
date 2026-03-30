"use client";

import Image from "next/image";

export default function Hero() {
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
    </section>
  );
}
