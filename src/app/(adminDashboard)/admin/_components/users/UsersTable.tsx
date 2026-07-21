"use client";

import {
  useGetAllUsersQuery,
  useUpdateUserByAdminMutation,
} from "@/redux/features/user/userApi";
import type { TUser } from "@/types/auth";
import { App, Dropdown, Table, type TableColumnsType } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiSearch,
} from "react-icons/fi";
import BlockUserModal from "./BlockUserModal";
import { formatUserDate, userRef } from "./format";

export const PAGE_SIZE = 6;

/** Status filter options → the `status` query param ("all" sends none). */
const FILTERS = [
  { value: "all", label: "All users" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

export default function UsersTable({ heading }: { heading: string }) {
  const router = useRouter();
  const { message } = App.useApp();

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [blockingUser, setBlockingUser] = useState<TUser | null>(null);

  // Search and filters run server-side (QueryBuilder). Debounce typing, and
  // snap back to page 1 whenever the result set changes shape.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchTerm(query.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useGetAllUsersQuery({
    page,
    limit: PAGE_SIZE,
    sort: "-createdAt",
    ...(filter !== "all" ? { status: filter } : {}),
    ...(searchTerm ? { searchTerm } : {}),
  });
  const [updateUser] = useUpdateUserByAdminMutation();

  const users = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const confirmBlock = async (reason: string, description: string) => {
    if (!blockingUser) return;
    if (!reason.trim()) {
      message.error("A block reason is required.");
      return;
    }

    try {
      await updateUser({
        userId: blockingUser._id,
        body: {
          status: "blocked",
          blockReason: description.trim()
            ? `${reason.trim()} — ${description.trim()}`
            : reason.trim(),
        },
      }).unwrap();
      message.success(`${blockingUser.name} blocked.`);
      setBlockingUser(null);
    } catch {
      message.error("Couldn't block the user. Try again.");
    }
  };

  const unblock = async (user: TUser) => {
    try {
      await updateUser({
        userId: user._id,
        body: { status: "active" },
      }).unwrap();
      message.success(`${user.name} unblocked.`);
    } catch {
      message.error("Couldn't unblock the user. Try again.");
    }
  };

  const columns: TableColumnsType<TUser> = [
    {
      title: "Id",
      key: "ref",
      width: 100,
      render: (_, user) => (
        <span className="text-xs text-zinc-400">{userRef(user)}</span>
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
      title: "Joined",
      key: "date",
      align: "center",
      render: (_, user) => (
        <span className="text-xs text-zinc-300">
          {formatUserDate(user.createdAt)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: TUser["status"]) => (
        <span
          className={`inline-flex items-center gap-1.5 text-xs capitalize ${
            status === "blocked" ? "text-red-400" : "text-emerald-400"
          }`}
        >
          <span className="h-1 w-1 rounded-full bg-current" />
          {status}
        </span>
      ),
    },
    {
      title: "Plan",
      key: "plan",
      align: "center",
      render: (_, user) => {
        const plan = user.currentPlan ?? "Free";
        const paid = plan !== "Free";
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
              paid
                ? "bg-violet-500/15 text-violet-300"
                : "bg-white/10 text-zinc-400"
            }`}
          >
            {plan}
          </span>
        );
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role: TUser["role"]) => (
        <span className="text-xs text-zinc-300 capitalize">
          {role.replace("_", " ")}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 90,
      align: "center",
      render: (_, user) => {
        const blocked = user.status === "blocked";

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
                if (key === "details") router.push(`/admin/users/${user._id}`);
                else if (key === "block") setBlockingUser(user);
                else void unblock(user);
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
          {heading} ( {total} )
        </h2>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <div className="relative">
            <select
              value={filter}
              onChange={(event) => {
                setFilter(event.target.value as FilterValue);
                setPage(1);
              }}
              aria-label="Filter users"
              className="w-40 appearance-none rounded-full bg-white py-2.5 pr-9 pl-4 text-sm text-zinc-900 outline-none"
            >
              {FILTERS.map((option) => (
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
              placeholder="Search by name or email"
              aria-label="Search users by name or email"
              className="w-full rounded-full bg-white py-2.5 pr-13 pl-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
            />
            <span className="absolute top-1/2 right-1 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-violet-600 text-white">
              <FiSearch size={16} />
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <Table<TUser>
          columns={columns}
          dataSource={users}
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

      <BlockUserModal
        open={blockingUser !== null}
        userName={blockingUser?.name ?? ""}
        onCancel={() => setBlockingUser(null)}
        onSend={confirmBlock}
      />
    </section>
  );
}
