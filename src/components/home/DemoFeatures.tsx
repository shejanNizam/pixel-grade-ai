const features = [
  {
    title: "Ready-to-edit sections",
    description:
      "Start with clean marketing blocks that can be renamed, reordered, or replaced as the product takes shape.",
  },
  {
    title: "Responsive by default",
    description:
      "Cards and content stack neatly on mobile while keeping a polished grid on wider screens.",
  },
  {
    title: "Theme friendly",
    description:
      "The sections use the existing blue palette and dark mode classes from the app template.",
  },
];

export default function DemoFeatures() {
  return (
    <section className="bg-gray-50 py-20 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
            Demo Features
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Build your homepage faster
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Use these sections as placeholders while you shape the real landing
            page content.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                0{index + 1}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
