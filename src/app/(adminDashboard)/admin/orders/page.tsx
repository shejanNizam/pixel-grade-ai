"use client";

import { App, Button, Input, Space, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";

interface Order {
  key: string;
  id: string;
  customer: string;
  total: string;
  status: "Paid" | "Pending" | "Refunded";
  placed: string;
}

// Demo data — replace with an RTK Query call to your orders endpoint.
const demoOrders: Order[] = [
  {
    key: "1",
    id: "ORD-1041",
    customer: "Alice Johnson",
    total: "$129.00",
    status: "Paid",
    placed: "2026-07-08",
  },
  {
    key: "2",
    id: "ORD-1040",
    customer: "Bob Smith",
    total: "$49.00",
    status: "Pending",
    placed: "2026-07-07",
  },
  {
    key: "3",
    id: "ORD-1039",
    customer: "Carla Reyes",
    total: "$249.00",
    status: "Paid",
    placed: "2026-07-05",
  },
  {
    key: "4",
    id: "ORD-1038",
    customer: "David Lee",
    total: "$79.00",
    status: "Refunded",
    placed: "2026-07-01",
  },
];

const statusColor: Record<Order["status"], string> = {
  Paid: "green",
  Pending: "orange",
  Refunded: "red",
};

export default function AdminOrdersPage() {
  const { message } = App.useApp();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return demoOrders;
    return demoOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q),
    );
  }, [search]);

  const columns: TableColumnsType<Order> = [
    {
      title: "Order",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Total", dataIndex: "total", key: "total", responsive: ["md"] },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Paid", value: "Paid" },
        { text: "Pending", value: "Pending" },
        { text: "Refunded", value: "Refunded" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: Order["status"]) => (
        <Tag color={statusColor[status]}>{status}</Tag>
      ),
    },
    {
      title: "Placed",
      dataIndex: "placed",
      key: "placed",
      responsive: ["lg"],
      sorter: (a, b) => a.placed.localeCompare(b.placed),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => message.info(`View ${record.id} (demo)`)}
          >
            View
          </Button>
          <Button
            size="small"
            danger
            onClick={() => message.warning(`Refund ${record.id} (demo)`)}
          >
            Refund
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
            Orders
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            A demo orders table. Connect it to your API.
          </p>
        </div>
        <Input
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order or customer"
          prefix={<FiSearch className="text-gray-400" />}
          className="sm:max-w-xs"
        />
      </div>

      <div className="bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 p-2 sm:p-4 overflow-x-auto">
        <Table<Order>
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 5, showSizeChanger: false }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}
