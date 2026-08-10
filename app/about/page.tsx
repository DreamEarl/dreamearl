import Image from "next/image";
import { getAboutPage } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/client";
import { translations } from "@/lib/constants/translations";
import Button from "@/components/ui/Button";

// Helper to safely generate image URL from Sanity image source
function safeImageUrl(source: unknown, width: number): string | null {
  if (!source || typeof source !== "object") return null;
  const img = source as Record<string, unknown>;
  if (!img.asset || typeof img.asset !== "object") return null;
  const asset = img.asset as Record<string, unknown>;
  if (!asset._ref && !asset._id) return null;
  try {
    return urlFor(source).width(width).quality(90).url();
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const aboutData = await getAboutPage();

  // Fallback to translations if no Sanity data
  const hero = aboutData?.hero || {
    backgroundImage: translations.about.hero.backgroundImage,
    subtitle: translations.about.hero.subtitle,
    title: translations.about.hero.title,
    description: translations.about.hero.description,
  };

  // Get background image URL
  let backgroundImageUrl = "/images/hero/background.jpeg"; // Default fallback

  if (typeof hero.backgroundImage === "string") {
    backgroundImageUrl = hero.backgroundImage;
  } else if (hero.backgroundImage) {
    backgroundImageUrl =
      safeImageUrl(hero.backgroundImage, 1920) ?? backgroundImageUrl;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen w-full">
        <div className="absolute inset-0">
          <Image
            src={backgroundImageUrl}
            alt="Pearl accessories"
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          {hero.subtitle && (
            <p className="text-white text-sm md:text-base tracking-[0.3em] mb-6 font-light uppercase">
              {hero.subtitle}
            </p>
          )}
          <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-serif mb-8">
            {hero.title}
          </h1>
          <p className="text-white text-lg md:text-xl max-w-3xl leading-relaxed font-light">
            {hero.description}
          </p>
        </div>
      </section>

      {/* Story Section with Image */}
      {safeImageUrl(aboutData?.storySection?.image, 800) && (
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image - Always on Left */}
            <div>
              <div className="relative aspect-3/4 w-full">
                <Image
                  src={safeImageUrl(aboutData!.storySection!.image, 800)!}
                  alt={aboutData!.storySection!.heading}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              {aboutData?.storySection?.eyebrow && (
                <p className="text-sm md:text-base tracking-wider mb-4 uppercase font-light">
                  {aboutData.storySection.eyebrow}
                </p>
              )}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6">
                {aboutData?.storySection?.heading}
              </h2>
              <div className="space-y-4 text-gray-700 text-base md:text-lg leading-relaxed">
                {aboutData?.storySection?.content.map((item) => (
                  <p key={item.paragraph.substring(0, 50)}>{item.paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Philosophy Section */}
      {aboutData?.philosophySection && (
        <section className="py-20 md:py-32 px-6 bg-[#F5F1E8]">
          <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-16">
              {aboutData.philosophySection.eyebrow && (
                <p className="text-sm md:text-base tracking-wider mb-4 uppercase font-light">
                  {aboutData.philosophySection.eyebrow}
                </p>
              )}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight max-w-5xl mx-auto">
                {aboutData.philosophySection.heading}
              </h2>
            </div>

            {/* Value Cards */}
            {aboutData.philosophySection.values &&
              aboutData.philosophySection.values.length > 0 && (
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                  {aboutData.philosophySection.values.map((value) => (
                    <div
                      key={value.title}
                      className="bg-white rounded-3xl p-8 md:p-10 text-center"
                    >
                      <h3 className="text-xl md:text-2xl font-light mb-4">
                        {value.title}
                      </h3>
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </section>
      )}

      {/* CTA Section with Images */}
      {aboutData?.ctaSection && (
        <section className="py-20 md:py-24 px-6 bg-[#F5F1E8]">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Text Content - Always on Left */}
              <div>
                {aboutData.ctaSection.eyebrow && (
                  <p className="text-sm md:text-base tracking-wider mb-4 uppercase font-light">
                    {aboutData.ctaSection.eyebrow}
                  </p>
                )}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6">
                  {aboutData.ctaSection.heading}
                </h2>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">
                  {aboutData.ctaSection.description}
                </p>
                <Button
                  variant="primary"
                  href={aboutData.ctaSection.buttonLink}
                  className="inline-block"
                >
                  {aboutData.ctaSection.buttonText}
                </Button>
              </div>

              {/* Images - diagonally staggered with overlap */}
              <div>
                {aboutData.ctaSection.images &&
                  aboutData.ctaSection.images.length > 0 && (
                    <div className="relative h-[420px] md:h-[480px]">
                      {/* First Image - left, top, on top layer */}
                      {safeImageUrl(aboutData.ctaSection.images[0], 400) && (
                        <div className="absolute top-0 left-0 w-[48%] h-[65%] z-10">
                          <Image
                            src={
                              safeImageUrl(aboutData.ctaSection.images[0], 400)!
                            }
                            alt="Product showcase"
                            fill
                            sizes="(max-width: 768px) 40vw, 20vw"
                            className="object-cover"
                          />
                        </div>
                      )}
                      {/* Second Image - right, bottom, slightly behind */}
                      {safeImageUrl(aboutData.ctaSection.images[1], 600) && (
                        <div className="absolute bottom-0 right-0 w-[48%] h-[65%]">
                          <Image
                            src={
                              safeImageUrl(aboutData.ctaSection.images[1], 600)!
                            }
                            alt="Product showcase"
                            fill
                            sizes="(max-width: 768px) 40vw, 20vw"
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Closing Quote Section */}
      {aboutData?.closingSection && (
        <section className="py-24 md:py-24 px-6 bg-[#F5F1E8]">
          <div className="max-w-5xl mx-auto text-center">
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mb-8">
              {aboutData.closingSection.quote}
            </blockquote>
            {aboutData.closingSection.subtext && (
              <p className="text-base md:text-lg tracking-wider">
                {aboutData.closingSection.subtext}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
