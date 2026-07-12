"use client";

import { useEffect, useState } from "react";

interface BlockUserModalProps {
  open: boolean;
  userName: string;
  onCancel: () => void;
  onSend: (reason: string, description: string) => void;
}

export default function BlockUserModal({
  open,
  userName,
  onCancel,
  onSend,
}: BlockUserModalProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  // Each open is a fresh block — don't carry the last user's reason over.
  useEffect(() => {
    if (open) {
      setReason("");
      setDescription("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Block ${userName}`}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 className="text-center text-base font-semibold text-red-600">
          Write block reason and description
        </h2>

        <label className="mt-6 block text-sm text-zinc-900">
          Write block reason
          <input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Write reason here."
            className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-violet-500"
          />
        </label>

        <label className="mt-4 block text-sm text-zinc-900">
          Describe reason
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            placeholder="Describe the reason here."
            className="mt-2 w-full resize-none rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-violet-500"
          />
        </label>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={onCancel}
            className="min-w-32 rounded-full border border-red-400 px-6 py-2.5 text-sm text-zinc-900 transition-colors hover:bg-red-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend(reason, description)}
            className="min-w-32 rounded-full bg-violet-600 px-6 py-2.5 text-sm text-white transition-colors hover:bg-violet-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
