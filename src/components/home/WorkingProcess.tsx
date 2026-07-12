import { FiFolder, FiLoader } from "react-icons/fi";

/* The three step visuals aren't in /assets, so they're rebuilt here in
   markup/SVG. Swap any of them for an <Image> if a Figma export arrives. */

function UploadVisual() {
  return (
    <div className="rounded-xl bg-linear-to-br from-violet-800/40 to-slate-900 p-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-violet-500/25 text-violet-200">
          <FiFolder className="text-xl" />
        </span>
        <div>
          <p className="text-sm font-medium text-white">Project Docs Folder</p>
          <p className="text-xs text-zinc-400">80MB</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-black/50 p-3">
        <div className="flex items-center justify-between text-xs text-zinc-300">
          <span className="inline-flex items-center gap-2">
            <FiLoader className="animate-spin" />
            Uploading ...
          </span>
          <span className="font-medium text-white">73%</span>
        </div>
        <div className="mt-2 h-1 rounded-full bg-white/15">
          <div className="h-1 w-[73%] rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}

function AnalysisVisual() {
  return (
    <div className="relative rounded-xl bg-linear-to-br from-slate-900 to-black p-4">
      <svg viewBox="0 0 240 120" className="h-32 w-full" aria-hidden>
        <defs>
          <linearGradient id="pg-peak" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="55%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
        {/* faint grid */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={30 * i + 15}
            x2="240"
            y2={30 * i + 15}
            stroke="#ffffff"
            strokeOpacity="0.06"
          />
        ))}
        <path
          d="M0 105 C 60 100, 85 95, 105 55 C 115 30, 125 30, 135 55 C 155 95, 180 100, 240 103"
          fill="none"
          stroke="url(#pg-peak)"
          strokeWidth="2.5"
        />
        <circle cx="120" cy="38" r="6" fill="#93c5fd" />
        <circle cx="120" cy="38" r="14" fill="#60a5fa" fillOpacity="0.25" />
      </svg>
    </div>
  );
}

function ReportVisual() {
  return (
    <div className="rounded-xl bg-linear-to-br from-slate-900 to-black p-4">
      <svg viewBox="0 0 240 130" className="h-32 w-full" aria-hidden>
        {/* concentric progress arcs */}
        <path
          d="M30 120 A 80 80 0 0 1 190 120"
          fill="none"
          stroke="#0e7490"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M50 120 A 60 60 0 0 1 170 120"
          fill="none"
          stroke="#2563eb"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M70 120 A 40 40 0 0 1 150 120"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </svg>

      <div className="-mt-24 flex flex-col items-end gap-2 pr-1">
        {[
          { value: "65%", label: "Subtitle is here" },
          { value: "80%", label: "Subtitle is here" },
        ].map((stat) => (
          <div
            key={stat.value}
            className="rounded-md bg-slate-800/90 px-3 py-1.5 text-right"
          >
            <p className="text-sm font-semibold text-white">{stat.value}</p>
            <p className="text-[10px] text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Upload images",
    body: "Upload front and back photos of your trading card.",
    Visual: UploadVisual,
  },
  {
    title: "AI analysis",
    body: "Upload front and back photos of your trading card.",
    Visual: AnalysisVisual,
  },
  {
    title: "Get report",
    body: "Upload front and back photos of your trading card.",
    Visual: ReportVisual,
  },
];

export default function WorkingProcess() {
  return (
    <section id="working-process" className="bg-black px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Working process
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            Three simple steps to get your card graded
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map(({ title, body, Visual }) => (
            <article
              key={title}
              className="rounded-2xl border border-blue-500/25 bg-linear-to-b from-slate-950 to-black p-5 text-center"
            >
              <h3 className="mb-5 text-lg font-medium text-white">{title}</h3>
              <Visual />
              <p className="mt-5 text-sm leading-relaxed text-zinc-300">
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
