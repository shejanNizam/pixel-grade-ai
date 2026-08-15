import { FiClipboard, FiCpu, FiCrop, FiSearch } from "react-icons/fi";
import type { IconType } from "react-icons";

const cardBase =
  "rounded-2xl border border-violet-500/30 bg-linear-to-b from-violet-900/30 to-black/40 p-6";

function CardIcon({ Icon }: { Icon: IconType }) {
  return (
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/25">
      <Icon className="text-xl" />
    </span>
  );
}

export default function ScanningEngine() {
  return (
    <section id="working-process" className="bg-black px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Advanced Scanning Engine
        </h2>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Tall card — icon above the title */}
          <article className={cardBase}>
            <CardIcon Icon={FiCpu} />
            <h3 className="mt-6 text-lg font-medium text-white">
              AI-Powered Card Grading
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Upload images of your card and receive an AI-powered grade
              estimate based on its visible condition.
            </p>
          </article>

          {/* Middle column — two stacked cards with the icon beside the title */}
          <div className="grid gap-5 lg:grid-rows-2">
            <article className={cardBase}>
              <div className="flex items-center gap-4">
                <CardIcon Icon={FiSearch} />
                <h3 className="text-lg font-medium text-white">
                  Card Identification
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                Identify your card and view key details such as the card name,
                set, year, and card number.
              </p>
            </article>

            <article className={cardBase}>
              <div className="flex items-center gap-4">
                <CardIcon Icon={FiCrop} />
                <h3 className="text-lg font-medium text-white">
                  Condition Breakdown
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                Review your card across key grading areas including centering,
                corners, edges, and surface.
              </p>
            </article>
          </div>

          <article className={cardBase}>
            <CardIcon Icon={FiClipboard} />
            <h3 className="mt-6 text-lg font-medium text-white">
              Grading Report
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              See your estimated grade, condition breakdown, confidence score,
              and grading summary in one easy-to-read report.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
