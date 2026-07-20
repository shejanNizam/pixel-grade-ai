"use client";

import {
  useGetAllTransactionsQuery,
  type TTransaction,
  type TTxnStatus,
} from "@/redux/features/transaction/transactionApi";
import { Table, type TableColumnsType } from "antd";
import { useState } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { formatUserDate } from "../users/format";

const PAGE_SIZE = 6;

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "succeeded", label: "Succeeded" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]["value"];

const statusColor: Record<TTxnStatus, string> = {
  succeeded: "text-emerald-400",
  pending: "text-amber-400",
  failed: "text-red-400",
  refunded: "text-zinc-400",
};

const userName = (row: TTransaction) =>
  typeof row.user === "object" ? row.user.name : "—";

const userEmail = (row: TTransaction) =>
  typeof row.user === "object" ? row.user.email : null;

export default function TransactionsTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>("all");

  const { data, isFetching } = useGetAllTransactionsQuery({
    page,
    limit: PAGE_SIZE,
    sort: "-createdAt",
    ...(status !== "all" ? { status } : {}),
  });

  const rows = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const columns: TableColumnsType<TTransaction> = [
    {
      title: "Id",
      key: "ref",
      width: 100,
      render: (_, row) => (
        <span className="text-xs text-zinc-400">#{row._id.slice(-4)}</span>
      ),
    },
    {
      title: "Name",
      key: "name",
      align: "center",
      sorter: (a, b) => userName(a).localeCompare(userName(b)),
      render: (_, row) => (
        <span className="text-xs text-zinc-300">{userName(row)}</span>
      ),
    },
    {
      title: "Invoice",
      key: "invoice",
      align: "center",
      render: (_, row) => (
        <span className="text-xs text-zinc-300">
          {row.invoiceNumber ?? row.stripeRef ?? "—"}
        </span>
      ),
    },
    {
      title: "Email",
      key: "email",
      align: "center",
      render: (_, row) => {
        const email = userEmail(row);
        return email ? (
          // `text-*!` beats antd's `.ant-app a { color: colorLink }`.
          <a
            href={`mailto:${email}`}
            className="text-xs text-violet-400! hover:underline"
          >
            {email}
          </a>
        ) : (
          <span className="text-xs text-zinc-500">—</span>
        );
      },
    },
    {
      title: "Date",
      key: "date",
      align: "center",
      render: (_, row) => (
        <span className="text-xs text-zinc-300">
          {formatUserDate(row.createdAt)}
        </span>
      ),
    },
    {
      title: "Type",
      key: "type",
      align: "center",
      width: 110,
      render: (_, row) => (
        <span className="text-xs text-zinc-300">
          {row.type === "subscription"
            ? typeof row.plan === "object"
              ? row.plan.name
              : "Subscription"
            : "Slab order"}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      width: 110,
      render: (_, row) => (
        <span
          className={`inline-flex items-center gap-1.5 text-xs capitalize ${statusColor[row.status]}`}
        >
          <span className="h-1 w-1 rounded-full bg-current" />
          {row.status}
        </span>
      ),
    },
    {
      title: "Total",
      key: "total",
      align: "center",
      width: 110,
      render: (_, row) => (
        <span className="text-xs text-white tabular-nums">
          {row.amount.toLocaleString("en-US", {
            style: "currency",
            currency: (row.currency || "usd").toUpperCase(),
          })}
        </span>
      ),
    },
  ];

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-medium text-white">
          Total transactions ( {total} )
        </h2>

        <div className="relative">
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as StatusFilter);
              setPage(1);
            }}
            aria-label="Filter transactions by status"
            className="w-44 appearance-none rounded-full bg-white py-2.5 pr-9 pl-4 text-sm text-zinc-900 outline-none"
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-600" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <Table<TTransaction>
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
    </section>
  );
}
