"use client";

import {
  useAddTicketMessageMutation,
  useGetTicketQuery,
  useUpdateTicketStatusMutation,
} from "@/redux/features/support/supportApi";
import { App, ConfigProvider, Modal, Tag } from "antd";
import { useEffect, useState } from "react";
import { formatUserDate } from "../users/format";
import { STATUS_COLOR } from "./TicketsTable";

interface ReplyTicketModalProps {
  /** The ticket thread to open; null closes the dialog. */
  ticketId: string | null;
  onClose: () => void;
}

export default function ReplyTicketModal({
  ticketId,
  onClose,
}: ReplyTicketModalProps) {
  const { message: toast } = App.useApp();
  const [reply, setReply] = useState("");
  const [resolve, setResolve] = useState(false);

  const { data, isLoading } = useGetTicketQuery(ticketId ?? "", {
    skip: !ticketId,
  });
  const [addMessage, { isLoading: isSending }] = useAddTicketMessageMutation();
  const [updateStatus] = useUpdateTicketStatusMutation();

  // Reset per ticket so one reply never carries into the next thread.
  useEffect(() => {
    if (!ticketId) return;
    setReply("");
    setResolve(false);
  }, [ticketId]);

  const ticket = data?.ticket;
  const messages = data?.messages ?? [];
  const owner = ticket && typeof ticket.user === "object" ? ticket.user : null;
  const closed = ticket?.status === "closed";

  const submit = async () => {
    if (!ticketId || isSending) return;
    if (!reply.trim()) {
      toast.error("Write a reply before sending.");
      return;
    }

    try {
      // The staff reply flips the ticket to `answered` server-side; resolving
      // is a second, explicit status change on top.
      await addMessage({ ticketId, message: reply.trim() }).unwrap();
      if (resolve) {
        await updateStatus({ ticketId, status: "resolved" }).unwrap();
      }
      toast.success(resolve ? "Replied and resolved." : "Reply sent.");
      onClose();
    } catch {
      toast.error("Couldn't send the reply. Try again.");
    }
  };

  return (
    <ConfigProvider theme={{ components: { Modal: { contentBg: "#3f3f46" } } }}>
      <Modal
        open={ticketId !== null}
        onCancel={onClose}
        footer={null}
        centered
        width={620}
        title={null}
      >
        {isLoading || !ticket ? (
          <div className="space-y-3 py-2">
            <div className="h-6 w-2/3 animate-pulse rounded bg-white/10" />
            <div className="h-24 animate-pulse rounded-xl bg-white/5" />
          </div>
        ) : (
          <div className="py-2">
            <h2 className="pr-8 text-lg font-semibold text-white">
              {ticket.subject}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Tag color={STATUS_COLOR[ticket.status]} className="capitalize">
                {ticket.status}
              </Tag>
              {owner && (
                <span className="text-xs text-zinc-400">
                  {owner.name} · {owner.email} ·{" "}
                  {formatUserDate(ticket.createdAt)}
                </span>
              )}
            </div>

            {/* The thread, oldest first — the opener's message is simply the
                first row, the backend keeps no separate "description". */}
            <div className="mt-5 max-h-64 space-y-3 overflow-y-auto pr-1">
              {messages.map((entry) => {
                const sender =
                  typeof entry.sender === "object" ? entry.sender : null;
                return (
                  <article
                    key={entry._id}
                    className={`rounded-xl p-4 ${
                      entry.isAdmin ? "ml-6 bg-violet-500/15" : "bg-white/5"
                    }`}
                  >
                    <p className="text-[11px] text-zinc-400">
                      {entry.isAdmin
                        ? `Support${sender ? ` (${sender.name})` : ""}`
                        : (sender?.name ?? owner?.name ?? "User")}{" "}
                      · {formatUserDate(entry.createdAt)}
                    </p>
                    <p className="mt-1.5 text-sm text-zinc-200">
                      {entry.message}
                    </p>
                  </article>
                );
              })}
            </div>

            {closed ? (
              <p className="mt-5 rounded-xl border border-white/15 p-4 text-sm text-zinc-400">
                This ticket is closed — replies are disabled.
              </p>
            ) : (
              <>
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
              </>
            )}

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-white transition-colors hover:border-white/50"
              >
                {closed ? "Close" : "Cancel"}
              </button>
              {!closed && (
                <button
                  onClick={submit}
                  disabled={isSending}
                  className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSending ? "Sending…" : "Send reply"}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </ConfigProvider>
  );
}
