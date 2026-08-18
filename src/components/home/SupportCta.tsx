import PillButton from "@/components/shared/PillButton";
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
            Need Support?
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Our team is here to help.
          </p>

          <PillButton
            href="/contact"
            variant="outline"
            icon={
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/25">
                <FiArrowUpRight />
              </span>
            }
            className="mt-7 py-2! pr-2!"
          >
            Contact us
          </PillButton>
        </div>
      </div>
    </section>
  );
}
