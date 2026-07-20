"use client";

import {
  useGetAllTicketsQuery,
  type TSupportTicket,
  type TTicketStatus,
} from "@/redux/features/support/supportApi";
import { Table, Tag, type TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";
import { formatUserDate } from "../users/format";
import ReplyTicketModal from "./ReplyTicketModal";

const PAGE_SIZE = 6;

const STATUS_FILTERS = [
  { value: "all", label: "All tickets" },
  { value: "open", label: "Open" },
  { value: "answered", label: "Answered" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]["value"];

export const STATUS_COLOR: Record<TTicketStatus, string> = {
  open: "orange",
  answered: "blue",
  resolved: "green",
  closed: "default",
};

const ticketUser = (ticket: TSupportTicket) =>
  typeof ticket.user === "object" ? ticket.user : null;

export default function TicketsTable() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<StatusFilter>("open");
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);

  // Search matches subjects server-side; debounce and reset the page.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchTerm(query.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useGetAllTicketsQuery({
    page,
    limit: PAGE_SIZE,
    sort: "-createdAt",
    ...(filter !== "all" ? { status: filter } : {}),
    ...(searchTerm ? { searchTerm } : {}),
  });

  // A one-row query whose meta.total is the live open count for the badge.
  const { data: openData } = useGetAllTicketsQuery({ status: "open", limit: 1 });

  const rows = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const openCount = openData?.meta?.total ?? 0;

  const columns: TableColumnsType<TSupportTicket> = [
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
      render: (_, ticket) => {
        const user = ticketUser(ticket);
        if (!user) return <span className="text-xs text-zinc-500">—</span>;
        return (
          <div className="leading-tight">
            <p className="text-xs text-zinc-300">{user.name}</p>
            {/* `text-*!` beats antd's `.ant-app a { color: colorLink }`. */}
            <a
              href={`mailto:${user.email}`}
              className="text-[11px] text-violet-400! hover:underline"
            >
              {user.email}
            </a>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: TTicketStatus) => (
        <Tag color={STATUS_COLOR[status]} className="capitalize">
          {status}
        </Tag>
      ),
    },
    {
      title: "Created",
      key: "created",
      align: "center",
      sorter: (a, b) =>
        (a.createdAt ?? "").localeCompare(b.createdAt ?? ""),
      render: (_, ticket) => (
        <span className="text-xs text-zinc-300">
          {formatUserDate(ticket.createdAt)}
        </span>
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
          onClick={() => setOpenTicketId(ticket._id)}
          className="rounded-full bg-violet-600 px-4 py-1.5 text-xs text-white transition-colors hover:bg-violet-700"
        >
          {ticket.status === "open" ? "Reply" : "View"}
        </button>
      ),
    },
  ];

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-medium text-white">
          Support tickets ( {total} )
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
              onChange={(event) => {
                setFilter(event.target.value as StatusFilter);
                setPage(1);
              }}
              aria-label="Filter tickets by status"
              className="w-40 appearance-none rounded-full bg-white py-2.5 pr-9 pl-4 text-sm text-zinc-900 outline-none"
            >
              {STATUS_FILTERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-600" />
          </div>

          <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by subject"
              aria-label="Search tickets by subject"
              className="w-full rounded-full bg-white py-2.5 pr-13 pl-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
            />
            <span className="absolute top-1/2 right-1 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-violet-600 text-white">
              <FiSearch size={16} />
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <Table<TSupportTicket>
          columns={columns}
          dataSource={rows}
          rowKey="_id"
          loading={isFetching}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            showSizeChanger: false,
            onChange: setPage,
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
        ticketId={openTicketId}
        onClose={() => setOpenTicketId(null)}
      />
    </section>
  );
}
