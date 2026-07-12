"use client";

import { App, Button, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { FiCheck } from "react-icons/fi";

interface Invoice {
  key: string;
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending";
}

// Demo data — replace with your billing endpoint.
const invoices: Invoice[] = [
  {
    key: "1",
    id: "INV-0007",
    date: "2026-07-01",
    amount: "$29.00",
    status: "Paid",
  },
  {
    key: "2",
    id: "INV-0006",
    date: "2026-06-01",
    amount: "$29.00",
    status: "Paid",
  },
  {
    key: "3",
    id: "INV-0005",
    date: "2026-05-01",
    amount: "$29.00",
    status: "Paid",
  },
];

const plans = [
  { name: "Free", price: "$0", features: ["1 project", "Community support"] },
  {
    name: "Pro",
    price: "$29",
    features: ["Unlimited projects", "Priority support", "Analytics"],
    current: true,
  },
  {
    name: "Team",
    price: "$99",
    features: ["Everything in Pro", "5 seats", "SSO"],
  },
];

export default function BillingPage() {
  const { message } = App.useApp();

  const columns: TableColumnsType<Invoice> = [
    { title: "Invoice", dataIndex: "id", key: "id" },
    { title: "Date", dataIndex: "date", key: "date", responsive: ["md"] },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Invoice["status"]) => (
        <Tag color={status === "Paid" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          size="small"
          onClick={() => message.info(`Download ${record.id} (demo)`)}
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Billing
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          A demo plans + invoices page. Wire this to your payment provider.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg border p-6 bg-white dark:bg-primary/10 ${
              plan.current
                ? "border-blue-500 ring-1 ring-blue-500"
                : "border-gray-200 dark:border-gray-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {plan.name}
              </h3>
              {plan.current && <Tag color="blue">Current</Tag>}
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {plan.price}
              <span className="text-sm font-normal text-gray-500">/mo</span>
            </p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <FiCheck className="text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              block
              type={plan.current ? "default" : "primary"}
              disabled={plan.current}
              className="mt-6"
              onClick={() => message.info(`Switch to ${plan.name} (demo)`)}
            >
              {plan.current ? "Current plan" : `Choose ${plan.name}`}
            </Button>
          </div>
        ))}
      </div>

      {/* Invoices */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">
          Invoices
        </h2>
        <div className="bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 p-2 sm:p-4 overflow-x-auto">
          <Table<Invoice>
            columns={columns}
            dataSource={invoices}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        </div>
      </div>
    </div>
  );
}
