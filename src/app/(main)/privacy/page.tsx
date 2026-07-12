import PolicyPage from "@/components/legal/PolicyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How PixelGrade AI collects, uses, and protects your data.",
};

/* Placeholder copy — have a lawyer review this before launch. */
export default function Privacy() {
  return (
    <PolicyPage
      title="Privacy policy"
      intro="We value your privacy and are committed to protecting your personal information. We collect data such as your name, email, and card images only when you need it, and only to run the service you signed up for."
      sections={[
        {
          heading: "How We Use Your Information",
          paragraphs: ["Your personal data is used to:"],
          bullets: [
            "Create your account and keep you signed in",
            "Run AI analysis on the card images you upload",
            "Respond to your enquiries and support requests",
            "Send relevant service and product notifications",
          ],
        },
        {
          heading: "How We Share Your Information",
          paragraphs: [
            "We do not sell your personal information. We share data with third parties only where it is needed to deliver the service — for example, the infrastructure providers that host the app and process images — and those providers are bound to use it for nothing else.",
          ],
        },
        {
          heading: "Cookies and Tracking",
          paragraphs: [
            "We use cookies to keep you signed in, remember your preferences, and understand how the site is used. You can block cookies in your browser, but parts of the app may stop working if you do.",
          ],
        },
        {
          heading: "Your Rights",
          paragraphs: [
            "You have the right to access, update, or delete the personal information we hold about you. You can also ask us to stop processing it. Contact us and we will act on your request.",
          ],
        },
        {
          heading: "Changes to This Privacy Policy",
          paragraphs: [
            "We may update this policy from time to time. Any changes will be posted on this page, with an updated date.",
          ],
        },
        {
          heading: "Contact Us",
          paragraphs: [
            "For any questions about this policy or your data, reach out to us through our contact page.",
          ],
        },
      ]}
    />
  );
}
