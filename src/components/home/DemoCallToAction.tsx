import Link from "next/link";

export default function DemoCallToAction() {
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto rounded-lg bg-primary px-6 py-14 text-center text-white shadow-lg md:px-10">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold md:text-4xl">
          Ready to customize this landing page?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-blue-50">
          Replace this demo CTA with your launch offer, onboarding prompt, or
          product trial message.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 font-medium text-primary transition hover:bg-blue-50"
          >
            Get Started
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/60 px-8 font-medium text-white transition hover:bg-white/10"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
