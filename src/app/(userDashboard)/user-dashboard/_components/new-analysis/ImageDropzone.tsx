"use client";

import { App } from "antd";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { ACCEPT_ATTR, validateImage } from "./upload";
import { useObjectUrl } from "./useObjectUrl";

interface ImageDropzoneProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}

export default function ImageDropzone({
  label,
  file,
  onChange,
}: ImageDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOver, setIsOver] = useState(false);
  const { message } = App.useApp();
  const preview = useObjectUrl(file);

  const accept = (candidate: File | undefined) => {
    if (!candidate) return;
    const error = validateImage(candidate);
    if (error) {
      message.error(error);
      return;
    }
    onChange(candidate);
  };

  const clear = () => {
    onChange(null);
    // Let the same file be picked again after removal.
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="rounded-2xl border border-violet-500/40 bg-[#111113] p-5">
      <p className="mb-4 text-center text-sm font-medium text-white">{label}</p>

      {preview ? (
        <div className="relative">
          <Image
            src={preview}
            alt={`${label} preview`}
            width={320}
            height={200}
            unoptimized
            className="h-44 w-full rounded-xl object-contain"
          />
          <button
            type="button"
            onClick={clear}
            aria-label={`Remove ${label}`}
            className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black"
          >
            <FiX />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setIsOver(true);
          }}
          onDragLeave={() => setIsOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsOver(false);
            accept(e.dataTransfer.files[0]);
          }}
          className={`flex h-44 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed text-center transition-colors ${
            isOver
              ? "border-violet-400 bg-violet-500/10"
              : "border-white/15 hover:border-violet-500/60"
          }`}
        >
          <FiUploadCloud className="mb-1 text-3xl text-violet-400" />
          <span className="text-sm text-white">Click to import</span>
          <span className="text-xs text-zinc-500">Or drag and drop</span>
          <span className="mt-1 text-[11px] text-zinc-600">
            JPG, PNG, WEBP up to 10 MB
          </span>
        </label>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT_ATTR}
        className="sr-only"
        onChange={(e) => accept(e.target.files?.[0])}
      />
    </div>
  );
}
