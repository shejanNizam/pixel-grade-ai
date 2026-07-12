"use client";

import { HiOutlineSparkles } from "react-icons/hi2";

interface StartInspectionButtonProps {
  disabled?: boolean;
  /** Shown under the button when it's disabled, so the block isn't a dead end. */
  hint?: string;
  onStart: () => void;
  className?: string;
}

export default function StartInspectionButton({
  disabled = false,
  hint,
  onStart,
  className = "",
}: StartInspectionButtonProps) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={onStart}
        disabled={disabled}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-500 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
      >
        <HiOutlineSparkles className="text-base" />
        Start AI Inspection
      </button>

      {disabled && hint && (
        <p className="mt-2 text-center text-xs text-zinc-500">{hint}</p>
      )}
    </div>
  );
}
