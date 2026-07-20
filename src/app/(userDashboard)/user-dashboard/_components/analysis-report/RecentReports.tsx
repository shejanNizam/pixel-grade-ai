"use client";

import { useGetMyGradingReportsQuery } from "@/redux/features/grading/gradingApi";
import Image from "next/image";
import { CARD_IMAGE } from "./data";

export default function RecentReports() {
  const { data, isLoading } = useGetMyGradingReportsQuery({
    limit: 5,
    sort: "-createdAt",
  });

  const reports = data?.data ?? [];

  return (
    <section className="rounded-2xl border border-violet-500/40 bg-[#111113] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium text-white">Recent reports</h2>
        <span className="text-xs text-zinc-500">
          {data?.meta?.total ?? 0} total
        </span>
      </div>

      {isLoading ? (
        <ul className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <li
              key={i}
              className="h-20 animate-pulse rounded-xl border border-white/8"
            />
          ))}
        </ul>
      ) : reports.length === 0 ? (
        <p className="rounded-xl border border-white/8 p-4 text-xs text-zinc-400">
          No reports yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {reports.map((report) => {
            const card = typeof report.card === "object" ? report.card : null;
            return (
              <li
                key={report._id}
                className="flex items-center gap-4 rounded-xl border border-white/8 p-3"
              >
                <Image
                  src={
                    (card?.officialImageUrl as string | undefined) ?? CARD_IMAGE
                  }
                  alt=""
                  width={40}
                  height={56}
                  className="h-14 w-10 shrink-0 rounded-md object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">
                    {card?.name ?? "Card"}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                    {card?.setExpansion ?? ""}
                  </p>
                </div>

                <div className="hidden text-center sm:block">
                  <p className="text-sm font-semibold text-violet-300 tabular-nums">
                    {report.grade.toFixed(1)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    {report.gradeLabel}
                  </p>
                </div>

                <div className="hidden text-center sm:block">
                  <p className="text-sm text-white tabular-nums">
                    {report.confidence} %
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">Confidence</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-white tabular-nums">
                    {card?.latestPrice !== undefined
                      ? `$ ${card.latestPrice.toLocaleString("en-US")}`
                      : "—"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">Value</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
