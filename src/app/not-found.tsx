import CustomPrimaryButton from "@/components/shared/CustomPrimaryButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

// Rendered for unmatched routes and anywhere `notFound()` is called.
export default function NotFound() {
  return (
    <section className="container mx-auto px-4 py-24 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <p className="text-6xl md:text-7xl font-bold text-blue-500">404</p>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>
        <div className="mt-8 flex justify-center">
          <CustomPrimaryButton href="/">Back to home</CustomPrimaryButton>
        </div>
      </div>
    </section>
  );
}
