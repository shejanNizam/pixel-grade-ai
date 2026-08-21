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
import { FiExternalLink, FiShoppingBag, FiTruck } from "react-icons/fi";

const STATUS_COLOR: Record<TSlabOrderStatus, string> = {
  order_received: "blue",
  processing: "gold",
  ready_to_ship: "cyan",
  shipped: "purple",
  in_transit: "indigo",
  delivered: "green",
  shipping_exception: "volcano",
  shipping_error: "red",
  pending: "orange",
  cancelled: "red",
};

export default function UserSlabOrdersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetMySlabOrdersQuery({ page, limit: 10 });
  const orders = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const columns: ColumnsType<TSlabOrder> = [
    {
      title: "Order # & Date",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (orderNum: string, record) => (
        <div>
          <span className="font-mono text-xs font-bold text-violet-300">
            {orderNum || `#PG-${record._id.slice(-5).toUpperCase()}`}
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
      title: "Custom Slabs",
      key: "items",
      render: (_, record) => {
        const items = record.items || [];
        if (items.length > 0) {
          return (
            <div className="space-y-1">
              {items.map((item, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-medium text-white">{item.cardName}</span>
                  <span className="ml-1 text-[11px] text-violet-300">
                    Grade {item.grade?.toFixed(1)} {item.gradeLabel}
                  </span>
                </div>
              ))}
            </div>
          );
        }
        return <span className="text-xs text-white">Custom Slab</span>;
      },
    },
    {
      title: "Shipping Address",
      key: "address",
      render: (_, record) => {
        const addr = record.shippingAddress;
        if (!addr) return <span className="text-xs text-zinc-500">—</span>;
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
      title: "Pricing",
      key: "price",
      render: (_, record) => {
        const sub = record.subtotal ?? 24.99;
        const ship = record.shippingFee ?? 5.95;
        const tax = record.taxAmount ?? sub * 0.085;
        return (
          <div className="text-xs space-y-0.5">
            <span className="block text-zinc-300 font-medium">Qty: {record.quantity} · Slabs: ${sub.toFixed(2)}</span>
            <span className="block text-[11px] text-zinc-400">Shipping: ${ship.toFixed(2)}</span>
            <span className="block text-[11px] text-zinc-500">Tax: ${tax.toFixed(2)}</span>
            <span className="block font-bold text-amber-400 mt-1">Total: ${record.totalAmount.toFixed(2)} USD</span>
          </div>
        );
      },
    },
    {
      title: "Status & Tracking",
      key: "status",
      render: (_, record) => (
        <div>
          <Tag color={STATUS_COLOR[record.orderStatus] || "blue"} className="capitalize font-medium">
            {record.orderStatus?.replace("_", " ")}
          </Tag>

          {record.trackingNumber ? (
            <div className="mt-1 font-mono text-[11px] text-zinc-300">
              <a
                href={record.shippo?.trackingUrl || `https://tools.usps.com/go/TrackConfirmAction?tLabels=${record.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-violet-400 hover:underline"
              >
                <FiTruck className="inline" /> {record.trackingNumber} <FiExternalLink size={10} />
              </a>
            </div>
          ) : (
            <span className="block mt-1 text-[10px] text-zinc-500 italic">
              Tracking issued upon admin shipment
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
            description="You haven't ordered any physical slabs. Add custom slabs to your cart to place an order!"
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
