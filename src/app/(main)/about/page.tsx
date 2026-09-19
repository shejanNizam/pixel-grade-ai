import PolicyPage from "@/components/legal/PolicyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | PixelGrade",
  description: "Learn more about PixelGrade.",
};

export default function About() {
  return (
    <PolicyPage
      slug="about"
      title="Welcome to PixelGrade"
      intro="PixelGrade is a next-generation self-grading platform for trading cards. Built for collectors and card businesses, our platform lets users analyze their cards, receive detailed condition reports and grade estimates, and create personalized grading labels — all without sending their cards away."
      sections={[
        {
          heading: "What We Do",
          paragraphs: [
            "PixelGrade analyzes trading cards across four core grading areas:",
          ],
          bullets: [
            "Centering — Analysis of front and back card alignment.",
            "Corners — Inspection for rounding, wear, and damaged corners.",
            "Edges — Analysis for whitening, chipping, and edge wear.",
            "Surface — Detection of scratches, print lines, surface wear, and other visible defects.",
          ],
        },
        {
          heading: "Why Collectors Choose PixelGrade",
          paragraphs: [
            "Whether you're evaluating a card, managing your collection, or creating your own personalized grading label, PixelGrade puts the grading experience in your hands.",
          ],
          bullets: [
            "Instant Grading — Receive an estimated grade and condition analysis in seconds.",
            "Detailed Condition Reports — Review individual grading categories, subgrades, and confidence scores.",
            "Personalized Grading Labels — Create grading labels featuring your own name or brand.",
            "Physical Slabs — Turn your grade into a professional protective card holder without sending your card away.",
            "Market Pricing — Track card values and market information directly through PixelGrade.",
          ],
        },
        {
          heading: "Mission Statement",
          paragraphs: [
            '"Our mission is to put grading in the hands of collectors by making card analysis faster, more accessible, and more personalized."',
          ],
        },
        {
          heading: "Contact & Support",
          paragraphs: [
            "Have questions, feedback, or need help with your account? Contact our support team anytime at admin@pixelgradeai.com or visit our Contact Us page.",
          ],
        },
      ]}
    />
  );
}
