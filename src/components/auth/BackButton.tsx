"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

/** Compact back arrow shown beside each auth page title. */
export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
    >
      <FiArrowLeft className="text-lg" />
    </button>
  );
}
