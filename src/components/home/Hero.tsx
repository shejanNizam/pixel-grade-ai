import Link from "next/link";
import { FiMaximize } from "react-icons/fi";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-black px-4 pt-28 pb-32 text-center"
    >
      {/* Purple bloom spilling down from behind the navbar. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-64 left-1/2 h-[42rem] w-[70rem] -translate-x-1/2 rounded-full bg-violet-600/45 blur-[140px]"
      />

      <div className="relative mx-auto max-w-3xl">
        <h1 className="text-4xl leading-tight font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Grade Your Cards
          <br />
          In Seconds
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          Upload your trading card photos and get an instant AI-powered
          inspection report with grade prediction, condition analysis, and
          market valuation.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2.5 rounded-full bg-violet-500 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-violet-600"
          >
            Scan now
            <FiMaximize className="text-base" />
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center rounded-full bg-violet-500 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-violet-600"
          >
            Lets get start
          </Link>
        </div>
      </div>
    </section>
  );
}
