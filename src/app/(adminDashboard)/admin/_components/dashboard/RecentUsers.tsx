"use client";

import {
  useGetAllUsersQuery,
  useUpdateUserByAdminMutation,
} from "@/redux/features/user/userApi";
import type { TUser } from "@/types/auth";
import { App, Dropdown, Table, type TableColumnsType } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMoreVertical, FiSearch } from "react-icons/fi";
import BlockUserModal from "../users/BlockUserModal";
import { formatUserDate, userRef } from "../users/format";

export default function RecentUsers() {
  const router = useRouter();
  const { message } = App.useApp();

  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [blockingUser, setBlockingUser] = useState<TUser | null>(null);

  // Search runs server-side (QueryBuilder regex on name/email) — debounce so
  // typing doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useGetAllUsersQuery({
    limit: 5,
    sort: "-createdAt",
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
              if (key === "details") router.push(`/admin/users/${user._id}`);
              else setBlockingUser(user);
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
          Most recent users ( {total} )
        </h2>

        <div className="relative w-full sm:w-80">
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

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <Table<TUser>
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={isFetching}
          pagination={false}
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
