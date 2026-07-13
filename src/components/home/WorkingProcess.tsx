import type { IconType } from "react-icons";
import {
  FiCamera,
  FiChevronRight,
  FiEdit3,
  FiLayers,
  FiZap,
} from "react-icons/fi";

const steps: { Icon: IconType; step: string; title: string; body: string }[] = [
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

export default function WorkingProcess() {
  return (
    <section id="working-process" className="bg-black px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-[10px] tracking-[0.2em] text-zinc-600">
            HOW IT WORKS
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Simple process. Professional results.
          </h2>
        </div>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ Icon, step, title, body }, i) => (
            <li key={title} className="relative">
              <article className="h-full rounded-2xl border border-violet-500/30 bg-linear-to-b from-violet-950/40 to-black p-5">
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-xl text-violet-300">
                    <Icon />
                  </span>
                  <span className="text-2xl font-bold text-white/8 tabular-nums">
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

              {/* Connector between cards, as in the design. */}
              {i < steps.length - 1 && (
                <FiChevronRight
                  aria-hidden
                  className="absolute top-1/2 -right-4 hidden -translate-y-1/2 text-violet-500/60 lg:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
