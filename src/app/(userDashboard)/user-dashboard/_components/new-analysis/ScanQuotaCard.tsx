import Link from "next/link";

/** Placeholder quota — swap for the user's real subscription usage when the
 *  API exists. Limits mirror the plans in components/pricing/PricingPlans.tsx
 *  (Free: 5/mo · Pro: 200/mo · Enterprise: unlimited). */
const PLAN_NAME = "Free";
const SCANS_USED = 2;
const SCAN_LIMIT: number | null = 5; // null = unlimited (Enterprise)

export default function ScanQuotaCard() {
  const unlimited = SCAN_LIMIT === null;
  const remaining = unlimited ? null : Math.max(SCAN_LIMIT - SCANS_USED, 0);
  const pct = unlimited ? 0 : Math.min((SCANS_USED / SCAN_LIMIT) * 100, 100);
  const low = !unlimited && remaining !== null && remaining <= 1;

  return (
    <div className="flex items-center gap-4">
      <div className="min-w-56 rounded-xl border border-white/10 bg-[#111113] px-4 py-3">
        <div className="flex items-center justify-between gap-6">
          <p className="text-xs text-zinc-400">
            Scans left
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
                <span className="text-zinc-500"> / {SCAN_LIMIT}</span>
              </>
            )}
          </p>
        </div>

        {!unlimited && (
          <div
            role="progressbar"
            aria-valuenow={SCANS_USED}
            aria-valuemin={0}
            aria-valuemax={SCAN_LIMIT}
            aria-label={`${SCANS_USED} of ${SCAN_LIMIT} monthly scans used`}
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
          {unlimited ? "Resets never — unlimited plan" : "Resets monthly"}
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
