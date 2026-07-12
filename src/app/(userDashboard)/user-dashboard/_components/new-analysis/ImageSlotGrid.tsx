"use client";

import { App } from "antd";
import Image from "next/image";
import { useId, useRef } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { useObjectUrls } from "@/hooks/useObjectUrl";
import { ACCEPT_ATTR, MAX_PER_SIDE, validateImage } from "@/utils/imageUpload";

interface ImageSlotGridProps {
  label: string;
  files: File[];
  onChange: (files: File[]) => void;
}

export default function ImageSlotGrid({
  label,
  files,
  onChange,
}: ImageSlotGridProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { message } = App.useApp();
  const previews = useObjectUrls(files);

  const room = MAX_PER_SIDE - files.length;
  const emptySlots = Array.from({ length: room });

  const addFiles = (picked: FileList | null) => {
    if (!picked?.length) return;

    const accepted: File[] = [];
    for (const file of Array.from(picked)) {
      const error = validateImage(file);
      if (error) {
        message.error(error);
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length > room) {
      message.warning(
        `Only ${room} more image${room === 1 ? "" : "s"} fit in the ${label.toLowerCase()}.`,
      );
    }

    onChange([...files, ...accepted.slice(0, room)]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeAt = (index: number) =>
    onChange(files.filter((_, i) => i !== index));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-white">{label}</p>
        <p className="text-xs text-zinc-500">
          {files.length}/{MAX_PER_SIDE} Images Uploaded
        </p>
      </div>

      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {files.map((file, i) => (
          <li key={`${file.name}-${i}`} className="relative">
            <Image
              src={previews[i] ?? ""}
              alt={`${label} image ${i + 1}`}
              width={120}
              height={120}
              unoptimized
              className="aspect-square w-full rounded-lg border border-violet-500/40 object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label={`Remove ${label} image ${i + 1}`}
              className="absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/75 text-white transition-colors hover:bg-black"
            >
              <FiX size={13} />
            </button>
          </li>
        ))}

        {emptySlots.map((_, i) => (
          <li key={`empty-${i}`}>
            {/* Only the first empty slot is a real control — the rest are
                placeholders, so screen readers hear one "add" action per side. */}
            {i === 0 ? (
              <label
                htmlFor={inputId}
                className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-violet-500/40 bg-violet-500/5 text-violet-400 transition-colors hover:bg-violet-500/15"
              >
                <FiPlus size={20} />
                <span className="sr-only">Add images to {label}</span>
              </label>
            ) : (
              <span
                aria-hidden
                className="flex aspect-square items-center justify-center rounded-lg border border-violet-500/20 text-violet-500/40"
              >
                <FiPlus size={20} />
              </span>
            )}
          </li>
        ))}
      </ul>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT_ATTR}
        multiple
        className="sr-only"
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  );
}
