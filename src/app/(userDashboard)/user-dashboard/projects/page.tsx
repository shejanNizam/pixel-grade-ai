"use client";

import { App, Button, Input, Progress, Space, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";

interface Project {
  key: string;
  name: string;
  status: "Active" | "Paused" | "Completed";
  progress: number;
  updated: string;
}

// Demo data — swap for an RTK Query hook (see src/redux/features/demo/demoApi.ts).
const demoProjects: Project[] = [
  {
    key: "1",
    name: "Website Redesign",
    status: "Active",
    progress: 72,
    updated: "2026-07-02",
  },
  {
    key: "2",
    name: "Mobile App v2",
    status: "Active",
    progress: 35,
    updated: "2026-06-28",
  },
  {
    key: "3",
    name: "Marketing Site",
    status: "Paused",
    progress: 50,
    updated: "2026-06-11",
  },
  {
    key: "4",
    name: "Onboarding Flow",
    status: "Completed",
    progress: 100,
    updated: "2026-05-30",
  },
];

const statusColor: Record<Project["status"], string> = {
  Active: "green",
  Paused: "orange",
  Completed: "blue",
};

export default function ProjectsPage() {
  const { message } = App.useApp();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return demoProjects;
    return demoProjects.filter((p) => p.name.toLowerCase().includes(q));
  }, [search]);

  const columns: TableColumnsType<Project> = [
    {
      title: "Project",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Paused", value: "Paused" },
        { text: "Completed", value: "Completed" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: Project["status"]) => (
        <Tag color={statusColor[status]}>{status}</Tag>
      ),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      responsive: ["md"],
      sorter: (a, b) => a.progress - b.progress,
      render: (progress: number) => (
        <Progress percent={progress} size="small" className="max-w-[160px]" />
      ),
    },
    {
      title: "Last updated",
      dataIndex: "updated",
      key: "updated",
      responsive: ["lg"],
      sorter: (a, b) => a.updated.localeCompare(b.updated),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => message.info(`Open ${record.name} (demo)`)}
          >
            Open
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
            Projects
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            A demo list view. Replace the demo data with your API.
          </p>
        </div>
        <Input
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects"
          prefix={<FiSearch className="text-gray-400" />}
          className="sm:max-w-xs"
        />
      </div>

      <div className="bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 p-2 sm:p-4 overflow-x-auto">
        <Table<Project>
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 5, showSizeChanger: false }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}
