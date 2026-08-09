import PolicyPage from "@/components/legal/PolicyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about PixelGrade AI.",
};

/* Placeholder copy — replace with your own before launch. */
export default function About() {
  return (
    <PolicyPage
      slug="about"
      title="About Us."
      intro="PixelGrade AI gives collectors an instant, AI-powered read on the cards they own. Upload a front and a back photo and get a grade prediction, a condition breakdown, and a market valuation in seconds — no envelope, no waiting weeks for a verdict."
      sections={[
        {
          heading: "What we do",
          paragraphs: [
            "Our Vision AI inspects the four things graders look at — centering, corners, edges, and surface — and returns a PSA-style estimate with a confidence score. You get a professional, investor-ready report you can download, keep, or share with a buyer.",
          ],
          bullets: [
            "Predict a grade before you pay for one",
            "Spot scratches, whitening, chipping, and print defects",
            "Track what your collection is worth over time",
            "Turn a graded card into a custom slab with your own brand",
          ],
        },
        {
          heading: "Who it's for",
          paragraphs: [
            "Collectors deciding whether a card is worth submitting. Sellers who need to show condition honestly. Investors watching a portfolio move. Anyone who has ever guessed at a grade and wished they hadn't.",
          ],
        },
        {
          heading: "How we work",
          paragraphs: [
            "An AI estimate is a tool, not an authority. We show you a confidence score alongside every grade so you know how much to trust it, and we never claim to replace official certification. The decision stays yours.",
          ],
        },
        {
          heading: "Contact Us",
          paragraphs: [
            "Questions about the product, a report, or your account? Reach us through the contact page and we'll get back to you.",
          ],
        },
      ]}
    />
  );
}
