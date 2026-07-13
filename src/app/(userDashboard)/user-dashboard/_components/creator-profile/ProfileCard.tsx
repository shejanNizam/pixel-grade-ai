import { creator, initials } from "./data";

export default function ProfileCard() {
  return (
    <section className="rounded-2xl border border-violet-500/40 bg-[#111113] p-6 sm:p-8">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <span className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-cyan-400 text-xl font-semibold text-white">
          {initials}
        </span>

        <div>
          <p className="text-xl font-medium text-white">{creator.name}</p>
          <span className="mt-2 inline-flex rounded-md bg-violet-500/15 px-2.5 py-1 text-xs text-violet-300">
            {creator.badge}
          </span>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-4 text-center">
        {creator.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-white/5 py-5"
          >
            <dd className="text-2xl font-semibold text-violet-300 tabular-nums">
              {stat.value}
            </dd>
            <dt className="mt-1 text-xs text-zinc-500">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
