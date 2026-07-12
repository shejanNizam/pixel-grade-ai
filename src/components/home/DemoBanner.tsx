import Link from "next/link";
import { FiArrowRight, FiZap } from "react-icons/fi";
import CustomPrimaryButton from "../shared/CustomPrimaryButton";

const stats = [
  { value: "12k+", label: "Active users" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Average rating" },
];

export default function DemoBanner() {
  return (
    <section className="relative flex min-h-[calc(100dvh-5rem)] items-center overflow-hidden">
      {/* Ambient background — gradient blobs over a subtle grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-primary/25 blur-3xl animate-auth-float dark:bg-primary/20" />
        <div className="absolute -right-16 bottom-10 h-96 w-96 rounded-full bg-secondary/25 blur-3xl animate-auth-float-slow dark:bg-secondary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,var(--background)_100%)]" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Announcement pill */}
          <Link
            href="/features"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 py-1.5 pl-2 pr-3.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur transition-colors hover:border-primary/40 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-primary to-secondary px-2 py-0.5 text-[11px] font-semibold text-white">
              <FiZap size={11} /> New
            </span>
            Introducing the v2 template
            <FiArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          <h1 className="mt-7 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
            Ship your next idea{" "}
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              in days, not months
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
            A production-ready Next.js starter with auth, dashboards, theming and
            state management already wired up. Swap this copy for your own and
            launch.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <CustomPrimaryButton href="/signup" size="lg" icon={<FiArrowRight />}>
              Get Started
            </CustomPrimaryButton>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white/70 px-8 text-base font-semibold text-slate-700 backdrop-blur transition-colors hover:border-slate-300 hover:bg-white sm:h-13 md:h-14 md:text-lg dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              Login
            </Link>
          </div>

          {/* Trust row */}
          <dl className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
