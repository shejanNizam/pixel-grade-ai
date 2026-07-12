import Link from "next/link";

/** Placeholder balance — swap for the user's real credits when the API exists. */
const CREDITS = 98_643;

export default function CreditsCard() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111113] px-4 py-3">
        <span
          aria-hidden
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-amber-300 to-amber-500 text-lg"
        >
          🪙
        </span>
        <div className="leading-tight">
          <p className="text-xs text-zinc-400">Credits</p>
          <p className="text-lg font-semibold text-white tabular-nums">
            {CREDITS.toLocaleString("en-US")}
          </p>
        </div>
      </div>

      <Link
        href="/user-dashboard/subscription"
        className="rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-600"
      >
        Buy credits
      </Link>
    </div>
  );
}
