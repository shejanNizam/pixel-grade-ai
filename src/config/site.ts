// ---------------------------------------------------------------------------
// Central site metadata. Change these once and they flow into the SEO
// metadata, sitemap, robots, and web manifest.
// ---------------------------------------------------------------------------
export const siteConfig = {
  name: "PixelGrade AI",
  title: "PixelGrade AI",
  description:
    "PixelGrade AI — AI-powered image analysis and insights. (Replace this description with your own product copy.)",
  // Absolute base URL of the deployed site. Used for canonical/OG URLs,
  // sitemap, and robots. Override via NEXT_PUBLIC_SITE_URL in production.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
