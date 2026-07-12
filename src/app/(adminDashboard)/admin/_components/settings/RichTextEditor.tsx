"use client";

import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import type { ReactNode } from "react";
import {
  FiBold,
  FiCode,
  FiItalic,
  FiLink,
  FiList,
  FiRotateCcw,
  FiRotateCw,
  FiUnderline,
} from "react-icons/fi";
import {
  MdFormatQuote,
  MdFormatStrikethrough,
  MdOutlineFormatListNumbered,
} from "react-icons/md";

interface RichTextEditorProps {
  /** Initial HTML. Only read on mount — the editor owns the content after that. */
  value: string;
  onChange: (html: string) => void;
}

/** Heading levels the size dropdown offers, keyed by the px size shown to the user. */
const SIZES = [
  { label: "16", level: 0 },
  { label: "20", level: 3 },
  { label: "24", level: 2 },
  { label: "32", level: 1 },
] as const;

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex h-7 w-7 items-center justify-center rounded transition-colors disabled:opacity-40 ${
        active ? "bg-white/25 text-white" : "text-white/80 hover:bg-white/15"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  // Which size is active: the current heading level, or 0 for body text.
  const activeLevel =
    SIZES.find(
      (size) =>
        size.level > 0 && editor.isActive("heading", { level: size.level }),
    )?.level ?? 0;

  const setSize = (level: number) => {
    if (level === 0) editor.chain().focus().setParagraph().run();
    else
      editor
        .chain()
        .focus()
        .toggleHeading({ level: level as 1 | 2 | 3 })
        .run();
  };

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");

    // Cancelled — leave the selection untouched.
    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const divider = <span className="mx-0.5 h-4 w-px bg-white/25" />;

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-lg bg-violet-700 px-2 py-1.5">
      <select
        value={activeLevel}
        onChange={(event) => setSize(Number(event.target.value))}
        aria-label="Text size"
        className="mr-1 rounded bg-transparent py-0.5 pr-1 text-xs text-white outline-none"
      >
        {SIZES.map((size) => (
          <option key={size.label} value={size.level} className="bg-zinc-800">
            {size.label}
          </option>
        ))}
      </select>

      {divider}

      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FiBold size={13} />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FiItalic size={13} />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <FiUnderline size={13} />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <MdFormatStrikethrough size={15} />
      </ToolbarButton>

      {divider}

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FiList size={13} />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <MdOutlineFormatListNumbered size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <MdFormatQuote size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <FiCode size={13} />
      </ToolbarButton>

      {divider}

      <ToolbarButton
        label="Link"
        active={editor.isActive("link")}
        onClick={setLink}
      >
        <FiLink size={13} />
      </ToolbarButton>

      {divider}

      <ToolbarButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <FiRotateCcw size={13} />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <FiRotateCw size={13} />
      </ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false },
      }),
    ],
    content: value,
    // Next renders this on the server first; deferring the first paint avoids
    // a hydration mismatch.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-invert min-h-96 max-w-none px-5 pb-5 text-sm leading-relaxed text-zinc-300 outline-none [&_a]:text-violet-400 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-violet-500 [&_blockquote]:pl-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-white [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5",
      },
    },
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
  });

  if (!editor) return null;

  return (
    <div className="rounded-2xl border border-violet-500/40 bg-black">
      <div className="p-3">
        <Toolbar editor={editor} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
