"use client";

import { App, Dropdown, Table, type TableColumnsType } from "antd";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiSearch,
} from "react-icons/fi";
import BlockUserModal from "./BlockUserModal";
import { ALL_USERS, PAGE_SIZE, type AdminUser, type UserStatus } from "./data";

interface UsersTableProps {
  /** Rendered as "{heading} ( n )" above the table. */
  heading: string;
  seed: AdminUser[];
  /** The page's own status — the second filter option, and what an unblock restores. */
  status: UserStatus;
  /** Off where every row already shares one status, which makes filtering pointless. */
  showFilter?: boolean;
}

export default function UsersTable({
  heading,
  seed,
  status,
  showFilter = true,
}: UsersTableProps) {
  const router = useRouter();
  const { message } = App.useApp();

  // Local copy: blocking a user flips their status until the API exists.
  const [users, setUsers] = useState(seed);
  const [filter, setFilter] = useState<string>(ALL_USERS);
  const [query, setQuery] = useState("");
  const [blockingId, setBlockingId] = useState<string | null>(null);

  const filters = [ALL_USERS, status];

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesFilter = filter === ALL_USERS || user.status === filter;
      const matchesQuery =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.ref.toLowerCase().includes(term);

      return matchesFilter && matchesQuery;
    });
  }, [users, filter, query]);

  const blockingUser = users.find((user) => user.id === blockingId);

  const setStatus = (id: string, next: UserStatus) =>
    setUsers((current) =>
      current.map((user) =>
        user.id === id ? { ...user, status: next } : user,
      ),
    );

  const confirmBlock = (reason: string) => {
    if (!blockingId) return;

    if (!reason.trim()) {
      message.error("A block reason is required.");
      return;
    }

    setStatus(blockingId, "Blocked");
    setBlockingId(null);
    message.success("User blocked.");
  };

  const columns: TableColumnsType<AdminUser> = [
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
      render: (value: UserStatus) => (
        <span
          className={`inline-flex items-center gap-1.5 text-xs ${
            value === "Blocked" ? "text-red-400" : "text-emerald-400"
          }`}
        >
          <span className="h-1 w-1 rounded-full bg-current" />
          {value}
        </span>
      ),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      align: "center",
      render: (state: string) => (
        <span className="text-xs text-zinc-300">{state}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 90,
      align: "center",
      render: (_, user) => {
        const blocked = user.status === "Blocked";

        return (
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              items: [
                blocked
                  ? { key: "unblock", label: "Unlock user" }
                  : { key: "block", label: "Block user", danger: true },
                { key: "details", label: "Details" },
              ],
              onClick: ({ key }) => {
                if (key === "details") router.push(`/admin/users/${user.id}`);
                else if (key === "block") setBlockingId(user.id);
                else {
                  setStatus(user.id, status);
                  message.success("User unlocked.");
                }
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
        );
      },
    },
  ];

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-medium text-white">
          {heading} ( {rows.length} )
        </h2>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          {showFilter && (
            <div className="relative">
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="Filter users"
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
          )}

          <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
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
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <Table<AdminUser>
          columns={columns}
          dataSource={rows}
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

      <BlockUserModal
        open={blockingId !== null}
        userName={blockingUser?.name ?? ""}
        onCancel={() => setBlockingId(null)}
        onSend={confirmBlock}
      />
    </section>
  );
}
