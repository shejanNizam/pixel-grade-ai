"use client";

import { formatCredits, getPlan, type PlanName } from "@/config/plans";
import { useGetUserLedgerQuery } from "@/redux/features/credit/creditApi";
import { useGetAllGradingReportsQuery } from "@/redux/features/grading/gradingApi";
import { useGetSubscribersQuery } from "@/redux/features/subscription/subscriptionApi";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import Image from "next/image";
import { useParams } from "next/navigation";
import BackHeading from "../../_components/BackHeading";
import { formatUserDate } from "../../_components/users/format";

export default function UserDetailsPage() {
  const { userId } = useParams<{ userId: string }>();

  const { data: user, isLoading, isError } = useGetUserByIdQuery(userId);

  // "Which plan?" lives on the subscription, not the user row. The subscribers
  // list matches by email server-side; no row for this user means Free.
  const { data: subscribers } = useGetSubscribersQuery(
    user ? { searchTerm: user.email, limit: 5 } : undefined,
    { skip: !user },
  );
  const subscription = subscribers?.data.find(
    (row) => row.user._id === userId,
  );

  // The latest ledger row's balanceAfter IS the current balance.
  const { data: ledger } = useGetUserLedgerQuery({ userId, limit: 1 });
  const balance = ledger?.data[0]?.balanceAfter;

  const { data: reports } = useGetAllGradingReportsQuery({
    user: userId,
    limit: 6,
    sort: "-createdAt",
  });

  if (isLoading) {
    return (
      <div>
        <BackHeading label="User details" />
        <div className="h-64 animate-pulse rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div>
        <BackHeading label="User details" />
        <p className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5 text-sm text-red-400">
          Couldn&apos;t load this user — they may have been deleted.
        </p>
      </div>
    );
  }

  const planName = (subscription?.plan.name ?? "Free") as PlanName;
  const plan = getPlan(planName);

  // Used = allowance minus what's left. Only meaningful on metered plans with
  // a known balance; Enterprise (null allowance) renders no bar at all.
  const creditsUsed =
    plan.credits !== null && balance !== undefined
      ? Math.max(0, plan.credits - balance)
      : null;
  const usedPercent =
    creditsUsed !== null && plan.credits !== null && plan.credits > 0
      ? Math.min(100, Math.round((creditsUsed / plan.credits) * 100))
      : null;

  const gradedCards = reports?.data ?? [];

  return (
    <div>
      <BackHeading label="User details" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <section>
          <h2 className="mb-3 text-sm text-zinc-400">Account</h2>

          <article className="flex items-center gap-4 rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black p-4">
            {user.avatar?.url ? (
              <Image
                src={user.avatar.url}
                alt=""
                width={56}
                height={56}
                // Avatars are stored on Cloudinary (external host) — skip the
                // optimizer's allowlist so they don't 404 to a broken image.
                unoptimized
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-600 text-lg font-medium text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}

            <div className="min-w-0 text-xs leading-relaxed">
              <p className="text-base font-medium text-white">{user.name}</p>
              <p className="truncate text-zinc-400">Email : {user.email}</p>
              <p className="truncate text-zinc-400">
                Joined : {formatUserDate(user.createdAt)}
              </p>
              <p
                className={`capitalize ${
                  user.status === "blocked" ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {user.status}
              </p>
            </div>
          </article>

          {/* Plan usage — the quota the plan meters, so support can see at a
              glance whether a user is near their limit. */}
          <h2 className="mt-8 mb-3 text-sm text-zinc-400">Plan</h2>

          <article className="rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-base font-medium text-white">{planName}</p>
              {subscription?.currentPeriodEnd && (
                <p className="text-[11px] text-zinc-400">
                  {subscription.cancelAtPeriodEnd ? "Ends" : "Renews"}{" "}
                  {formatUserDate(subscription.currentPeriodEnd)}
                </p>
              )}
            </div>

            <p className="mt-3 text-xs text-zinc-400">
              {creditsUsed !== null ? (
                <>
                  Credits used{" "}
                  <span className="font-medium text-white tabular-nums">
                    {creditsUsed.toLocaleString()}
                  </span>{" "}
                  of {formatCredits(plan.credits, plan.creditInterval)}
                </>
              ) : (
                formatCredits(plan.credits, plan.creditInterval)
              )}
            </p>

            {usedPercent !== null && (
              <div
                role="progressbar"
                aria-valuenow={usedPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Credit allowance used"
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
              >
                <div
                  className={`h-full rounded-full ${
                    usedPercent >= 90 ? "bg-red-400" : "bg-violet-500"
                  }`}
                  style={{ width: `${usedPercent}%` }}
                />
              </div>
            )}
          </article>
        </section>

        <section>
          <h2 className="mb-3 text-sm text-zinc-400">
            Graded cards ( {reports?.meta?.total ?? gradedCards.length} )
          </h2>

          {gradedCards.length === 0 ? (
            <p className="rounded-2xl border border-white/8 p-5 text-sm text-zinc-400">
              No graded cards yet.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {gradedCards.map((report) => (
                <article
                  key={report._id}
                  className="rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black p-4"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-medium text-white">
                      {typeof report.card === "object"
                        ? report.card.name
                        : "Card"}
                    </p>
                    <p className="shrink-0 text-lg font-semibold text-violet-400 tabular-nums">
                      {report.grade}
                      <span className="ml-1 text-[10px] text-zinc-400">
                        {report.gradeLabel}
                      </span>
                    </p>
                  </div>

                  <dl className="mt-4 flex flex-wrap gap-2">
                    {[
                      { label: "Surfaces", value: report.scoreSurface },
                      { label: "Corners", value: report.scoreCorners },
                      { label: "Edges", value: report.scoreEdges },
                      { label: "Centering", value: report.scoreCentering },
                    ].map((grade) => (
                      <div
                        key={grade.label}
                        className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 px-3 py-1.5"
                      >
                        <dt className="text-[11px] text-zinc-400">
                          {grade.label}
                        </dt>
                        <dd className="text-[11px] font-medium text-white tabular-nums">
                          {grade.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-3 text-[11px] text-zinc-500">
                    {formatUserDate(report.createdAt)}
                    {report.pixelVerified && (
                      <span className="ml-2 text-emerald-400">
                        Pixel Verified
                      </span>
                    )}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
