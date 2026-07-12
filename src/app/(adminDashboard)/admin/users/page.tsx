"use client";

import { App, Button, Input, Space, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";

interface AdminUser {
  key: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  status: "Active" | "Suspended";
  joined: string;
}

// Demo data — replace with an RTK Query call to your users endpoint.
const demoUsers: AdminUser[] = [
  {
    key: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
    joined: "2025-01-12",
  },
  {
    key: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "User",
    status: "Active",
    joined: "2025-02-03",
  },
  {
    key: "3",
    name: "Carla Reyes",
    email: "carla@example.com",
    role: "User",
    status: "Suspended",
    joined: "2025-03-21",
  },
  {
    key: "4",
    name: "David Lee",
    email: "david@example.com",
    role: "User",
    status: "Active",
    joined: "2025-04-08",
  },
  {
    key: "5",
    name: "Ella Brown",
    email: "ella@example.com",
    role: "Admin",
    status: "Active",
    joined: "2025-05-19",
  },
];

export default function AdminUsersPage() {
  const { message } = App.useApp();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return demoUsers;
    return demoUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [search]);

  const columns: TableColumnsType<AdminUser> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Admin", value: "Admin" },
        { text: "User", value: "User" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role: AdminUser["role"]) => (
        <Tag color={role === "Admin" ? "blue" : "default"}>{role}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: AdminUser["status"]) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "joined",
      key: "joined",
      responsive: ["lg"],
      sorter: (a, b) => a.joined.localeCompare(b.joined),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => message.info(`Edit ${record.name} (demo)`)}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            onClick={() => message.warning(`Suspend ${record.name} (demo)`)}
          >
            Suspend
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Users
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage platform users. This table uses demo data — connect it to
            your API.
          </p>
        </div>
        <Input
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email"
          prefix={<FiSearch className="text-gray-400" />}
          className="sm:max-w-xs"
        />
      </div>

      <div className="bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 p-2 sm:p-4 overflow-x-auto">
        <Table<AdminUser>
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 5, showSizeChanger: false }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}
