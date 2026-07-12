"use client";

import { App } from "antd";
import { useState } from "react";
import ImageDropzone from "./ImageDropzone";
import StartInspectionButton from "./StartInspectionButton";

export default function QuickImport() {
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const { message } = App.useApp();

  const ready = Boolean(front && back);

  return (
    <section>
      <h2 className="text-lg font-medium text-white">Quick import</h2>
      <p className="mt-1 text-xs text-zinc-500">
        Import front and back images to get started quickly
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <ImageDropzone label="Front Image" file={front} onChange={setFront} />
        <ImageDropzone label="Back Image" file={back} onChange={setBack} />
      </div>

      <StartInspectionButton
        className="mt-5"
        disabled={!ready}
        hint={ready ? undefined : "Import a front and a back image to continue"}
        onStart={() => message.success("Inspection started (demo).")}
      />
    </section>
  );
}
