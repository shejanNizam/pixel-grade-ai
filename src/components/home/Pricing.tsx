import Link from "next/link";
import { FiArrowUpRight, FiCheckCircle } from "react-icons/fi";

const plans = [
  { name: "Free", price: "0", features: 5, popular: false },
  { name: "Pro", price: "9", features: 5, popular: true },
  { name: "Enterprise", price: "19", features: 6, popular: false },
];

function Sparkle() {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-500 text-white">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12 2c.5 4.8 2.7 7 7.5 7.5-4.8.5-7 2.7-7.5 7.5-.5-4.8-2.7-7-7.5-7.5C9.3 9 11.5 6.8 12 2Z" />
      </svg>
    </span>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="bg-black px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-sm text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Pricing
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="relative flex flex-col rounded-2xl border border-violet-500/30 bg-linear-to-b from-violet-950/40 to-black p-6"
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-violet-500 px-4 py-1.5 text-xs font-medium whitespace-nowrap text-white">
                  Most popular
                </span>
              )}

              <Sparkle />

              <h3 className="mt-5 text-lg font-medium text-white">
                {plan.name}
              </h3>

              <p className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold text-white">
                  $ {plan.price}
                </span>
                <span className="text-xs text-zinc-500">/per month</span>
              </p>

              <ul className="mt-7 flex-1 space-y-3">
                {Array.from({ length: plan.features }).map((_, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-sm text-zinc-300"
                  >
                    <FiCheckCircle className="shrink-0 text-violet-400" />
                    Add your quote here.
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-violet-500 py-2.5 pr-2.5 pl-6 text-sm font-medium text-white transition-colors hover:bg-violet-600"
              >
                Get start
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-violet-600">
                  <FiArrowUpRight />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
