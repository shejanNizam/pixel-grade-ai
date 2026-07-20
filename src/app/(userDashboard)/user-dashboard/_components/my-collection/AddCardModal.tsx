"use client";

import { useSearchCardsQuery } from "@/redux/features/card/cardApi";
import { useAddCollectionItemMutation } from "@/redux/features/collection/collectionApi";
import type { TCard } from "@/types/card";
import { App, Input, Modal, Select, Spin } from "antd";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------------
// Manual add. The card catalogue is READ-ONLY (rows come from the
// identification pipeline), so a manual entry means picking an existing
// catalogue card — not typing in a new one. Scanned cards join the collection
// from the report screen instead.
// ---------------------------------------------------------------------------

interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddCardModal({ open, onClose }: AddCardModalProps) {
  const { message } = App.useApp();

  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [externalGrade, setExternalGrade] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  // Reset per open so one add never leaks into the next.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSearchTerm("");
    setSelectedId(null);
    setQuantity("1");
    setExternalGrade("");
  }, [open]);

  const { data, isFetching } = useSearchCardsQuery(
    { searchTerm: searchTerm || undefined, limit: 20 },
    { skip: !open },
  );
  const [addItem, { isLoading: isSaving }] = useAddCollectionItemMutation();

  const cards = useMemo(() => data?.data ?? [], [data]);
  const selected: TCard | undefined = cards.find((c) => c._id === selectedId);

  const submit = async () => {
    if (isSaving) return;
    if (!selectedId) {
      message.error("Pick a card from the catalogue first.");
      return;
    }
    if (!/^[1-9]\d*$/.test(quantity.trim())) {
      message.error("Enter a whole-number quantity above zero.");
      return;
    }

    try {
      await addItem({
        card: selectedId,
        quantity: Number(quantity),
        ...(externalGrade.trim()
          ? { externalGrade: externalGrade.trim() }
          : {}),
      }).unwrap();
      message.success(`${selected?.name ?? "Card"} added to your collection.`);
      onClose();
    } catch {
      message.error("Couldn't add the card. Try again.");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnHidden
      width={520}
      className="add-card-modal"
      title={null}
      aria-labelledby="add-card-title"
    >
      <h2
        id="add-card-title"
        className="mb-6 text-center text-lg font-semibold text-violet-600"
      >
        Add Card
      </h2>

      <label className="block text-sm">
        <span className="text-zinc-700">Search the card catalogue</span>
        <Select
          showSearch
          value={selectedId ?? undefined}
          onSearch={setQuery}
          onChange={(value) => setSelectedId(value)}
          filterOption={false}
          notFoundContent={
            isFetching ? (
              <div className="flex justify-center py-3">
                <Spin size="small" />
              </div>
            ) : (
              "No cards found — cards enter the catalogue when they are scanned."
            )
          }
          placeholder="Search by name, set, or number"
          className="mt-2 w-full"
          size="large"
          options={cards.map((card) => ({
            value: card._id,
            label: [card.name, card.setExpansion, card.cardNumber]
              .filter(Boolean)
              .join(" · "),
          }))}
        />
      </label>

      {selected && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 p-3">
          {selected.officialImageUrl ? (
            <Image
              src={selected.officialImageUrl}
              alt=""
              width={40}
              height={56}
              unoptimized
              className="h-14 w-10 shrink-0 rounded-md object-cover"
            />
          ) : (
            <span className="h-14 w-10 shrink-0 rounded-md bg-violet-200" />
          )}
          <div className="min-w-0 text-xs">
            <p className="truncate font-medium text-zinc-900">
              {selected.name}
            </p>
            <p className="mt-0.5 truncate text-zinc-500">
              {[selected.setExpansion, selected.cardNumber]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {selected.latestPrice !== undefined && (
              <p className="mt-0.5 text-zinc-500">
                Market ≈ ${selected.latestPrice.toLocaleString("en-US")}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-zinc-700">Quantity</span>
          <Input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            placeholder="Ex : 3"
            className="mt-2"
            size="large"
          />
        </label>

        <label className="block text-sm">
          <span className="text-zinc-700">External grade (optional)</span>
          <Input
            value={externalGrade}
            onChange={(e) => setExternalGrade(e.target.value)}
            placeholder="Ex : PSA 9 MINT"
            className="mt-2"
            size="large"
          />
        </label>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-red-400 px-8 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={isSaving}
          className="rounded-full bg-violet-600 px-8 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Adding…" : "Add card"}
        </button>
      </div>
    </Modal>
  );
}
