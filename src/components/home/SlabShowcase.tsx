import Image from "next/image";
import Link from "next/link";
import { FiMaximize } from "react-icons/fi";

export default function SlabShowcase() {
  return (
    <section className="relative overflow-hidden bg-black px-4 py-24">
      {/* Glow behind the slab render. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 h-[34rem] w-[34rem] -translate-y-1/2 translate-x-1/4 rounded-full bg-violet-600/40 blur-[130px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl">
            Your Cards, Your Grades
            <br />
            Your slabs.
          </h2>

          <p className="mt-8 max-w-md text-sm leading-relaxed text-zinc-300">
            PixelSlabs AI, Gives collectors instant, AI powered grading report
            and lets you create your own custom slabs levels
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2.5 rounded-full bg-violet-500 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-600"
            >
              Scan now
              <FiMaximize className="text-base" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-full bg-violet-500 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-600"
            >
              Lets get start
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Image
            src="/assets/sight_phone_img.png"
            alt="Graded card in a custom PixelGrade slab"
            width={520}
            height={640}
            className="h-auto w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
}
