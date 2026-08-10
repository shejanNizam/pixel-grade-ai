"use client";

import EmptyState from "@/components/shared/EmptyState";
import {
  useGetMySlabOrdersQuery,
  type TSlabOrder,
  type TSlabOrderStatus,
} from "@/redux/features/slabOrder/slabOrderApi";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { FiShoppingBag, FiTruck } from "react-icons/fi";

const STATUS_COLOR: Record<TSlabOrderStatus, string> = {
  pending: "orange",
  processing: "blue",
  shipped: "purple",
  delivered: "green",
  cancelled: "red",
};

export default function UserSlabOrdersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetMySlabOrdersQuery({ page, limit: 10 });
  const orders = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const columns: ColumnsType<TSlabOrder> = [
    {
      title: "Order ID & Date",
      dataIndex: "_id",
      key: "_id",
      render: (id: string, record) => (
        <div>
          <span className="font-mono text-xs font-semibold text-white">
            #{id.slice(-8).toUpperCase()}
          </span>
          <span className="block text-[11px] text-zinc-500">
            {new Date(record.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      title: "Card & Slab",
      key: "card",
      render: (_, record) => {
        const slab = record.slab;
        const report = typeof slab?.report === "object" ? slab.report : null;
        const card = report && typeof report.card === "object" ? report.card : null;
        return (
          <div>
            <span className="block text-xs font-medium text-white">
              {card?.name ?? "Custom Slab"}
            </span>
            {report && (
              <span className="inline-block mt-1 rounded bg-violet-600/30 px-2 py-0.5 text-[10px] text-violet-300">
                Grade {report.grade?.toFixed(1)} {report.gradeLabel}
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: "Shipping Address",
      key: "address",
      render: (_, record) => {
        const addr = record.shippingAddress;
        return (
          <div className="text-xs text-zinc-300">
            <span className="block font-medium text-white">{addr.fullName}</span>
            <span className="block text-zinc-400">{addr.streetAddress}, {addr.city}</span>
            <span className="block text-amber-400">{addr.country}</span>
          </div>
        );
      },
    },
    {
      title: "Pricing Breakdown",
      key: "price",
      render: (_, record) => {
        const sub = record.subtotal ?? record.quantity * 9.99;
        const ship = record.shippingFee ?? 4.99;
        const tax = record.taxAmount ?? sub * 0.08;
        return (
          <div className="text-xs space-y-0.5">
            <span className="block text-zinc-300 font-medium">Qty: {record.quantity} · Slabs: ${sub.toFixed(2)}</span>
            <span className="block text-[11px] text-zinc-400">USPS Shipping: ${ship.toFixed(2)}</span>
            <span className="block text-[11px] text-zinc-500">Tax: ${tax.toFixed(2)}</span>
            <span className="block font-semibold text-amber-400 mt-1">Total: ${record.totalAmount.toFixed(2)} USD</span>
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <div>
          <Tag color={STATUS_COLOR[record.orderStatus]} className="capitalize font-medium">
            {record.orderStatus}
          </Tag>
          {record.trackingNumber && (
            <span className="block mt-1 font-mono text-[10px] text-zinc-400">
              <FiTruck className="inline mr-1" /> {record.trackingNumber}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white sm:text-2xl">
          My Slab Orders
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Track physical custom slabs you have ordered for production and delivery.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111113] p-5">
        {isLoading ? (
          <div className="h-40 animate-pulse rounded-xl bg-white/5" />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<FiShoppingBag />}
            title="No slab orders yet"
            description="You haven't ordered any physical slabs. Go to the Slab Generator to place your first order!"
          />
        ) : (
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            pagination={{
              current: page,
              pageSize: 10,
              total,
              onChange: (p) => setPage(p),
            }}
            className="[&_.ant-table]:!bg-transparent [&_.ant-table-cell]:!border-white/8 [&_.ant-table-cell]:!bg-transparent [&_.ant-table-cell]:!text-white [&_.ant-table-thead_.ant-table-cell]:!bg-white/5 [&_.ant-table-thead_.ant-table-cell]:!text-zinc-400"
          />
        )}
      </div>
    </div>
  );
}
