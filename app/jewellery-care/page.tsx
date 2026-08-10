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
          <h1 className="text-white text-3xl md:text-4xl lg:text-4xl font-semibold">
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
            <div key={section.title} className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">
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

      {/* Metal Care */}
      <section className="max-w-7xl mx-auto px-6 pb-16 md:pb-24">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-base font-bold text-gray-900">
            {jewelleryCare.metalCare.title}
          </h2>
          <p className="text-gray-600 text-base leading-relaxed font-light">
            {jewelleryCare.metalCare.intro}
          </p>
          <p className="text-gray-600 text-base leading-relaxed font-light">
            {jewelleryCare.metalCare.subheading}
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 text-base leading-relaxed font-light">
            {jewelleryCare.metalCare.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing Note */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-xl font-bold text-gray-900">
            {jewelleryCare.closingNote.title}
          </h2>
          <p className="text-gray-600 text-base leading-relaxed font-light">
            {jewelleryCare.closingNote.body}
          </p>
          <p className="text-gray-900 text-base font-bold">
            {jewelleryCare.closingNote.tagline}
          </p>
        </div>
      </section>
    </div>
  );
}
