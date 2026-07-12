import type { Metadata } from "next";
import {
  FiZap,
  FiShield,
  FiSmartphone,
  FiMoon,
  FiLayers,
  FiCode,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore what PixelGrade AI can do.",
};

const features = [
  {
    icon: FiZap,
    title: "Fast by Default",
    body: "Built on Next.js 15 with Turbopack for near-instant dev and optimized builds.",
  },
  {
    icon: FiShield,
    title: "Auth Ready",
    body: "Login, signup, password reset, and cookie-based route protection out of the box.",
  },
  {
    icon: FiMoon,
    title: "Dark Mode",
    body: "Theme switching wired through next-themes and Ant Design's config provider.",
  },
  {
    icon: FiLayers,
    title: "Dashboard Shell",
    body: "A responsive sidebar + header layout ready for your app's authenticated area.",
  },
  {
    icon: FiSmartphone,
    title: "Responsive",
    body: "Mobile-first layouts with a drawer navigation and Tailwind CSS 4 utilities.",
  },
  {
    icon: FiCode,
    title: "Typed & Clean",
    body: "TypeScript throughout, Redux Toolkit Query for data, and ESLint configured.",
  },
];

export default function FeaturesPage() {
  return (
    <section className="container mx-auto flex min-h-[calc(100dvh-5rem)] flex-col justify-center px-4 py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Everything You <span className="text-blue-500">Need</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          A demo features page. Highlight what makes your product worth using.
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {features.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800/50 p-6 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500">
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
