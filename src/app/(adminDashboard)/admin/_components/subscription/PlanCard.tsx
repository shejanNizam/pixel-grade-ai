import { formatCredits } from "@/config/plans";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import type { Plan } from "./data";

interface PlanCardProps {
  plan: Plan;
  onEdit: () => void;
}

export default function PlanCard({ plan, onEdit }: PlanCardProps) {
  const included = plan.facilities.filter(
    (facility) => facility.included && facility.text.trim(),
  );

  // Mirror the customer-facing card: show the effective yearly rate and the
  // real up-front annual charge alongside the monthly price.
  const paid = plan.price > 0;
  const billedYearly = plan.priceYearly * 12;

  return (
    <article className="flex flex-col rounded-3xl border border-violet-500/40 bg-linear-to-b from-violet-950/30 to-black p-6">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white">
        <HiOutlineSparkles size={18} />
      </span>

      <h3 className="mt-5 text-sm text-white">{plan.name}</h3>

      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold text-white tabular-nums">
          $ {plan.price}
        </span>
        <span className="text-xs text-zinc-500">/per month</span>
      </p>

      {/* Yearly breakdown — reserve the line on Free so cards stay aligned. */}
      <p className="mt-1 min-h-4 text-[11px] text-zinc-400">
        {paid ? (
          <>
            ${plan.priceYearly}/mo yearly ·{" "}
            <span className="text-zinc-500">${billedYearly} billed yearly</span>
          </>
        ) : (
          " "
        )}
      </p>

      {/* The metered terms, kept out of the facility copy so they stay
          machine-readable rather than buried in marketing text. */}
      <dl className="mt-4 flex flex-wrap gap-2">
        <div className="rounded-full border border-white/15 px-3 py-1">
          <dt className="sr-only">Credits included</dt>
          <dd className="text-[11px] text-zinc-300">
            {formatCredits(plan.credits, plan.creditInterval)}
          </dd>
        </div>
        <div className="rounded-full border border-white/15 px-3 py-1">
          <dt className="sr-only">Renews every</dt>
          <dd className="text-[11px] text-zinc-300">{plan.expiry}</dd>
        </div>
        <div
          className={`rounded-full border px-3 py-1 ${
            plan.pixelscope ? "border-violet-500/40" : "border-white/15"
          }`}
        >
          <dt className="sr-only">PixelScope</dt>
          <dd
            className={`text-[11px] ${
              plan.pixelscope ? "text-violet-300" : "text-zinc-500"
            }`}
          >
            {plan.pixelscope ? "PixelScope ✓" : "No PixelScope"}
          </dd>
        </div>
      </dl>

      {/* flex-1 pins the button to the bottom so cards of unequal length still
          line their actions up across the row. */}
      <ul className="mt-8 flex flex-1 flex-col gap-3.5">
        {included.map((facility, i) => (
          <li key={i} className="flex items-center gap-2.5 text-xs text-white">
            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
              <FiCheck size={10} />
            </span>
            {facility.text}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 py-2.5 pr-2 pl-5 text-sm text-white transition-colors hover:bg-violet-700"
        >
          Edit
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-violet-600">
            <FiArrowUpRight size={13} />
          </span>
        </button>
      </div>
    </article>
  );
}
