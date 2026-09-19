import PolicyPage from "@/components/legal/PolicyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | PixelGrade",
  description: "Terms and conditions governing use of the PixelGrade platform.",
};

export default function Terms() {
  return (
    <PolicyPage
      slug="terms"
      title="Terms & Conditions"
      effectiveDate="September 2026"
      sections={[
        {
          heading: "1. Acceptance of Terms",
          paragraphs: [
            "By accessing or using PixelGrade, users agree to these Terms & Conditions and any policies referenced within them. If a user does not agree, they should not use the platform.",
          ],
        },
        {
          heading: "2. PixelGrade Service",
          paragraphs: [
            "PixelGrade provides tools that may identify, analyze, estimate the condition or grade of, organize, personalize, and create reports or labels for trading cards. PixelGrade may also offer subscriptions, physical card holders or slabs, imaging hardware, shipping, and related services.",
          ],
        },
        {
          heading: "3. Grading Estimates and Condition Reports",
          paragraphs: [
            "PixelGrade grading results, condition reports, confidence scores, card identification, market information, and similar outputs are estimates generated from the information and images available to the platform. Results are not guaranteed to match PSA, BGS, CGC, TAG, or any other third-party grading company. Different grading companies, buyers, sellers, or collectors may reach different conclusions about the same card.",
          ],
        },
        {
          heading: "4. No Guarantee of Card Value",
          paragraphs: [
            "PixelGrade does not guarantee the authenticity, market value, resale value, future value, or saleability of any trading card. Pricing, comparable sales, or market information shown on the platform is informational and may change over time.",
          ],
        },
        {
          heading: "5. User Responsibility",
          paragraphs: [
            "Users are responsible for providing accurate information and clear, complete card images. Users should independently evaluate a card before making purchasing, selling, insurance, or other financial decisions. Users are also responsible for content, names, brands, logos, or other materials they submit for personalized labels or profiles.",
          ],
        },
        {
          heading: "6. Accounts and Acceptable Use",
          paragraphs: [
            "Users are responsible for maintaining the confidentiality of their account credentials and for activity under their accounts. Users may not misuse the platform, interfere with its operation, attempt unauthorized access, upload unlawful or infringing content, manipulate grading or marketplace information, or use PixelGrade for fraudulent activity.",
          ],
        },
        {
          heading: "7. Intellectual Property",
          paragraphs: [
            "PixelGrade's software, branding, interfaces, designs, reports, platform technology, and other proprietary materials are owned by or licensed to PixelGrade and are protected by applicable intellectual-property laws. Users retain rights in content they own, subject to the permissions necessary for PixelGrade to provide the requested services.",
          ],
        },
        {
          heading: "8. Personalized Labels and User Content",
          paragraphs: [
            "By submitting names, logos, images, or other content for a personalized label or profile, the user represents that they have the necessary rights to use that content. PixelGrade may refuse or remove content that appears unlawful, misleading, infringing, abusive, or otherwise inappropriate.",
          ],
        },
        {
          heading: "9. Subscriptions and Payments",
          paragraphs: [
            "Paid plans, products, and services are billed at the prices shown at checkout or on the applicable pricing page. Subscription features, usage limits, and pricing may vary by plan and may be updated from time to time. Any renewal, cancellation, refund, or trial terms presented during checkout or account management will apply to the applicable purchase.",
          ],
        },
        {
          heading: "10. Physical Products, Shipping, and Fulfillment",
          paragraphs: [
            "Physical products and slab orders are subject to availability, production, shipping, and fulfillment timelines. Shipping estimates are not guarantees. Users are responsible for providing accurate delivery information. Additional policies shown during checkout may apply.",
          ],
        },
        {
          heading: "11. Third-Party Services",
          paragraphs: [
            "PixelGrade may integrate with or rely on third-party services, including payment processors, shipping providers, hosting providers, card-data sources, analytics services, and other technology providers. PixelGrade is not responsible for independent third-party services outside its control.",
          ],
        },
        {
          heading: "12. Service Availability and Changes",
          paragraphs: [
            "We may modify, update, suspend, or discontinue features of PixelGrade as the platform develops. We do not guarantee that every feature will always be available or error-free.",
          ],
        },
        {
          heading: "13. Disclaimer of Warranties",
          paragraphs: [
            "To the extent permitted by law, PixelGrade is provided on an 'as is' and 'as available' basis without warranties of any kind, whether express or implied. We do not warrant that grading estimates, reports, card data, market information, or other outputs will be error-free or suitable for a particular purpose.",
          ],
        },
        {
          heading: "14. Limitation of Liability",
          paragraphs: [
            "To the extent permitted by applicable law, PixelGrade and its owners, affiliates, employees, contractors, and service providers will not be liable for indirect, incidental, special, consequential, or punitive damages arising from use of the platform, reliance on grading estimates or reports, transactions involving cards, or use of third-party services.",
          ],
        },
        {
          heading: "15. Changes to These Terms",
          paragraphs: [
            "We may update these Terms & Conditions from time to time. Continued use of PixelGrade after updated terms are posted constitutes acceptance of the revised terms to the extent permitted by law.",
          ],
        },
        {
          heading: "16. Contact",
          paragraphs: [
            "Questions regarding these Terms & Conditions can be sent to admin@pixelgradeai.com.",
          ],
        },
      ]}
    />
  );
}
