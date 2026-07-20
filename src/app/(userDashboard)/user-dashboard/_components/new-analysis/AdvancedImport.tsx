"use client";

import Link from "next/link";
import { useState } from "react";
import { FiLock } from "react-icons/fi";
import ImageSlotGrid from "./ImageSlotGrid";
import StartInspectionButton from "./StartInspectionButton";

interface AdvancedImportProps {
  /** PixelScope is a paid feature — Free plans see a locked, upgrade-gated
   *  version of this section rather than a working uploader. */
  locked?: boolean;
  /** Hands the chosen files to the scan pipeline (front, back). */
  onStart: (front: File[], back: File[]) => void;
}

export default function AdvancedImport({
  locked = false,
  onStart,
}: AdvancedImportProps) {
  const [front, setFront] = useState<File[]>([]);
  const [back, setBack] = useState<File[]>([]);

  const ready = front.length > 0 && back.length > 0;

  return (
    <section>
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium text-white">
          Advanced multi images import
        </h2>
        <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-medium text-violet-300">
          PixelScope
        </span>
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        Upload up to 10 images per side for the most accurate analysis — and the
        Pixel Verified badge.
      </p>

      {locked ? (
        // Free plan: PixelScope + Pixel Verified are paid-only. Show the value,
        // not a working uploader.
        <div className="mt-6 rounded-2xl border border-dashed border-violet-500/40 bg-[#111113] px-6 py-10 text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/15 text-violet-300">
            <FiLock size={18} />
          </span>
          <h3 className="mt-4 text-sm font-medium text-white">
            PixelScope is a paid feature
          </h3>
          <p className="mx-auto mt-1.5 max-w-sm text-xs text-zinc-500">
            Advanced multi-image scanning and the Pixel Verified badge are
            available on the Collector plan and above. Free plans use the
            standard single-image scan above.
          </p>
          <Link
            href="/user-dashboard/subscription"
            className="mt-5 inline-flex rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-600"
          >
            Upgrade to unlock PixelScope
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-7">
            <ImageSlotGrid
              label="Front section"
              files={front}
              onChange={setFront}
            />
            <ImageSlotGrid
              label="Back section"
              files={back}
              onChange={setBack}
            />
          </div>

          <StartInspectionButton
            className="mt-7"
            disabled={!ready}
            hint={
              ready
                ? undefined
                : "Add at least one front and one back image to continue"
            }
            onStart={() => onStart(front, back)}
          />
        </>
      )}
    </section>
  );
}
