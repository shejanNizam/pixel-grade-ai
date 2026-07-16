"use client";

import {
  PRIORITY_COLOR,
  STATUS_COLOR,
  TICKET_STATUSES,
  type Ticket,
  type TicketStatus,
} from "@/types/support";
import { App, Table, Tag, type TableColumnsType } from "antd";
import { useMemo, useState } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";
import { ALL_TICKETS, PAGE_SIZE, tickets as seed } from "./data";
import ReplyTicketModal from "./ReplyTicketModal";

const today = () => new Date().toISOString().slice(0, 10);

export default function TicketsTable() {
  const { message } = App.useApp();

  // Local copy: replying flips status until the API exists.
  const [rows, setRows] = useState<Ticket[]>(seed);
  const [filter, setFilter] = useState<string>("Open");
  const [query, setQuery] = useState("");
  const [replyingId, setReplyingId] = useState<string | null>(null);

  const filters = [ALL_TICKETS, ...TICKET_STATUSES];

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();

    return rows.filter((ticket) => {
      const matchesFilter = filter === ALL_TICKETS || ticket.status === filter;
      const matchesQuery =
        !term ||
        ticket.subject.toLowerCase().includes(term) ||
        ticket.user.name.toLowerCase().includes(term) ||
        ticket.user.email.toLowerCase().includes(term);

      return matchesFilter && matchesQuery;
    });
  }, [rows, filter, query]);

  const replying = rows.find((ticket) => ticket.id === replyingId) ?? null;

  const sendReply = (body: string, resolve: boolean) => {
    if (!replyingId) return;

    setRows((current) =>
      current.map((ticket) =>
        ticket.id === replyingId
          ? {
              ...ticket,
              status: (resolve ? "Resolved" : "Answered") as TicketStatus,
              replies: [
                ...ticket.replies,
                {
                  id: crypto.randomUUID(),
                  from: "support" as const,
                  message: body,
                  sent: today(),
                },
              ],
            }
          : ticket,
      ),
    );

    setReplyingId(null);
    message.success(resolve ? "Replied and resolved." : "Reply sent.");
  };

  const columns: TableColumnsType<Ticket> = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject: string) => (
        <span className="text-xs text-zinc-200">{subject}</span>
      ),
    },
    {
      title: "User",
      key: "user",
      align: "center",
      render: (_, ticket) => (
        <div className="leading-tight">
          <p className="text-xs text-zinc-300">{ticket.user.name}</p>
          {/* `text-*!` beats antd's `.ant-app a { color: colorLink }`. */}
          <a
            href={`mailto:${ticket.user.email}`}
            className="text-[11px] text-violet-400! hover:underline"
          >
            {ticket.user.email}
          </a>
        </div>
      ),
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      align: "center",
      render: (plan: string) => (
        <span className="text-xs text-zinc-300">{plan}</span>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      align: "center",
      render: (priority: Ticket["priority"]) => (
        <Tag color={PRIORITY_COLOR[priority]}>{priority}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: TicketStatus) => (
        <Tag color={STATUS_COLOR[status]}>{status}</Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "created",
      key: "created",
      align: "center",
      sorter: (a, b) => a.created.localeCompare(b.created),
      render: (created: string) => (
        <span className="text-xs text-zinc-300">{created}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 110,
      align: "center",
      render: (_, ticket) => (
        <button
          type="button"
          onClick={() => setReplyingId(ticket.id)}
          className="rounded-full bg-violet-600 px-4 py-1.5 text-xs text-white transition-colors hover:bg-violet-700"
        >
          {ticket.status === "Open" ? "Reply" : "View"}
        </button>
      ),
    },
  ];

  const openCount = rows.filter((ticket) => ticket.status === "Open").length;

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-medium text-white">
          Support tickets ( {visible.length} )
          {openCount > 0 && (
            <span className="ml-2 rounded-full bg-orange-500/15 px-2.5 py-1 text-[11px] font-medium text-orange-400">
              {openCount} open
            </span>
          )}
        </h2>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <div className="relative">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter tickets by status"
              className="w-40 appearance-none rounded-full bg-white py-2.5 pr-9 pl-4 text-sm text-zinc-900 outline-none"
            >
              {filters.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-600" />
          </div>

          <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by subject or user"
              aria-label="Search tickets by subject or user"
              className="w-full rounded-full bg-white py-2.5 pr-13 pl-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
            />
            <span className="absolute top-1/2 right-1 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-violet-600 text-white">
              <FiSearch size={16} />
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <Table<Ticket>
          columns={columns}
          dataSource={visible}
          rowKey="id"
          pagination={{
            pageSize: PAGE_SIZE,
            showSizeChanger: false,
            // The design labels the arrows "Back" and "Next" rather than using
            // bare chevrons.
            itemRender: (_page, type, element) => {
              if (type === "prev") {
                return (
                  <button className="inline-flex items-center gap-1 px-1 text-xs">
                    <FiChevronLeft size={12} />
                    Back
                  </button>
                );
              }
              if (type === "next") {
                return (
                  <button className="inline-flex items-center gap-1 px-1 text-xs">
                    Next
                    <FiChevronRight size={12} />
                  </button>
                );
              }
              return element;
            },
          }}
          scroll={{ x: 900 }}
          size="middle"
        />
      </div>

      <ReplyTicketModal
        ticket={replying}
        onCancel={() => setReplyingId(null)}
        onSend={sendReply}
      />
    </section>
  );
}
