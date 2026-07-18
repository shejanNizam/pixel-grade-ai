import { formatCredits } from "@/config/plans";
import Image from "next/image";
import BackHeading from "../../_components/BackHeading";
import { userDetails } from "../../_components/users/data";

export default function UserDetailsPage() {
  const {
    name,
    email,
    state,
    plan,
    creditsUsed,
    creditAllowance,
    creditInterval,
    renewsOn,
    cards,
  } = userDetails;

  // Unlimited plans have no bar to fill; percent is only meaningful when metered.
  const usedPercent =
    creditAllowance === null
      ? null
      : Math.min(100, Math.round((creditsUsed / creditAllowance) * 100));

  return (
    <div>
      <BackHeading label="User details" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <section>
          <h2 className="mb-3 text-sm text-zinc-400">Post by</h2>

          <article className="flex items-center gap-4 rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black p-4">
            <Image
              src="/assets/main_logo.png"
              alt=""
              width={56}
              height={56}
              className="h-12 w-12 shrink-0 object-contain"
            />

            <div className="min-w-0 text-xs leading-relaxed">
              <p className="text-base font-medium text-white">{name}</p>
              <p className="truncate text-zinc-400">Email : {email}</p>
              <p className="truncate text-zinc-400">State : {state}</p>
            </div>
          </article>

          {/* Plan usage — the quota the plan meters, so support can see at a
              glance whether a user is near their limit. */}
          <h2 className="mt-8 mb-3 text-sm text-zinc-400">Plan</h2>

          <article className="rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-base font-medium text-white">{plan}</p>
              <p className="text-[11px] text-zinc-400">Renews {renewsOn}</p>
            </div>

            <p className="mt-3 text-xs text-zinc-400">
              Credits used{" "}
              <span className="font-medium text-white tabular-nums">
                {creditsUsed.toLocaleString()}
              </span>{" "}
              of {formatCredits(creditAllowance, creditInterval)}
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
          <h2 className="mb-3 text-sm text-zinc-400">Card</h2>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <article
                key={card.id}
                className="rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black p-4"
              >
                <Image
                  src={card.image}
                  alt=""
                  width={320}
                  height={440}
                  className="w-full rounded-xl object-cover"
                />

                <dl className="mt-4 flex flex-wrap gap-2">
                  {card.grades.map((grade) => (
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
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
