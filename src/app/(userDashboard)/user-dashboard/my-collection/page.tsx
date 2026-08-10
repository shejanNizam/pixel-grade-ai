"use client";

import {
  useGetMyCollectionQuery,
  useRemoveCollectionItemMutation,
  useUpdateCollectionItemMutation,
  type TCollectionItem,
} from "@/redux/features/collection/collectionApi";
import { getApiErrorMessage } from "@/utils/apiError";
import { App, Input, Select } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import CardGrid from "../_components/my-collection/CardGrid";
import CollectionStats from "../_components/my-collection/CollectionStats";

const PAGE_SIZE = 24;

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Recently Added", value: "recently_added" },
  { label: "Favorites", value: "favorites" },
  { label: "Highest Grade", value: "highest_grade" },
  { label: "Highest Value", value: "highest_value" },
];

export default function MyCollection() {
  const router = useRouter();
  const { message, modal } = App.useApp();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const { data, isLoading } = useGetMyCollectionQuery({
    page,
    limit: PAGE_SIZE,
    searchTerm: search.trim() || undefined,
    favorite: filter === "favorites" ? true : undefined,
    sortBy:
      filter === "highest_grade"
        ? "grade"
        : filter === "highest_value"
          ? "price"
          : "addedAt",
    sortOrder: "desc",
  });

  const [updateItem] = useUpdateCollectionItemMutation();
  const [removeCollectionItem] = useRemoveCollectionItemMutation();

  const items = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPage ?? 1;

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

  const removeItem = async (item: TCollectionItem) => {
    const card = typeof item.card === "object" ? item.card : null;
    const name = card?.name ?? "this card";

    modal.confirm({
      title: `Remove ${name}?`,
      content:
        "This takes the card out of your collection. Its grading report stays in your reports and can be viewed at any time.",
      okText: "Remove",
      okButtonProps: { danger: true },
      cancelText: "Keep",
      onOk: async () => {
        setRemovingId(item._id);
        try {
          await removeCollectionItem(item._id).unwrap();
          message.success(`${name} removed from your collection.`);
        } catch (error) {
          message.error(
            getApiErrorMessage(error, "Couldn't remove the card. Try again."),
          );
        } finally {
          setRemovingId(null);
        }
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium text-white">My Collection</h2>
        <p className="mt-1.5 text-xs text-zinc-500">
          View and manage all cards in your collection
        </p>
      </div>

      <CollectionStats />

      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-medium text-white">
            Collection Cards {total > 0 && `( ${total} )`}
          </h3>

          <div className="flex flex-row items-center gap-3">
            <Select
              value={filter}
              onChange={setFilter}
              options={FILTER_OPTIONS}
              className="w-40 [&_.ant-select-selector]:!rounded-full [&_.ant-select-selector]:!border-zinc-800 [&_.ant-select-selector]:!bg-zinc-950 [&_.ant-select-selection-item]:!text-white"
            />
            <Input
              placeholder="Search cards..."
              prefix={<FiSearch className="text-zinc-500" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-60 !rounded-full !border-zinc-800 !bg-zinc-950 !text-white"
            />
          </div>
        </div>

        {isLoading ? (
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 6 }, (_, i) => (
              <li
                key={i}
                className="aspect-5/7 animate-pulse rounded-xl border border-white/10 bg-white/5"
              />
            ))}
          </ul>
        ) : (
          <CardGrid
            items={items}
            onToggleFavorite={toggleFavorite}
            onBuySlab={(item) => {
              const reportId =
                typeof item.report === "object" ? item.report?._id : item.report;
              if (reportId) {
                router.push(`/user-dashboard/slab-generator?reportId=${reportId}`);
              } else {
                router.push("/user-dashboard/slab-generator");
              }
            }}
            onRemove={removeItem}
            removingId={removingId}
          />
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-zinc-400">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-full border border-white/15 px-4 py-1.5 transition-colors hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            <span className="tabular-nums">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border border-white/15 px-4 py-1.5 transition-colors hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
