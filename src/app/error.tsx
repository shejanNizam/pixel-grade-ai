"use client";

import CustomPrimaryButton from "@/components/shared/CustomPrimaryButton";
import { useEffect } from "react";

// Error boundary for route segments. Must be a Client Component.
// Catches errors thrown during rendering of a route and its children.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with your error-reporting service (Sentry, etc.).
    console.error(error);
  }, [error]);

  return (
    <section className="container mx-auto px-4 py-24 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
          An unexpected error occurred. You can try again, or head back home.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <CustomPrimaryButton onClick={() => reset()}>
            Try again
          </CustomPrimaryButton>
          <CustomPrimaryButton href="/">Back to home</CustomPrimaryButton>
        </div>
      </div>
    </section>
  );
}
