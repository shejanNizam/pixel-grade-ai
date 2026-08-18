"use client";

import Sparkline from "@/components/charts/Sparkline";
import {
  useGetMyCollectionQuery,
  useRemoveCollectionItemMutation,
  useUpdateCollectionItemMutation,
  type TCollectionItem,
} from "@/redux/features/collection/collectionApi";
import { useGetPriceHistoryBatchQuery } from "@/redux/features/price/priceApi";
import { App, Dropdown, Table, type TableColumnsType } from "antd";
import Image from "next/image";
import { useState } from "react";
import { FiArrowDown, FiArrowUp, FiMoreVertical, FiStar } from "react-icons/fi";
import { CARD_IMAGE } from "./data";

const PAGE_SIZE = 6;

const fmtUsd = (v: number) =>
  v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

/** Direction is carried by the arrow and the sign, not by color alone. */
function Change({ value }: { value?: number }) {
  if (value === undefined) {
    return <span className="text-xs text-zinc-600">—</span>;
  }
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

const cardOf = (item: TCollectionItem) =>
  typeof item.card === "object" ? item.card : null;

export default function PriceTable() {
  const { message } = App.useApp();
  const [page, setPage] = useState(1);
  const [filterOption, setFilterOption] = useState<"asc" | "desc" | "favorites">("desc");

  const { data, isFetching } = useGetMyCollectionQuery({
    page,
    limit: PAGE_SIZE,
    favorite: filterOption === "favorites" ? true : undefined,
    sortBy: "price",
    sortOrder: filterOption === "asc" ? "asc" : "desc",
  });
  const [updateItem] = useUpdateCollectionItemMutation();
  const [removeItem] = useRemoveCollectionItemMutation();

  const items = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  // One batched request backs every sparkline on the visible page. Free plans
  // get a 403 here — the column simply shows no trend line.
  const cardIds = items
    .map((item) => cardOf(item)?._id)
    .filter((id): id is string => Boolean(id));
  const { data: history } = useGetPriceHistoryBatchQuery(
    { cardIds, window: "30d" },
    { skip: cardIds.length === 0 },
  );

  const toggleFavorite = async (item: TCollectionItem) => {
    try {
      await updateItem({
        itemId: item._id,
        body: { favorite: !item.favorite },
      }).unwrap();
    } catch {
      message.error("Couldn't update the favorite. Try again.");
    }
  };

  const remove = async (item: TCollectionItem) => {
    try {
      await removeItem(item._id).unwrap();
      message.success("Removed from your collection.");
    } catch {
      message.error("Couldn't remove the card. Try again.");
    }
  };

  const columns: TableColumnsType<TCollectionItem> = [
    {
      title: "Card",
      key: "card",
      width: 260,
      sorter: (a, b) =>
        (cardOf(a)?.name ?? "").localeCompare(cardOf(b)?.name ?? ""),
      render: (_, item) => {
        const card = cardOf(item);
        return (
          <div className="flex items-center gap-3">
            <Image
              src={card?.officialImageUrl ?? item.manualImageUrl ?? CARD_IMAGE}
              alt=""
              width={36}
              height={50}
              unoptimized={Boolean(
                card?.officialImageUrl ?? item.manualImageUrl,
              )}
              className="h-12 w-9 shrink-0 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm text-white">
                {card?.name ?? "Card"}
                {item.favorite && (
                  <FiStar
                    size={12}
                    className="fill-amber-400 text-amber-400"
                    aria-label="Favorite"
                  />
                )}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                {[card?.setExpansion, card?.cardNumber]
                  .filter(Boolean)
                  .join(" ")}
              </p>
              {item.externalGrade && (
                <span className="mt-1 inline-flex rounded bg-violet-500/15 px-1.5 py-0.5 text-[10px] text-violet-300">
                  {item.externalGrade}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Set",
      key: "set",
      width: 140,
      render: (_, item) => {
        const card = cardOf(item);
        return (
          <div className="text-xs text-zinc-400">
            <p>{card?.setExpansion ?? "—"}</p>
            <p className="mt-0.5 text-zinc-600">{card?.releaseYear ?? ""}</p>
          </div>
        );
      },
    },
    {
      title: "Market value",
      key: "marketValue",
      width: 130,
      align: "right",
      sorter: (a, b) => (a.currentPrice ?? 0) - (b.currentPrice ?? 0),
      render: (_, item) => (
        <span className="text-sm text-white tabular-nums">
          {item.currentPrice !== undefined ? fmtUsd(item.currentPrice) : "—"}
        </span>
      ),
    },
    {
      title: "24h %",
      key: "change24h",
      width: 100,
      sorter: (a, b) => (a.change24h ?? 0) - (b.change24h ?? 0),
      render: (_, item) => <Change value={item.change24h} />,
    },
    {
      title: "7d %",
      key: "change7d",
      width: 100,
      sorter: (a, b) => (a.change7d ?? 0) - (b.change7d ?? 0),
      render: (_, item) => <Change value={item.change7d} />,
    },
    {
      title: "30d %",
      key: "change30d",
      width: 100,
      sorter: (a, b) => (a.change30d ?? 0) - (b.change30d ?? 0),
      render: (_, item) => <Change value={item.change30d} />,
    },
    {
      title: "Price chart (30d)",
      key: "trend",
      width: 140,
      render: (_, item) => {
        const card = cardOf(item);
        const points = card ? (history?.[card._id] ?? []) : [];
        if (points.length < 2) {
          return <span className="text-xs text-zinc-600">—</span>;
        }
        return (
          <Sparkline
            values={points.map((p) => p.price)}
            color={(item.change30d ?? 0) >= 0 ? "#4ade80" : "#a78bfa"}
            width={120}
            height={36}
            className="h-9 w-28"
            label={`${card?.name ?? "Card"} 30-day price trend`}
          />
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      align: "center",
      render: (_, item) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "favorite",
                label: item.favorite ? "Remove favorite" : "Mark favorite",
              },
              { key: "remove", label: "Remove from collection", danger: true },
            ],
            onClick: ({ key }) => {
              if (key === "favorite") void toggleFavorite(item);
              else void remove(item);
            },
          }}
        >
          <button
            type="button"
            aria-label={`Actions for ${cardOf(item)?.name ?? "card"}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <FiMoreVertical />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-medium text-white">Tracked Cards</h3>
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-zinc-950 p-1">
          <button
            type="button"
            onClick={() => {
              setPage(1);
              setFilterOption("asc");
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              filterOption === "asc"
                ? "bg-zinc-800 text-white shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FiArrowUp size={12} />
            Sort Ascending
          </button>
          <button
            type="button"
            onClick={() => {
              setPage(1);
              setFilterOption("desc");
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              filterOption === "desc"
                ? "bg-zinc-800 text-white shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FiArrowDown size={12} />
            Sort Descending
          </button>
          <button
            type="button"
            onClick={() => {
              setPage(1);
              setFilterOption("favorites");
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              filterOption === "favorites"
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FiStar size={12} className={filterOption === "favorites" ? "fill-amber-400 text-amber-400" : ""} />
            Favorites
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <Table<TCollectionItem>
          columns={columns}
          dataSource={items}
          rowKey="_id"
          loading={isFetching}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            showSizeChanger: false,
            onChange: setPage,
            showTotal: (t, [from, to]) =>
              `Showing ${from} to ${to} of ${t} cards tracked`,
          }}
          scroll={{ x: 1050 }}
          size="middle"
        />
      </div>
    </div>
  );
}
