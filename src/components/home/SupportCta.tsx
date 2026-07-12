import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export default function SupportCta() {
  return (
    /* footer_bg.png carries the rounded top and the cross-hatch. It's anchored
       to the top here and to the bottom in <Footer>, so the CTA and the footer
       read as one continuous purple block. */
    <section
      id="contact"
      className="bg-[url('/assets/footer_bg.png')] bg-cover bg-top bg-no-repeat px-4 pt-20 pb-12"
    >
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-violet-400/30 bg-black px-6 py-16 text-center">
        {/* Corner blooms inside the card. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -left-10 h-56 w-56 rounded-full bg-violet-500/40 blur-[70px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -bottom-20 h-56 w-56 rounded-full bg-violet-500/35 blur-[70px]"
        />

        <div className="relative">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Are you need any support
          </h2>

          <Link
            href="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/25 py-2 pr-2 pl-5 text-sm text-white transition-colors hover:bg-white/10"
          >
            Contact us
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/25">
              <FiArrowUpRight />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
