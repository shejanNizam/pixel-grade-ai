"use client";

import { App, Dropdown, Table, type TableColumnsType } from "antd";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FiMoreVertical, FiSearch } from "react-icons/fi";
import { recentUsers, recentUsersTotal, type RecentUser } from "./data";

export default function RecentUsers() {
  const router = useRouter();
  const { message } = App.useApp();
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return recentUsers;

    return recentUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.ref.toLowerCase().includes(term),
    );
  }, [query]);

  const columns: TableColumnsType<RecentUser> = [
    {
      title: "Id",
      dataIndex: "ref",
      key: "ref",
      width: 100,
      render: (ref: string) => (
        <span className="text-xs text-zinc-400">{ref}</span>
      ),
    },
    {
      title: "User name",
      dataIndex: "name",
      key: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string) => (
        <span className="text-xs text-zinc-300">{name}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      render: (email: string) => (
        // `text-*!` beats antd's `.ant-app a { color: colorLink }`.
        <a
          href={`mailto:${email}`}
          className="text-xs text-violet-400! hover:underline"
        >
          {email}
        </a>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      render: (date: string) => (
        <span className="text-xs text-zinc-300">{date}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="h-1 w-1 rounded-full bg-current" />
          {status}
        </span>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      align: "center",
      render: (country: string) => (
        <span className="text-xs text-zinc-300">{country}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 90,
      align: "center",
      render: (_, user) => (
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          menu={{
            items: [
              { key: "details", label: "Details" },
              { key: "block", label: "Block user", danger: true },
            ],
            onClick: ({ key }) => {
              if (key === "details") router.push(`/admin/users/${user.id}`);
              else message.info(`Block ${user.name} (demo).`);
            },
          }}
        >
          <button
            type="button"
            aria-label={`Actions for ${user.name}`}
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
          Most recent users ( {recentUsersTotal} )
        </h2>

        <div className="relative w-full sm:w-80">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or ID"
            aria-label="Search users by name or ID"
            className="w-full rounded-full bg-white py-2.5 pr-13 pl-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
          />
          <span className="absolute top-1/2 right-1 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-violet-600 text-white">
            <FiSearch size={16} />
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <Table<RecentUser>
          columns={columns}
          dataSource={rows}
          rowKey="id"
          pagination={false}
          scroll={{ x: 900 }}
          size="middle"
        />
      </div>
    </section>
  );
}
