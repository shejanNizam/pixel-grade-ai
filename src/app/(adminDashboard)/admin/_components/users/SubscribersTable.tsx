"use client";

import {
  useGetSubscribersQuery,
  type TSubscriberRow,
} from "@/redux/features/subscription/subscriptionApi";
import { Table, type TableColumnsType } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiSearch,
} from "react-icons/fi";
import { Dropdown } from "antd";
import { formatUserDate } from "./format";
import { PAGE_SIZE } from "./UsersTable";

/** Admin list of paying users — one row per subscription, user + plan joined
 *  in by the backend. Unfiltered it shows active and past_due only. */
export default function SubscribersTable() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchTerm(query.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useGetSubscribersQuery({
    page,
    limit: PAGE_SIZE,
    ...(searchTerm ? { searchTerm } : {}),
  });

  const rows = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const columns: TableColumnsType<TSubscriberRow> = [
    {
      title: "Id",
      key: "ref",
      width: 100,
      render: (_, row) => (
        <span className="text-xs text-zinc-400">#{row._id.slice(-4)}</span>
      ),
    },
    {
      title: "User name",
      key: "name",
      align: "center",
      sorter: (a, b) => a.user.name.localeCompare(b.user.name),
      render: (_, row) => (
        <span className="text-xs text-zinc-300">{row.user.name}</span>
      ),
    },
    {
      title: "Email",
      key: "email",
      align: "center",
      render: (_, row) => (
        // `text-*!` beats antd's `.ant-app a { color: colorLink }`.
        <a
          href={`mailto:${row.user.email}`}
          className="text-xs text-violet-400! hover:underline"
        >
          {row.user.email}
        </a>
      ),
    },
    {
      title: "Plan",
      key: "plan",
      align: "center",
      render: (_, row) => (
        <span className="text-xs text-zinc-300">
          {row.plan.name}{" "}
          <span className="text-zinc-500">({row.interval})</span>
        </span>
      ),
    },
    {
      title: "Subscribed",
      key: "subscribedAt",
      align: "center",
      render: (_, row) => (
        <span className="text-xs text-zinc-300">
          {formatUserDate(row.subscribedAt)}
        </span>
      ),
    },
    {
      title: "Renews",
      key: "renews",
      align: "center",
      render: (_, row) => (
        <span className="text-xs text-zinc-300">
          {row.cancelAtPeriodEnd
            ? `Ends ${formatUserDate(row.currentPeriodEnd)}`
            : formatUserDate(row.currentPeriodEnd)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: TSubscriberRow["status"]) => (
        <span
          className={`inline-flex items-center gap-1.5 text-xs capitalize ${
            status === "active" ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          <span className="h-1 w-1 rounded-full bg-current" />
          {status.replace("_", " ")}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 90,
      align: "center",
      render: (_, row) => (
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          menu={{
            items: [{ key: "details", label: "Details" }],
            onClick: () => router.push(`/admin/users/${row.user._id}`),
          }}
        >
          <button
            type="button"
            aria-label={`Actions for ${row.user.name}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <FiMoreVertical />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-medium text-white">
          Total subscribed users ( {total} )
        </h2>

        <div className="relative w-full sm:w-80">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or email"
            aria-label="Search subscribers by name or email"
            className="w-full rounded-full bg-white py-2.5 pr-13 pl-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
          />
          <span className="absolute top-1/2 right-1 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-violet-600 text-white">
            <FiSearch size={16} />
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <Table<TSubscriberRow>
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
