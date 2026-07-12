import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about PixelGrade AI.",
};

const values = [
  {
    title: "Our Mission",
    body: "Replace this with a short statement about the problem you solve and who you solve it for.",
  },
  {
    title: "How We Work",
    body: "Describe your approach, principles, or the way your product is built and maintained.",
  },
  {
    title: "Where We're Going",
    body: "Share your vision. What does success look like for your users a year from now?",
  },
];

export default function AboutPage() {
  return (
    <section className="container mx-auto flex min-h-[calc(100dvh-5rem)] flex-col justify-center px-4 py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          About <span className="text-blue-500">PixelGrade AI</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          This is a demo page included with the template. Swap this copy for
          your own story, team, and mission.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {values.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800/50 p-6 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
