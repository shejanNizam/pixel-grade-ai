"use client";

import {
  PRIORITY_COLOR,
  STATUS_COLOR,
  type Ticket,
} from "@/types/support";
import { App, ConfigProvider, Modal, Tag } from "antd";
import { useEffect, useState } from "react";

interface ReplyTicketModalProps {
  /** The ticket being answered; null closes the dialog. */
  ticket: Ticket | null;
  onCancel: () => void;
  /** `resolve` closes the ticket out; otherwise it moves to Answered. */
  onSend: (message: string, resolve: boolean) => void;
}

export default function ReplyTicketModal({
  ticket,
  onCancel,
  onSend,
}: ReplyTicketModalProps) {
  const { message: toast } = App.useApp();
  const [reply, setReply] = useState("");
  const [resolve, setResolve] = useState(false);

  // Reset per ticket so one reply never carries into the next thread.
  useEffect(() => {
    if (!ticket) return;
    setReply("");
    setResolve(false);
  }, [ticket]);

  const submit = () => {
    if (!reply.trim()) {
      toast.error("Write a reply before sending.");
      return;
    }
    onSend(reply.trim(), resolve);
  };

  return (
    <ConfigProvider theme={{ components: { Modal: { contentBg: "#3f3f46" } } }}>
      <Modal
        open={ticket !== null}
        onCancel={onCancel}
        footer={null}
        centered
        width={620}
        title={null}
      >
        {ticket && (
          <div className="py-2">
            <h2 className="pr-8 text-lg font-semibold text-white">
              {ticket.subject}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Tag color={PRIORITY_COLOR[ticket.priority]}>
                {ticket.priority}
              </Tag>
              <Tag color={STATUS_COLOR[ticket.status]}>{ticket.status}</Tag>
              <Tag>{ticket.plan}</Tag>
              <span className="text-xs text-zinc-400">
                {ticket.user.name} · {ticket.user.email} · {ticket.created}
              </span>
            </div>

            {/* The thread: the original message, then every reply in order. */}
            <div className="mt-5 max-h-64 space-y-3 overflow-y-auto pr-1">
              <article className="rounded-xl bg-white/5 p-4">
                <p className="text-[11px] text-zinc-400">
                  {ticket.user.name} · {ticket.created}
                </p>
                <p className="mt-1.5 text-sm text-zinc-200">{ticket.message}</p>
              </article>

              {ticket.replies.map((entry) => (
                <article
                  key={entry.id}
                  className={`rounded-xl p-4 ${
                    entry.from === "support"
                      ? "ml-6 bg-violet-500/15"
                      : "bg-white/5"
                  }`}
                >
                  <p className="text-[11px] text-zinc-400">
                    {entry.from === "support" ? "Support" : ticket.user.name} ·{" "}
                    {entry.sent}
                  </p>
                  <p className="mt-1.5 text-sm text-zinc-200">
                    {entry.message}
                  </p>
                </article>
              ))}
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-medium text-white">Reply</span>
              <textarea
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                rows={4}
                placeholder="Write your response…"
                className="mt-2 w-full resize-y rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-violet-400"
              />
            </label>

            <label className="mt-3 flex items-center gap-2.5 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={resolve}
                onChange={(event) => setResolve(event.target.checked)}
                className="h-4 w-4 accent-violet-600"
              />
              Mark this ticket resolved
            </label>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-white transition-colors hover:border-white/50"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
              >
                Send reply
              </button>
            </div>
          </div>
        )}
      </Modal>
    </ConfigProvider>
  );
}
