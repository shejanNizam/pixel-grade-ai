import Image from "next/image";
import Link from "next/link";
import { CARD_IMAGE, recentReports } from "./data";

export default function RecentReports() {
  return (
    <section className="rounded-2xl border border-violet-500/40 bg-[#111113] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium text-white">Recent reports</h2>
        <Link
          href="/user-dashboard/analysis-report"
          className="text-xs text-zinc-400 transition-colors hover:text-white"
        >
          View all
        </Link>
      </div>

      <ul className="space-y-3">
        {recentReports.map((report) => (
          <li
            key={report.id}
            className="flex items-center gap-4 rounded-xl border border-white/8 p-3"
          >
            <Image
              src={CARD_IMAGE}
              alt=""
              width={40}
              height={56}
              className="h-14 w-10 shrink-0 rounded-md object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white">{report.name}</p>
              <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                {report.set}
              </p>
            </div>

            <div className="hidden text-center sm:block">
              <p className="text-sm font-semibold text-violet-300 tabular-nums">
                {report.grade}
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                {report.gradeLabel}
              </p>
            </div>

            <div className="hidden text-center sm:block">
              <p className="text-sm text-white tabular-nums">
                {report.confidence}
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-500">Confidence</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-white tabular-nums">{report.value}</p>
              <p className="mt-0.5 text-[11px] text-zinc-500">Value</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
