import PixelScopeHero from "@/components/pixelscope/PixelScopeHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PixelScope Digital Magnifier | 10X-15X UV & White LED Magnifier",
  description:
    "Inspect trading cards, coins, stamps, and electronics in high detail with PixelScope Digital Magnifier. Features 10X-15X magnification, 2.1-inch IPS screen, dual white & UV LED lighting, 750mAh rechargeable battery, and USB PC output.",
  openGraph: {
    title: "PixelScope Digital Magnifier - $69.99",
    description:
      "Inspect cards and collectibles in stunning detail with 10X-15X magnification, white & UV lighting, and built-in screen.",
    url: "https://pixelgrade.ai/pixelscope",
    siteName: "PixelGrade AI",
    images: [
      {
        url: "/assets/pixelscope/hero.jpg",
        width: 1200,
        height: 1200,
        alt: "PixelScope Digital Magnifier",
      },
    ],
    type: "website",
  },
};

export default function PixelScopePage() {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: "PixelScope Digital Magnifier",
    image: ["https://pixelgrade.ai/assets/pixelscope/hero.jpg"],
    description:
      "Portable handheld electronic digital magnifier with 10X-15X magnification, 2.1 inch IPS color screen, dual white and UV LED lights, and rechargeable battery.",
    brand: {
      "@type": "Brand",
      name: "PixelGrade LEODAS",
    },
    offers: {
      "@type": "Offer",
      url: "https://pixelgrade.ai/pixelscope",
      priceCurrency: "USD",
      price: "69.99",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "126",
    },
  };

  return (
    <main id="top" className="min-h-screen bg-black text-white selection:bg-purple-600 selection:text-white">
      {/* Product JSON-LD Structured Data for E-Commerce SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PixelScopeHero />
    </main>
  );
}
