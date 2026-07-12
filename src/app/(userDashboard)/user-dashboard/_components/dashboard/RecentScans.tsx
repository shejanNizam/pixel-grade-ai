import Image from "next/image";
import Link from "next/link";
import { recentScans } from "./data";

export default function RecentScans() {
  return (
    <section className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-white">Recent scans</h2>
        <Link
          href="/user-dashboard/analysis-report"
          className="text-xs text-zinc-400 transition-colors hover:text-white"
        >
          See all
        </Link>
      </div>

      <ul className="flex flex-1 flex-col gap-3">
        {recentScans.map((scan) => (
          <li
            key={scan.id}
            className="flex items-center gap-3 rounded-xl border border-violet-500/30 bg-[#111113] p-2.5"
          >
            <Image
              src="/assets/user-dashboard/recent_scan_card.png"
              alt=""
              width={40}
              height={56}
              className="h-14 w-10 shrink-0 rounded-md object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-zinc-300">{scan.name}</p>
              <p className="mt-1 text-sm font-medium text-white">
                {scan.grade}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[11px] text-zinc-400">{scan.date}</p>
              <p className="mt-1 text-[11px] text-zinc-500">{scan.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
