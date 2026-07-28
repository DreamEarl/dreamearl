import Image from "next/image";
import { translations } from "@/lib/constants/translations";

export default function JewelleryCare() {
  const { jewelleryCare } = translations;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full">
        <div className="absolute inset-0">
          <Image
            src={jewelleryCare.hero.backgroundImage}
            alt="DreamEarl pearl piece"
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-serif">
            {jewelleryCare.hero.title}
          </h1>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-700 text-base md:text-lg leading-relaxed font-light">
          {jewelleryCare.intro}
        </p>
      </section>

      <div className="border-t border-gray-200 max-w-7xl mx-auto" />

      {/* Care Sections */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {jewelleryCare.sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <p className="text-xs tracking-[0.3em] text-gray-400 uppercase font-light">
                {section.eyebrow}
              </p>
              <h2 className="text-2xl md:text-3xl font-serif font-light">
                {section.title}
              </h2>
              <div className="w-10 border-t border-gray-900" />
              <p className="text-gray-600 text-base leading-relaxed font-light">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing Note */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <p className="text-xs tracking-[0.3em] text-gray-400 uppercase font-light">
            A Note From Us
          </p>
          <p className="text-xl md:text-2xl font-serif font-light leading-relaxed text-gray-800">
            &ldquo;Each piece leaves our hands with love. We hope it stays with
            you for a lifetime.&rdquo;
          </p>
          <p className="text-sm text-gray-500 font-light">
            — The DreamEarl Team
          </p>
        </div>
      </section>
    </div>
  );
}
