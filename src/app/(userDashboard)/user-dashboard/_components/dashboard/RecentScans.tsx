"use client";

import { useGetMyGradingReportsQuery } from "@/redux/features/grading/gradingApi";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE = "/assets/user-dashboard/recent_scan_card.png";

const dateOf = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const timeOf = (iso?: string) =>
  iso
    ? `at ${new Date(iso).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`
    : "";

export default function RecentScans() {
  const { data, isLoading } = useGetMyGradingReportsQuery({
    limit: 5,
    sort: "-createdAt",
  });

  const reports = data?.data ?? [];

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

      {isLoading ? (
        <ul className="flex flex-1 flex-col gap-3">
          {Array.from({ length: 5 }, (_, i) => (
            <li
              key={i}
              className="h-19 animate-pulse rounded-xl border border-violet-500/30 bg-[#111113]"
            />
          ))}
        </ul>
      ) : reports.length === 0 ? (
        <p className="flex-1 rounded-xl border border-violet-500/30 bg-[#111113] p-4 text-xs text-zinc-400">
          No scans yet — run your first analysis to see it here.
        </p>
      ) : (
        <ul className="flex flex-1 flex-col gap-3">
          {reports.map((report) => {
            const card = typeof report.card === "object" ? report.card : null;
            const image =
              (card?.officialImageUrl as string | undefined) ?? FALLBACK_IMAGE;

            return (
              <li
                key={report._id}
                className="flex items-center gap-3 rounded-xl border border-violet-500/30 bg-[#111113] p-2.5"
              >
                <Image
                  src={image}
                  alt=""
                  width={40}
                  height={56}
                  // External CDN card art — bypass the optimizer's host allowlist.
                  unoptimized={image !== FALLBACK_IMAGE}
                  className="h-14 w-10 shrink-0 rounded-md object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-zinc-300">
                    {card?.name ?? "Card"}
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {report.grade} {report.gradeLabel}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] text-zinc-400">
                    {dateOf(report.createdAt)}
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    {timeOf(report.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
