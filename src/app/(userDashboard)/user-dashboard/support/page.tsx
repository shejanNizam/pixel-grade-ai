"use client";

import EmptyState from "@/components/shared/EmptyState";
import {
  PRIORITY_COLOR,
  STATUS_COLOR,
  TICKET_PRIORITIES,
  type Ticket,
  type TicketPriority,
} from "@/types/support";
import { App, Button, Form, Input, Select, Tag } from "antd";
import { useState } from "react";
import { FiLifeBuoy } from "react-icons/fi";
import { myTickets } from "../_components/support/data";

interface TicketFormValues {
  subject: string;
  priority: TicketPriority;
  message: string;
}

const CARD = "rounded-xl border border-white/8 bg-[#111113]";

export default function SupportPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm<TicketFormValues>();
  const [tickets, setTickets] = useState<Ticket[]>(myTickets);

  const onFinish = (values: TicketFormValues) => {
    setTickets((prev) => [
      {
        id: crypto.randomUUID(),
        subject: values.subject,
        message: values.message,
        priority: values.priority,
        // New tickets always land in the admin queue as Open.
        status: "Open",
        created: new Date().toISOString().slice(0, 10),
        user: { name: "You", email: "you@example.com" },
        plan: "Pro",
        replies: [],
      },
      ...prev,
    ]);
    form.resetFields();
    message.success("Ticket submitted. Support will reply by email.");
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
            initialValues={{ priority: "Normal" satisfies TicketPriority }}
          >
            <Form.Item<TicketFormValues>
              label="Subject"
              name="subject"
              rules={[{ required: true, message: "Subject is required" }]}
            >
              <Input size="large" placeholder="Brief summary of the issue" />
            </Form.Item>

            <Form.Item<TicketFormValues> label="Priority" name="priority">
              <Select
                size="large"
                options={TICKET_PRIORITIES.map((value) => ({
                  value,
                  label: value,
                }))}
              />
            </Form.Item>

            <Form.Item<TicketFormValues>
              label="Message"
              name="message"
              rules={[{ required: true, message: "Message is required" }]}
            >
              <Input.TextArea rows={4} placeholder="Describe what happened…" />
            </Form.Item>

            <Button type="primary" htmlType="submit" size="large" block>
              Submit ticket
            </Button>
          </Form>
        </div>

        {/* Ticket list */}
        <div>
          <h2 className="mb-4 text-base font-semibold text-white">
            Your tickets
          </h2>

          {tickets.length === 0 ? (
            <EmptyState
              icon={<FiLifeBuoy />}
              title="No tickets yet"
              description="When you open a support ticket it will show up here."
            />
          ) : (
            <ul className="space-y-3">
              {tickets.map((ticket) => (
                <li key={ticket.id} className={`${CARD} p-4`}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 flex-1 truncate font-medium text-white">
                      {ticket.subject}
                    </p>
                    <div className="flex shrink-0 gap-1.5">
                      <Tag color={PRIORITY_COLOR[ticket.priority]}>
                        {ticket.priority}
                      </Tag>
                      <Tag color={STATUS_COLOR[ticket.status]}>
                        {ticket.status}
                      </Tag>
                    </div>
                  </div>

                  <p className="mt-1 text-xs text-zinc-500">{ticket.created}</p>
                  <p className="mt-3 text-sm text-zinc-400">{ticket.message}</p>

                  {/* Staff answers, so a reply isn't stranded in the admin UI. */}
                  {ticket.replies.map((reply) => (
                    <article
                      key={reply.id}
                      className="mt-3 rounded-lg bg-violet-500/10 p-3"
                    >
                      <p className="text-[11px] text-zinc-400">
                        Support · {reply.sent}
                      </p>
                      <p className="mt-1 text-sm text-zinc-300">
                        {reply.message}
                      </p>
                    </article>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
