"use client";

import EmptyState from "@/components/shared/EmptyState";
import { App, Button, Form, Input, Select, Tag } from "antd";
import { useState } from "react";
import { FiLifeBuoy } from "react-icons/fi";

interface TicketFormValues {
  subject: string;
  priority: "Low" | "Normal" | "High";
  message: string;
}

interface Ticket extends TicketFormValues {
  id: string;
  created: string;
}

const priorityColor: Record<TicketFormValues["priority"], string> = {
  Low: "default",
  Normal: "blue",
  High: "red",
};

// Demo page showing a form + the reusable EmptyState component.
// Tickets live in local state only — no API call.
export default function SupportPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm<TicketFormValues>();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const onFinish = (values: TicketFormValues) => {
    setTickets((prev) => [
      {
        ...values,
        id: `TCK-${String(prev.length + 1).padStart(4, "0")}`,
        created: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    form.resetFields();
    message.success("Ticket submitted (demo).");
  };

  return (
    <div className="w-full mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Support
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          A demo form + empty-state page. Submitting stores the ticket in local
          state only.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New ticket form */}
        <div className="bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
            Open a ticket
          </h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            initialValues={{ priority: "Normal" }}
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
                options={[
                  { value: "Low", label: "Low" },
                  { value: "Normal", label: "Normal" },
                  { value: "High", label: "High" },
                ]}
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
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
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
                <li
                  key={ticket.id}
                  className="bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {ticket.subject}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {ticket.id} · {ticket.created}
                      </p>
                    </div>
                    <Tag color={priorityColor[ticket.priority]}>
                      {ticket.priority}
                    </Tag>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {ticket.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
