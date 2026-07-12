"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

interface BackHeadingProps {
  label: string;
  /** Overrides the default bottom margin when the heading shares a row. */
  className?: string;
}

/** Back arrow + page label, shown above the content on every admin screen. */
export default function BackHeading({
  label,
  className = "mb-6",
}: BackHeadingProps) {
  const router = useRouter();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-500/60 text-amber-400 transition-colors hover:bg-amber-500/10"
      >
        <FiArrowLeft size={16} />
      </button>
      <span className="text-base text-white">{label}</span>
    </div>
  );
}
