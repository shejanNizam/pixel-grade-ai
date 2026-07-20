"use client";

import PillButton from "@/components/shared/PillButton";
import {
  useGetMyCollectionQuery,
  useUpdateCollectionItemMutation,
  type TCollectionItem,
} from "@/redux/features/collection/collectionApi";
import { App } from "antd";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import AddCardModal from "../_components/my-collection/AddCardModal";
import CardGrid from "../_components/my-collection/CardGrid";
import CollectionStats from "../_components/my-collection/CollectionStats";

const PAGE_SIZE = 24;

export default function MyCollection() {
  const { message } = App.useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetMyCollectionQuery({
    page,
    limit: PAGE_SIZE,
    sortBy: "addedAt",
    sortOrder: "desc",
  });
  const [updateItem] = useUpdateCollectionItemMutation();

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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium text-white">My Collection</h2>
          <p className="mt-1.5 text-xs text-zinc-500">
            View and manage all cards in your collection
          </p>
        </div>

        <PillButton onClick={() => setIsAdding(true)} icon={<FiPlus />}>
          Add card
        </PillButton>
      </div>

      <CollectionStats />

      <section>
        <h3 className="mb-5 text-lg font-medium text-white">
          Recently added {total > 0 && `( ${total} )`}
        </h3>

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
            onBuySlab={() =>
              message.info("Custom slab ordering is coming soon.")
            }
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

      <AddCardModal open={isAdding} onClose={() => setIsAdding(false)} />
    </div>
  );
}
