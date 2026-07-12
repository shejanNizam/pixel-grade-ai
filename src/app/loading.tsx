import LoadingSpinner from "@/components/shared/LoadingSpinner";

// Route-level loading UI. Next.js renders this automatically while a route
// segment's async work resolves (Suspense boundary).
export default function Loading() {
  return <LoadingSpinner />;
}
