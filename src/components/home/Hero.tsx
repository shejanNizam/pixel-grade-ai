import PillButton from "@/components/shared/PillButton";
import Image from "next/image";
import type { IconType } from "react-icons";
import { FiArrowRight, FiClock, FiCpu, FiLock, FiPlay } from "react-icons/fi";

const highlights: { Icon: IconType; title: string; body: string }[] = [
  { Icon: FiCpu, title: "AI Accurate", body: "Advanced Vision AI" },
  { Icon: FiClock, title: "Instant Results", body: "In Seconds" },
  { Icon: FiLock, title: "Yours to Keep", body: "Never Leaves Your Hands" },
];

/** The graded-slab render, lit from behind so it reads against the black page. */
function SlabPreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-violet-600/40 blur-[90px]"
      />

      <Image
        src="/assets/sight_phone_img.png"
        alt="A Charizard EX card in a PixelGrade slab, graded MINT 10"
        width={403}
        height={656}
        priority
        className="h-auto w-full drop-shadow-[0_0_60px_rgba(139,92,246,0.35)]"
      />
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-black px-4 pt-28 pb-24"
    >
      {/* Purple bloom spilling down from behind the navbar. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-64 left-1/2 h-168 w-280 -translate-x-1/2 rounded-full bg-violet-600/35 blur-[140px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/50 bg-violet-500/10 px-4 py-1.5 text-[11px] font-medium tracking-wide text-violet-200">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400" />
            AI-POWERED CARD GRADING
          </span>

          <h1 className="mt-6 text-4xl leading-[1.1] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            YOUR <span className="text-violet-400">CARDS,</span>
            <br />
            YOUR <span className="text-violet-400">GRADE,</span>
            <br />
            YOUR <span className="text-violet-400">SLABS.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-zinc-400 lg:mx-0">
            PixelGrade AI gives collectors instant, AI-powered grading reports
            and lets you create your own custom slab labels.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <PillButton
              href="/signup"
              size="md"
              icon={<FiArrowRight className="text-base" />}
            >
              Get Started Free
            </PillButton>
            <PillButton
              href="/#working-process"
              size="md"
              variant="outline"
              icon={<FiPlay className="text-xs" />}
            >
              See How It Works
            </PillButton>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4">
            {highlights.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex items-center gap-2.5 text-left max-lg:flex-col max-lg:text-center"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                  <Icon size={15} />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium text-white">{title}</dt>
                  <dd className="mt-0.5 text-[11px] text-zinc-500">{body}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/8 pt-6 sm:flex-row lg:justify-start">
            <p className="text-[10px] tracking-[0.15em] text-zinc-600">
              TRUSTED BY COLLECTORS WORLDWIDE
            </p>

            <div className="flex items-center gap-3">
              {/* Avatar stack: initials until real collector photos exist. */}
              <div aria-hidden className="flex -space-x-2">
                {["A", "M", "K", "R"].map((initial) => (
                  <span
                    key={initial}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-linear-to-br from-violet-500 to-cyan-400 text-[10px] font-semibold text-white"
                  >
                    {initial}
                  </span>
                ))}
              </div>

              <p className="text-xs font-semibold text-white">
                25K+
                <span className="ml-1.5 font-normal text-zinc-500">
                  Collectors &amp; Growing
                </span>
              </p>
            </div>
          </div>
        </div>

        <SlabPreview />
      </div>
    </section>
  );
}
