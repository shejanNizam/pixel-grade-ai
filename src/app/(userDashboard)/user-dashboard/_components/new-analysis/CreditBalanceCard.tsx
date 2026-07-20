"use client";

import { CREDITS_PER_SCAN } from "@/config/plans";
import { useGetMySubscriptionQuery } from "@/redux/features/subscription/subscriptionApi";
import Link from "next/link";

/** Credits balance for the current interval.
 *
 * The product meters usage in credits (10 credits = 1 scan). Free tops up
 * daily; paid plans top up monthly. */
export default function CreditBalanceCard() {
  const { data, isLoading } = useGetMySubscriptionQuery();

  if (isLoading || !data) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-24 min-w-56 animate-pulse rounded-xl border border-white/10 bg-[#111113]" />
      </div>
    );
  }

  const { plan, credits } = data;
  const allowance = plan.creditAmount; // null = unlimited (Enterprise)
  const unlimited = allowance === null || credits.balance === null;
  const remaining = unlimited ? null : Math.max(credits.balance ?? 0, 0);
  const used =
    unlimited || allowance === null
      ? 0
      : Math.max(allowance - (remaining ?? 0), 0);
  const pct =
    unlimited || allowance === null || allowance === 0
      ? 0
      : Math.min((used / allowance) * 100, 100);
  // "Low" once there aren't enough credits left for a full scan.
  const low = remaining !== null && remaining < CREDITS_PER_SCAN;
  const scansLeft = credits.scansLeft;
  const resetLabel =
    plan.creditInterval === "daily" ? "Resets daily" : "Resets monthly";

  return (
    <div className="flex items-center gap-4">
      <div className="min-w-56 rounded-xl border border-white/10 bg-[#111113] px-4 py-3">
        <div className="flex items-center justify-between gap-6">
          <p className="text-xs text-zinc-400">
            Credits left
            <span className="ml-1.5 rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-medium text-violet-300">
              {plan.name}
            </span>
          </p>
          <p className="text-sm font-semibold text-white tabular-nums">
            {unlimited || allowance === null ? (
              "Unlimited"
            ) : (
              <>
                <span className={low ? "text-amber-400" : undefined}>
                  {remaining}
                </span>
                <span className="text-zinc-500">
                  {" "}
                  / {allowance.toLocaleString()}
                </span>
              </>
            )}
          </p>
        </div>

        {!unlimited && allowance !== null && (
          <div
            role="progressbar"
            aria-valuenow={used}
            aria-valuemin={0}
            aria-valuemax={allowance}
            aria-label={`${used} of ${allowance} credits used`}
            className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
          >
            <div
              className={`h-full rounded-full transition-all ${
                low ? "bg-amber-400" : "bg-violet-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        <p className="mt-2 text-[11px] text-zinc-500">
          {unlimited
            ? "Unlimited plan — no credit limit"
            : `${scansLeft} scan${scansLeft === 1 ? "" : "s"} left · ${resetLabel}`}
        </p>
      </div>

      <Link
        href="/user-dashboard/subscription"
        className="rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-600"
      >
        Upgrade plan
      </Link>
    </div>
  );
}
