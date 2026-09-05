interface LegalSection {
  heading?: string;
  paragraphs?: string[];
}

interface LegalPageLayoutProps {
  title: string;
  intro?: string;
  sections?: LegalSection[];
}

export default function LegalPageLayout({
  title,
  intro,
  sections,
}: Readonly<LegalPageLayoutProps>) {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#5f1631] py-10 md:py-14 px-6">
        <h1 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-wide text-center">
          {title}
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-10">
        {intro && (
          <p className="italic text-center text-gray-700 leading-relaxed">
            {intro}
          </p>
        )}

        {sections?.map((section) => (
          <div key={section.heading} className="space-y-3">
            {section.heading && (
              <h2 className="text-center font-bold uppercase tracking-wide text-gray-900">
                {section.heading}
              </h2>
            )}
            <div className="space-y-4">
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph.substring(0, 60)}
                  className="text-gray-700 text-base leading-relaxed font-light"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
