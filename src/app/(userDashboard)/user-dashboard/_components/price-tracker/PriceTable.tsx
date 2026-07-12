"use client";

import Sparkline from "@/components/charts/Sparkline";
import { App, Dropdown, Table, type TableColumnsType } from "antd";
import Image from "next/image";
import { useState } from "react";
import { FiArrowDown, FiArrowUp, FiMoreVertical, FiStar } from "react-icons/fi";
import { CARD_IMAGE, trackedCards, type TrackedCard } from "./data";

const fmtUsd = (v: number) =>
  v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

/** Direction is carried by the arrow and the sign, not by color alone. */
function Change({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium tabular-nums ${
        up ? "text-emerald-400" : "text-red-400"
      }`}
    >
      {up ? <FiArrowUp size={11} /> : <FiArrowDown size={11} />}
      {value.toFixed(2)}%
    </span>
  );
}

export default function PriceTable() {
  const [selected, setSelected] = useState<React.Key[]>([]);
  const { message } = App.useApp();

  const columns: TableColumnsType<TrackedCard> = [
    {
      title: "Card",
      dataIndex: "name",
      key: "card",
      width: 260,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, card) => (
        <div className="flex items-center gap-3">
          <Image
            src={CARD_IMAGE}
            alt=""
            width={36}
            height={50}
            className="h-12 w-9 shrink-0 rounded object-cover"
          />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm text-white">
              {card.name}
              {card.favorite && (
                <FiStar
                  size={12}
                  className="fill-amber-400 text-amber-400"
                  aria-label="Favorite"
                />
              )}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-zinc-500">
              {card.detail}
            </p>
            <span className="mt-1 inline-flex rounded bg-violet-500/15 px-1.5 py-0.5 text-[10px] text-violet-300">
              {card.grade}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Set",
      dataIndex: "set",
      key: "set",
      width: 140,
      render: (_, card) => (
        <div className="text-xs text-zinc-400">
          <p>{card.set}</p>
          <p className="mt-0.5 text-zinc-600">{card.year}</p>
        </div>
      ),
    },
    {
      title: "Market value",
      dataIndex: "marketValue",
      key: "marketValue",
      width: 130,
      align: "right",
      sorter: (a, b) => a.marketValue - b.marketValue,
      render: (value: number) => (
        <span className="text-sm text-white tabular-nums">{fmtUsd(value)}</span>
      ),
    },
    {
      title: "24h %",
      dataIndex: "change24h",
      key: "change24h",
      width: 100,
      sorter: (a, b) => a.change24h - b.change24h,
      render: (value: number) => <Change value={value} />,
    },
    {
      title: "7d %",
      dataIndex: "change7d",
      key: "change7d",
      width: 100,
      sorter: (a, b) => a.change7d - b.change7d,
      render: (value: number) => <Change value={value} />,
    },
    {
      title: "30d %",
      dataIndex: "change30d",
      key: "change30d",
      width: 100,
      sorter: (a, b) => a.change30d - b.change30d,
      render: (value: number) => <Change value={value} />,
    },
    {
      title: "Price chart (30d)",
      dataIndex: "trend",
      key: "trend",
      width: 140,
      render: (trend: number[], card) => (
        <Sparkline
          values={trend}
          color={card.change30d >= 0 ? "#4ade80" : "#a78bfa"}
          width={120}
          height={36}
          className="h-9 w-28"
          label={`${card.name} 30-day price trend`}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      align: "center",
      render: (_, card) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              { key: "view", label: "View details" },
              { key: "favorite", label: "Toggle favorite" },
              { key: "remove", label: "Remove from tracker", danger: true },
            ],
            onClick: ({ key }) => message.info(`${key} → ${card.name} (demo).`),
          }}
        >
          <button
            type="button"
            aria-label={`Actions for ${card.name}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <FiMoreVertical />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8">
      <Table<TrackedCard>
        columns={columns}
        dataSource={trackedCards}
        rowSelection={{
          selectedRowKeys: selected,
          onChange: setSelected,
        }}
        pagination={{
          pageSize: 6,
          showSizeChanger: false,
          showTotal: (total, [from, to]) =>
            `Showing ${from} to ${to} of ${total} cards tracked`,
        }}
        scroll={{ x: 1050 }}
        size="middle"
      />
    </div>
  );
}
