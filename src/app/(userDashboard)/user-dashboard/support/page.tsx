"use client";

import EmptyState from "@/components/shared/EmptyState";
import {
  useAddTicketMessageMutation,
  useCreateTicketMutation,
  useGetMyTicketsQuery,
  useGetTicketQuery,
  type TSupportTicket,
  type TTicketStatus,
} from "@/redux/features/support/supportApi";
import { App, Button, Form, Input, Tag } from "antd";
import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiLifeBuoy } from "react-icons/fi";

interface TicketFormValues {
  subject: string;
  message: string;
}

const CARD = "rounded-xl border border-white/8 bg-[#111113]";

const STATUS_COLOR: Record<TTicketStatus, string> = {
  open: "orange",
  answered: "blue",
  resolved: "green",
  closed: "default",
};

const dateOf = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

/** One ticket row; expanding it fetches and shows the message thread. */
function TicketRow({ ticket }: { ticket: TSupportTicket }) {
  const { message } = App.useApp();
  const [expanded, setExpanded] = useState(false);
  const [reply, setReply] = useState("");

  const { data: thread, isFetching } = useGetTicketQuery(ticket._id, {
    skip: !expanded,
  });
  const [addMessage, { isLoading: isSending }] = useAddTicketMessageMutation();

  const closed = ticket.status === "closed";

  const sendReply = async () => {
    if (!reply.trim() || isSending) return;
    try {
      await addMessage({ ticketId: ticket._id, message: reply.trim() }).unwrap();
      setReply("");
      message.success("Reply sent.");
    } catch {
      message.error("Couldn't send the reply. Try again.");
    }
  };

  return (
    <li className={`${CARD} p-4`}>
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="flex w-full items-start justify-between gap-3 text-left"
        aria-expanded={expanded}
      >
        <p className="min-w-0 flex-1 truncate font-medium text-white">
          {ticket.subject}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <Tag color={STATUS_COLOR[ticket.status]} className="capitalize">
            {ticket.status}
          </Tag>
          {expanded ? (
            <FiChevronUp className="text-zinc-400" />
          ) : (
            <FiChevronDown className="text-zinc-400" />
          )}
        </div>
      </button>

      <p className="mt-1 text-xs text-zinc-500">{dateOf(ticket.createdAt)}</p>

      {expanded && (
        <div className="mt-3 space-y-3">
          {isFetching && !thread ? (
            <div className="h-16 animate-pulse rounded-lg bg-white/5" />
          ) : (
            (thread?.messages ?? []).map((entry) => (
              <article
                key={entry._id}
                className={`rounded-lg p-3 ${
                  entry.isAdmin ? "bg-violet-500/10" : "bg-white/5"
                }`}
              >
                <p className="text-[11px] text-zinc-400">
                  {entry.isAdmin ? "Support" : "You"} ·{" "}
                  {dateOf(entry.createdAt)}
                </p>
                <p className="mt-1 text-sm text-zinc-300">{entry.message}</p>
              </article>
            ))
          )}

          {closed ? (
            <p className="rounded-lg border border-white/10 p-3 text-xs text-zinc-500">
              This ticket is closed. Open a new one to continue.
            </p>
          ) : (
            <div className="flex gap-2">
              <Input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onPressEnter={sendReply}
                placeholder="Write a reply…"
                size="large"
              />
              <Button
                type="primary"
                size="large"
                loading={isSending}
                onClick={sendReply}
              >
                Send
              </Button>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export default function SupportPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm<TicketFormValues>();

  const { data, isLoading } = useGetMyTicketsQuery({
    limit: 20,
    sort: "-createdAt",
  });
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();

  const tickets = data?.data ?? [];

  const onFinish = async (values: TicketFormValues) => {
    if (isCreating) return;
    try {
      await createTicket({
        subject: values.subject.trim(),
        message: values.message.trim(),
      }).unwrap();
      form.resetFields();
      message.success("Ticket submitted. Support will reply here.");
    } catch {
      message.error("Couldn't submit the ticket. Try again.");
    }
  };

  return (
    <div className="mx-auto w-full space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white sm:text-2xl">Support</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Open a ticket and our team will get back to you. Pro and Enterprise
          plans get priority response.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* New ticket form */}
        <div className={`${CARD} p-6`}>
          <h2 className="mb-4 text-base font-semibold text-white">
            Open a ticket
          </h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item<TicketFormValues>
              label="Subject"
              name="subject"
              rules={[{ required: true, message: "Subject is required" }]}
            >
              <Input size="large" placeholder="Brief summary of the issue" />
            </Form.Item>

            <Form.Item<TicketFormValues>
              label="Message"
              name="message"
              rules={[{ required: true, message: "Message is required" }]}
            >
              <Input.TextArea rows={4} placeholder="Describe what happened…" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isCreating}
            >
              Submit ticket
            </Button>
          </Form>
        </div>

        {/* Ticket list */}
        <div>
          <h2 className="mb-4 text-base font-semibold text-white">
            Your tickets
          </h2>

          {isLoading ? (
            <ul className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <li key={i} className={`${CARD} h-20 animate-pulse`} />
              ))}
            </ul>
          ) : tickets.length === 0 ? (
            <EmptyState
              icon={<FiLifeBuoy />}
              title="No tickets yet"
              description="When you open a support ticket it will show up here."
            />
          ) : (
            <ul className="space-y-3">
              {tickets.map((ticket) => (
                <TicketRow key={ticket._id} ticket={ticket} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
