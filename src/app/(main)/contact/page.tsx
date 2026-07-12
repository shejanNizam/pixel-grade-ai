import ContactForm from "@/components/contact/ContactForm";
import PageBanner from "@/components/shared/PageBanner";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with the PixelGrade AI team.",
};

export default function Contact() {
  return (
    <main className="bg-black">
      <PageBanner
        title="Contact us."
        subtitle="We're Here to Support Your Business"
        description="Whether you have questions about our services, need assistance with your account, or would like to discuss a subscription plan, our team is ready to help."
      />

      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Image
            src="/assets/contact_us_image.png"
            alt=""
            width={520}
            height={470}
            className="mx-auto h-auto w-full max-w-sm"
          />

          <div>
            <h2 className="mb-6 text-2xl font-semibold text-violet-500">
              Get in touch
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
