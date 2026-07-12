import PageBanner from "@/components/shared/PageBanner";

export interface PolicySection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface PolicyPageProps {
  title: string;
  intro: string;
  sections: PolicySection[];
}

/**
 * Shared shell for About / Privacy / Terms: a gradient title band over the
 * marketing navbar, then a single readable column of prose.
 */
export default function PolicyPage({
  title,
  intro,
  sections,
}: PolicyPageProps) {
  return (
    <main className="bg-black">
      <PageBanner title={title} />

      <div className="mx-auto max-w-4xl px-4 pt-14 pb-24">
        <p className="text-sm leading-relaxed text-zinc-400">{intro}</p>

        <div className="mt-10 space-y-10">
          {sections.map((section, i) => (
            <section key={section.heading ?? i}>
              {section.heading && (
                <h2 className="mb-3 text-sm font-semibold text-white">
                  {section.heading}
                </h2>
              )}

              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mb-3 text-sm leading-relaxed text-zinc-400"
                >
                  {paragraph}
                </p>
              ))}

              {section.bullets && (
                <ul className="mt-2 space-y-1.5">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2.5 text-sm leading-relaxed text-zinc-400"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-400"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
