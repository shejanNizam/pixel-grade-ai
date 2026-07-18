import { CREDITS_PER_SCAN } from "@/config/plans";
import Link from "next/link";
import { DEMO_CREDITS_USED, demoPlan } from "./demoAccount";

/** Credits balance for the current interval.
 *
 * The product meters usage in credits (10 credits = 1 scan). Free tops up
 * daily; paid plans top up monthly. Swap the demo values for the user's real
 * balance when the subscription API exists. */
const PLAN_NAME = demoPlan.name;
const CREDITS_USED = DEMO_CREDITS_USED;
const CREDIT_ALLOWANCE = demoPlan.credits; // null = unlimited (Enterprise)
const INTERVAL = demoPlan.creditInterval;

export default function CreditBalanceCard() {
  const unlimited = CREDIT_ALLOWANCE === null;
  const remaining = unlimited
    ? null
    : Math.max(CREDIT_ALLOWANCE - CREDITS_USED, 0);
  const pct = unlimited
    ? 0
    : Math.min((CREDITS_USED / CREDIT_ALLOWANCE) * 100, 100);
  // "Low" once there aren't enough credits left for a full scan.
  const low = remaining !== null && remaining < CREDITS_PER_SCAN;
  const scansLeft = remaining === null ? null : Math.floor(remaining / CREDITS_PER_SCAN);
  const resetLabel =
    INTERVAL === "daily" ? "Resets daily" : "Resets monthly";

  return (
    <div className="flex items-center gap-4">
      <div className="min-w-56 rounded-xl border border-white/10 bg-[#111113] px-4 py-3">
        <div className="flex items-center justify-between gap-6">
          <p className="text-xs text-zinc-400">
            Credits left
            <span className="ml-1.5 rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-medium text-violet-300">
              {PLAN_NAME}
            </span>
          </p>
          <p className="text-sm font-semibold text-white tabular-nums">
            {unlimited ? (
              "Unlimited"
            ) : (
              <>
                <span className={low ? "text-amber-400" : undefined}>
                  {remaining}
                </span>
                <span className="text-zinc-500">
                  {" "}
                  / {CREDIT_ALLOWANCE.toLocaleString()}
                </span>
              </>
            )}
          </p>
        </div>

        {!unlimited && (
          <div
            role="progressbar"
            aria-valuenow={CREDITS_USED}
            aria-valuemin={0}
            aria-valuemax={CREDIT_ALLOWANCE}
            aria-label={`${CREDITS_USED} of ${CREDIT_ALLOWANCE} credits used`}
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
