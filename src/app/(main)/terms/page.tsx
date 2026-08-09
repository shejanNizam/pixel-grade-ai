import PolicyPage from "@/components/legal/PolicyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description: "The terms that govern your use of PixelGrade AI.",
};

/* Placeholder copy — have a lawyer review this before launch. */
export default function Terms() {
  return (
    <PolicyPage
      slug="terms"
      title="Terms and conditions"
      intro="These terms govern your use of PixelGrade AI. By creating an account or using the service, you agree to them. If you do not agree, please do not use the service."
      sections={[
        {
          heading: "Using the Service",
          paragraphs: ["When you use PixelGrade AI, you agree to:"],
          bullets: [
            "Provide accurate account information and keep it current",
            "Upload only images you own or have the right to use",
            "Not attempt to disrupt, reverse-engineer, or abuse the service",
            "Not resell or redistribute our reports as your own certification",
          ],
        },
        {
          heading: "AI Grades Are Estimates",
          paragraphs: [
            "Grades, condition breakdowns, and market valuations produced by PixelGrade AI are automated estimates, provided with a confidence score. They are not an official certification and are not a substitute for professional grading. You are responsible for any buying, selling, or submission decision you make on the basis of a report.",
          ],
        },
        {
          heading: "Accounts and Subscriptions",
          paragraphs: [
            "You are responsible for activity under your account and for keeping your password secure. Subscriptions are charged in advance and include a monthly scan allowance that resets each billing period.",
          ],
        },
        {
          heading: "Your Content",
          paragraphs: [
            "You keep ownership of the images you upload. You grant us the limited licence needed to process them, produce your report, and operate the service.",
          ],
        },
        {
          heading: "Changes to These Terms",
          paragraphs: [
            "We may update these terms from time to time. Continued use of the service after a change means you accept the updated terms.",
          ],
        },
        {
          heading: "Contact Us",
          paragraphs: [
            "For any questions about these terms, reach out to us through our contact page.",
          ],
        },
      ]}
    />
  );
}
