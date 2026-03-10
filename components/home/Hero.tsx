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

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.3em] text-center">
          DREAMEARL
        </h1>
      </div>
    </section>
  );
}
