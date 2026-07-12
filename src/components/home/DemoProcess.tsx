const steps = [
  "Swap in your real headline and brand promise.",
  "Update section copy to match your audience.",
  "Connect buttons to your signup or product flow.",
];

export default function DemoProcess() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
              Demo Process
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Turn the template into a real homepage
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              The layout is intentionally simple, so you can keep momentum while
              product details are still changing.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-gray-700 dark:text-gray-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
