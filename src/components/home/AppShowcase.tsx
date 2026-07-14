import Image from "next/image";
import type { IconType } from "react-icons";
import {
  FiCamera,
  FiChevronRight,
  FiEdit3,
  FiLayers,
  FiZap,
} from "react-icons/fi";

const steps = [
  {
    tab: "SCAN",
    step: "1",
    title: "Scan",
    body: "Snap a clear photo of your card",
    src: "/assets/straight_phone_one.png",
  },
  {
    tab: "GRADE",
    step: "2",
    title: "GRADE",
    body: "Get AI grade and detailed report",
    src: "/assets/straight_phone_two.png",
  },
  {
    tab: "BRAND",
    step: "3",
    title: "BRAND",
    body: "Add brands, choose label, make it yours",
    src: "/assets/straight_phone_three.png",
  },
  {
    tab: "SLAB",
    step: "4",
    title: "SLAB",
    body: "We print and ship your custom slab to you",
    src: "/assets/straight_phone_four.png",
  },
];

const processCards: {
  Icon: IconType;
  step: string;
  title: string;
  body: string;
}[] = [
  {
    Icon: FiCamera,
    step: "01",
    title: "Scan",
    body: "Snap a clear photo of your card.",
  },
  {
    Icon: FiZap,
    step: "02",
    title: "Grade",
    body: "Get AI grade and detailed report.",
  },
  {
    Icon: FiEdit3,
    step: "03",
    title: "Customize",
    body: "Add your brand, choose your label, make it yours.",
  },
  {
    Icon: FiLayers,
    step: "04",
    title: "Slab",
    body: "We print and ship your custom slab to you.",
  },
];

export default function AppShowcase() {
  return (
    <section className="bg-black px-4 py-20">
      <div className="mx-auto max-w-6xl text-center">
        {/* Heading */}
        <p className="text-sm font-bold tracking-[0.2em] text-white">
          HOW IT WORKS
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
          <span className="text-white">Simple </span>
          <span className="text-violet-400">Process, </span>
          <span className="text-white">Professional </span>
          <span className="text-violet-400">Results.</span>
        </h2>

        {/* Step cards */}
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processCards.map(({ Icon, step, title, body }, i) => (
            <li key={title} className="relative">
              <article className="h-full rounded-2xl border border-violet-500/30 bg-linear-to-b from-violet-950/40 to-black p-5 text-left">
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-xl text-violet-300">
                    <Icon />
                  </span>
                  <span className="text-2xl font-bold text-white/10 tabular-nums">
                    {step}
                  </span>
                </div>
                <h3 className="mt-6 text-base font-medium text-white">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  {body}
                </p>
              </article>
              {i < processCards.length - 1 && (
                <FiChevronRight
                  aria-hidden
                  className="absolute top-1/2 -right-4 hidden -translate-y-1/2 text-violet-500/60 lg:block"
                />
              )}
            </li>
          ))}
        </ol>

        {/* Phone showcase */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.tab} className="relative flex flex-col items-center">
              {i < steps.length - 1 && (
                <FiChevronRight
                  aria-hidden
                  className="absolute top-1/3 -right-4 hidden text-violet-500/60 lg:block"
                />
              )}
              <div className="rounded-3xl border border-violet-500/40 p-2">
                <Image
                  src={s.src}
                  alt={`${s.title} screen`}
                  width={280}
                  height={560}
                  className="h-auto w-full rounded-2xl"
                />
              </div>

              <div className="mt-5 w-full rounded-2xl border border-violet-500/40 bg-linear-to-b from-violet-950/40 to-black p-4 text-left">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-xs font-semibold text-white">
                    {s.step}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {s.title}
                  </span>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
