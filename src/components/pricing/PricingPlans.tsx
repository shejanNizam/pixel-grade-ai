"use client";

import PillButton from "@/components/shared/PillButton";
import { Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiCheckCircle } from "react-icons/fi";

type Billing = "monthly" | "yearly";

/** Yearly is billed up front at 20% off; both figures are shown per month. */
const YEARLY_DISCOUNT = 0.2;

export interface Plan {
  name: string;
  tagline: string;
  price: string;
  features: string[];
  popular: boolean;
}

export const plans: Plan[] = [
  {
    name: "Free",
    tagline: "For hobby collectors",
    price: "0",
    features: [
      "5 card scans per month",
      "AI grade prediction with confidence score",
      "Centering, corner, edge & surface analysis",
      "Watermarked PDF inspection report",
      "Store up to 25 cards in your collection",
    ],
    popular: false,
  },
  {
    name: "Pro",
    tagline: "For serious collectors",
    price: "9",
    features: [
      "200 card scans per month",
      "Live market valuation & price tracking",
      "Investor-ready PDF reports, no watermark",
      "Unlimited collection storage",
      "Priority scan queue & email support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    tagline: "For businesses & shops",
    price: "19",
    features: [
      "Unlimited card scans",
      "Bulk upload & batch grading",
      "API access for storefronts and marketplaces",
      "Team seats with a shared collection",
      "Dedicated support with 24-hour response",
    ],
    popular: false,
  },
];

/** Monthly list price -> what that plan costs per month on the yearly plan. */
function priceFor(plan: Plan, billing: Billing) {
  const monthly = Number(plan.price);
  if (billing === "monthly" || monthly === 0) return plan.price;
  return Math.round(monthly * (1 - YEARLY_DISCOUNT)).toString();
}

/** One line of the feature list. Long copy is clipped to a single line and only
 *  then gets a tooltip — short features would otherwise hover to repeat themselves. */
function FeatureText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [clipped, setClipped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => setClipped(el.scrollWidth > el.clientWidth);
    measure();

    // The cards reflow with the grid, so re-measure on width changes.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  return (
    <Tooltip title={clipped ? text : null}>
      <span ref={ref} className="min-w-0 truncate">
        {text}
      </span>
    </Tooltip>
  );
}

function BillingToggle({
  billing,
  onChange,
}: {
  billing: Billing;
  onChange: (next: Billing) => void;
}) {
  const options: Billing[] = ["monthly", "yearly"];

  return (
    <div className="mt-7 flex items-center justify-center gap-3">
      <div
        role="radiogroup"
        aria-label="Billing period"
        className="inline-flex rounded-full border border-violet-500/30 bg-violet-950/30 p-1"
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={billing === option}
            onClick={() => onChange(option)}
            className={`rounded-full px-5 py-1.5 text-xs font-medium capitalize transition-colors ${
              billing === option
                ? "bg-violet-500 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <span className="rounded-full bg-emerald-500/12 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
        Save up to 20%
      </span>
    </div>
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
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <>
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[10px] tracking-[0.2em] text-zinc-600">PRICING</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Choose <span className="text-violet-400">the plan</span> that fits
          you.
        </h2>

        <BillingToggle billing={billing} onChange={setBilling} />
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
              className={`relative flex flex-col rounded-2xl border bg-linear-to-b from-violet-950/40 to-black p-6 ${
                plan.popular
                  ? "border-violet-500 shadow-[0_0_40px_rgba(139,92,246,0.25)]"
                  : "border-violet-500/30"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-violet-500 px-4 py-1.5 text-xs font-medium whitespace-nowrap text-white">
                  Most popular
                </span>
              )}

              <h3 className="text-lg font-medium text-white">{plan.name}</h3>
              <p className="mt-1 text-xs text-zinc-500">{plan.tagline}</p>

              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold text-white">
                  $ {priceFor(plan, billing)}
                </span>
                <span className="text-xs text-zinc-500">/per month</span>
              </p>

              <ul className="mt-7 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm text-zinc-300"
                  >
                    <FiCheckCircle className="shrink-0 text-violet-400" />
                    <FeatureText text={feature} />
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
                Get Started
              </PillButton>
            </article>
          );
        })}
      </div>
    </>
  );
}
