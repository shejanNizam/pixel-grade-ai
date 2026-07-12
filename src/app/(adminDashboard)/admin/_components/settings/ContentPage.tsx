"use client";

import { App } from "antd";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import BackHeading from "../BackHeading";
import RichTextEditor from "./RichTextEditor";

interface ContentPageProps {
  /** "About us" — the edit screen prefixes it with "Edit". */
  title: string;
  initialContent: string;
}

/**
 * The About us / Privacy / Terms screens: read-only prose with an Edit button,
 * which swaps in the rich-text editor plus Save and Cancel.
 */
export default function ContentPage({
  title,
  initialContent,
}: ContentPageProps) {
  const { message } = App.useApp();

  const [content, setContent] = useState(initialContent);
  const [editing, setEditing] = useState(false);
  /** The editor's working copy — only committed to `content` on save. */
  const [draft, setDraft] = useState(initialContent);

  const startEditing = () => {
    setDraft(content);
    setEditing(true);
  };

  const save = () => {
    setContent(draft);
    setEditing(false);
    message.success(`${title} updated.`);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <BackHeading
          label={editing ? `Edit ${title.toLowerCase()}` : title}
          className=""
        />

        {editing ? (
          <div className="flex items-center gap-3">
            <button
              onClick={save}
              className="rounded-full bg-violet-600 px-5 py-2 text-sm text-white transition-colors hover:bg-violet-700"
            >
              Save changes
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded-full border border-amber-500/60 px-5 py-2 text-sm text-amber-400 transition-colors hover:bg-amber-500/10"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={startEditing}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm text-white transition-colors hover:border-violet-500"
          >
            <FiEdit size={13} />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <RichTextEditor value={content} onChange={setDraft} />
      ) : (
        <div
          className="rounded-2xl border border-violet-500/40 bg-black p-6 text-sm leading-relaxed text-zinc-300 [&_a]:text-violet-400 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-violet-500 [&_blockquote]:pl-4 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-white [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
          // Editor-authored HTML. Sanitise server-side once this is API-backed.
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}
