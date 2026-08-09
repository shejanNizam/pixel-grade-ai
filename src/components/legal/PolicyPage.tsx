"use client";

import PageBanner from "@/components/shared/PageBanner";
import {
  useGetCmsPageQuery,
  type CmsSlug,
} from "@/redux/features/setting/settingApi";

export interface PolicySection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface PolicyPageProps {
  slug?: CmsSlug;
  title: string;
  intro: string;
  sections: PolicySection[];
}

/**
 * Shared shell for About / Privacy / Terms: fetches dynamic CMS HTML content
 * from the backend API if edited by Admin, or falls back to pre-built sections.
 */
export default function PolicyPage({
  slug,
  title,
  intro,
  sections,
}: PolicyPageProps) {
  const { data, isLoading } = useGetCmsPageQuery(slug!, {
    skip: !slug,
  });

  const dynamicContent = data?.htmlContent?.trim();

  return (
    <main className="bg-black">
      <PageBanner title={title} />

      <div className="mx-auto max-w-4xl px-4 pt-14 pb-24">
        {isLoading ? (
          <div className="h-64 animate-pulse rounded-2xl border border-violet-500/40 bg-zinc-950" />
        ) : dynamicContent ? (
          <div
            className="rounded-2xl border border-violet-500/30 bg-zinc-950 p-6 text-sm leading-relaxed text-zinc-300 [&_a]:text-violet-400 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-violet-500 [&_blockquote]:pl-4 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-white [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: dynamicContent }}
          />
        ) : (
          <>
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
          </>
        )}
      </div>
    </main>
  );
}
