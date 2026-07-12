"use client";

import { App } from "antd";
import { useState } from "react";
import ImageSlotGrid from "./ImageSlotGrid";
import StartInspectionButton from "./StartInspectionButton";

export default function AdvancedImport() {
  const [front, setFront] = useState<File[]>([]);
  const [back, setBack] = useState<File[]>([]);
  const { message } = App.useApp();

  const ready = front.length > 0 && back.length > 0;

  return (
    <section>
      <h2 className="text-lg font-medium text-white">
        Advanced multi images import
      </h2>
      <p className="mt-1 text-xs text-zinc-500">
        Upload up to 10 images per side for the most accurate analysis
      </p>

      <div className="mt-6 space-y-7">
        <ImageSlotGrid
          label="Front section"
          files={front}
          onChange={setFront}
        />
        <ImageSlotGrid label="Back section" files={back} onChange={setBack} />
      </div>

      <StartInspectionButton
        className="mt-7"
        disabled={!ready}
        hint={
          ready
            ? undefined
            : "Add at least one front and one back image to continue"
        }
        onStart={() =>
          message.success(
            `Inspection started with ${front.length + back.length} images (demo).`,
          )
        }
      />
    </section>
  );
}
