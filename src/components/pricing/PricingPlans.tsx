"use client";

import PillButton from "@/components/shared/PillButton";
import { FiArrowUpRight, FiCheckCircle } from "react-icons/fi";

export interface Plan {
  name: string;
  price: string;
  features: number;
  popular: boolean;
}

export const plans: Plan[] = [
  { name: "Free", price: "0", features: 5, popular: false },
  { name: "Pro", price: "9", features: 5, popular: true },
  { name: "Enterprise", price: "19", features: 5, popular: false },
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

interface PricingPlansProps {
  /** Marketing site: the CTA is a link. */
  ctaHref?: string;
  /** Dashboard: the CTA is a button that starts a plan change. */
  onSelect?: (plan: Plan) => void;
}

/** Shared by the marketing landing page and the dashboard subscription screen. */
export default function PricingPlans({ ctaHref, onSelect }: PricingPlansProps) {
  return (
    <>
      <div className="mx-auto max-w-sm text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Pricing
        </h2>
        <p className="mt-3 text-sm text-zinc-400">
          Start free, upgrade when you need more
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const ctaIcon = (
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-violet-600">
              <FiArrowUpRight />
            </span>
          );

          return (
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

              <PillButton
                href={onSelect ? undefined : (ctaHref ?? "/signup")}
                onClick={onSelect ? () => onSelect(plan) : undefined}
                icon={ctaIcon}
                aria-label={
                  onSelect
                    ? `Choose the ${plan.name} plan`
                    : `Get started on the ${plan.name} plan`
                }
                className="mt-10 py-2.5! pr-2.5!"
              >
                Get start
              </PillButton>
            </article>
          );
        })}
      </div>
    </>
  );
}
