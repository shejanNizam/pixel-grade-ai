// Lightweight shimmer placeholder for loading states. Compose several of these
// to build page-level skeletons (see `SkeletonCard` below) or use standalone
// inside a `loading.tsx` / `<Suspense fallback>`.
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}

// Example composite: a card-shaped skeleton handy for dashboard grids.
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="mt-4 h-4 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </div>
  );
}

export default Skeleton;
