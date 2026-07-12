"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

/** Back arrow + page title, shown at the top of every settings screen. */
export default function BackLink({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-500/60 text-amber-400 transition-colors hover:bg-amber-500/10"
      >
        <FiArrowLeft />
      </button>
      <h2 className="text-lg text-white">{title}</h2>
    </div>
  );
}
