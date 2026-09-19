import PolicyPage from "@/components/legal/PolicyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PixelGrade",
  description: "How PixelGrade collects, uses, and protects your data.",
};

export default function Privacy() {
  return (
    <PolicyPage
      slug="privacy"
      title="Privacy Policy"
      effectiveDate="September 2026"
      sections={[
        {
          heading: "1. Information We Collect",
          paragraphs: [
            "PixelGrade may collect information that users provide directly, including name, email address, account information, shipping and billing information, support messages, and other information submitted through the platform. We may also collect card images, card information, grading reports, labels, collection data, and other content users upload or create while using PixelGrade.",
          ],
        },
        {
          heading: "2. Card Images and Grading Data",
          paragraphs: [
            "When users upload or scan trading cards, PixelGrade may process the images and related card information to provide identification, grading estimates, condition analysis, reports, personalized labels, collection features, and related services. We may retain relevant card and grading data to operate, secure, improve, and develop PixelGrade's services and grading technology, subject to applicable law and our data practices.",
          ],
        },
        {
          heading: "3. Automatically Collected Information",
          paragraphs: [
            "We may automatically collect technical and usage information such as IP address, browser type, device information, pages visited, actions taken within the platform, timestamps, and similar analytics or diagnostic information.",
          ],
        },
        {
          heading: "4. How We Use Information",
          paragraphs: [
            "We may use information to provide and maintain the PixelGrade platform; process card analyses and grading reports; create personalized labels and slab orders; manage accounts and subscriptions; process payments and shipping; provide customer support; improve product performance and user experience; detect fraud or misuse; communicate service updates; and comply with legal obligations.",
          ],
        },
        {
          heading: "5. Payments and Third-Party Services",
          paragraphs: [
            "PixelGrade may use third-party providers for services such as payment processing, shipping, hosting, analytics, storage, and other infrastructure. These providers may process information as necessary to perform services on our behalf and are subject to their own terms and privacy practices.",
          ],
        },
        {
          heading: "6. Sharing of Information",
          paragraphs: [
            "We do not sell personal information to advertisers. We may share information with service providers that help us operate PixelGrade, when a user directs us to share information, in connection with a business transaction, or when required to comply with law, protect rights, prevent fraud, or maintain the security of the platform.",
          ],
        },
        {
          heading: "7. Public Profiles and Shared Content",
          paragraphs: [
            "Certain PixelGrade features may allow users to create public profiles, grading reports, labels, QR-linked pages, collections, or other content. Information a user chooses to make public may be visible to other users or anyone with access to the relevant link or QR code.",
          ],
        },
        {
          heading: "8. Data Retention and Security",
          paragraphs: [
            "We retain information for as long as reasonably necessary to provide the services, maintain business and legal records, resolve disputes, enforce agreements, and meet legal obligations. We use reasonable administrative, technical, and organizational safeguards, but no system can guarantee absolute security.",
          ],
        },
        {
          heading: "9. User Choices and Requests",
          paragraphs: [
            "Users may update certain account information through their account settings. Where required by applicable law, users may also have rights to request access, correction, deletion, or other actions relating to their personal information. Requests may be sent to admin@pixelgradeai.com.",
          ],
        },
        {
          heading: "10. Children's Privacy",
          paragraphs: [
            "PixelGrade is not intended for children under 13, and we do not knowingly collect personal information from children under 13. If we learn that such information has been collected, we will take reasonable steps to delete it.",
          ],
        },
        {
          heading: "11. Changes to This Policy",
          paragraphs: [
            "We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised effective date.",
          ],
        },
        {
          heading: "12. Contact",
          paragraphs: [
            "Questions about this Privacy Policy or privacy requests can be sent to admin@pixelgradeai.com.",
          ],
        },
      ]}
    />
  );
}
