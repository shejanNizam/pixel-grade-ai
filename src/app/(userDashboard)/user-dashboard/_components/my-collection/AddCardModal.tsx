"use client";

import { useSearchCardsQuery } from "@/redux/features/card/cardApi";
import { useAddCollectionItemMutation } from "@/redux/features/collection/collectionApi";
import type { TCard } from "@/types/card";
import { App, ConfigProvider, Input, Modal, Select, Spin } from "antd";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FiMinus, FiPlus, FiSearch } from "react-icons/fi";

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

const MAX_QUANTITY = 999;

const cardMeta = (card: TCard) =>
  [card.setExpansion, card.cardNumber].filter(Boolean).join(" · ");

export default function AddCardModal({ open, onClose }: AddCardModalProps) {
  const { message } = App.useApp();

  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [externalGrade, setExternalGrade] = useState("");

  // Debounce the server search so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  // Reset per open so one add never leaks into the next.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSearchTerm("");
    setSelectedId(null);
    setQuantity(1);
    setExternalGrade("");
  }, [open]);

  const { data, isFetching } = useSearchCardsQuery(
    { searchTerm: searchTerm || undefined, limit: 20 },
    { skip: !open },
  );
  const [addItem, { isLoading: isSaving }] = useAddCollectionItemMutation();

  const cards = useMemo(() => data?.data ?? [], [data]);
  const selected = cards.find((c) => c._id === selectedId);

  const clampQuantity = (n: number) =>
    Math.max(1, Math.min(MAX_QUANTITY, Math.floor(n) || 1));

  const submit = async () => {
    if (isSaving) return;
    if (!selectedId) {
      message.error("Pick a card from the catalogue first.");
      return;
    }

    try {
      await addItem({
        card: selectedId,
        quantity,
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
    // A dark, elevated dialog matching the dashboard surfaces — inputs inherit
    // the app's dark antd theme, so their text is white and legible.
    <ConfigProvider theme={{ components: { Modal: { contentBg: "#18181b" } } }}>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        destroyOnHidden
        width={520}
        title={null}
        aria-labelledby="add-card-title"
      >
        <div className="py-1">
          <h2
            id="add-card-title"
            className="text-lg font-semibold text-white"
          >
            Add a card
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Search the catalogue and add a card to your collection. Cards enter
            the catalogue when they&apos;re scanned.
          </p>

          {/* ── Search ── */}
          <label className="mt-6 block">
            <span className="text-sm font-medium text-zinc-200">Card</span>
            <Select
              showSearch
              autoFocus
              value={selectedId ?? undefined}
              onSearch={setQuery}
              onChange={(value) => setSelectedId(value)}
              filterOption={false}
              suffixIcon={<FiSearch className="text-zinc-400" />}
              notFoundContent={
                isFetching ? (
                  <div className="flex justify-center py-4">
                    <Spin size="small" />
                  </div>
                ) : query ? (
                  <p className="px-2 py-4 text-center text-xs text-zinc-400">
                    No cards match “{query}”. Cards are added to the catalogue
                    when they&apos;re scanned.
                  </p>
                ) : (
                  <p className="px-2 py-4 text-center text-xs text-zinc-400">
                    Start typing a card name, set, or number.
                  </p>
                )
              }
              placeholder="Search by name, set, or number"
              className="mt-2 w-full"
              size="large"
              listHeight={288}
              optionLabelProp="label"
              options={cards.map((card) => ({
                value: card._id,
                label: card.name,
                card,
              }))}
              optionRender={(option) => {
                const card = (option.data as { card: TCard }).card;
                return (
                  <div className="flex items-center gap-3 py-1">
                    {card.officialImageUrl ? (
                      <Image
                        src={card.officialImageUrl}
                        alt=""
                        width={32}
                        height={44}
                        unoptimized
                        className="h-11 w-8 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <span className="h-11 w-8 shrink-0 rounded bg-white/10" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-white">
                        {card.name}
                      </span>
                      <span className="block truncate text-xs text-zinc-400">
                        {cardMeta(card) || "—"}
                      </span>
                    </span>
                    {card.latestPrice !== undefined && (
                      <span className="shrink-0 text-xs text-zinc-300 tabular-nums">
                        ${card.latestPrice.toLocaleString("en-US")}
                      </span>
                    )}
                  </div>
                );
              }}
            />
          </label>

          {/* ── Selected card preview ── */}
          {selected && (
            <div className="mt-4 flex items-center gap-4 rounded-xl border border-violet-500/30 bg-violet-500/5 p-3">
              {selected.officialImageUrl ? (
                <Image
                  src={selected.officialImageUrl}
                  alt=""
                  width={56}
                  height={78}
                  unoptimized
                  className="h-20 w-14 shrink-0 rounded-md object-cover"
                />
              ) : (
                <span className="flex h-20 w-14 shrink-0 items-center justify-center rounded-md bg-white/10 text-[10px] text-zinc-500">
                  No image
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {selected.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-zinc-400">
                  {cardMeta(selected) || "—"}
                </p>
                {selected.rarity && (
                  <span className="mt-1.5 inline-block rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-zinc-300">
                    {selected.rarity}
                  </span>
                )}
                {selected.latestPrice !== undefined && (
                  <p className="mt-1.5 text-xs text-zinc-400">
                    Market value{" "}
                    <span className="font-medium text-white tabular-nums">
                      ${selected.latestPrice.toLocaleString("en-US")}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Quantity + external grade ── */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <span className="text-sm font-medium text-zinc-200">
                Quantity
              </span>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => clampQuantity(q - 1))}
                  disabled={quantity <= 1}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 text-zinc-200 transition-colors hover:border-white/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiMinus size={15} />
                </button>
                <input
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(clampQuantity(Number(e.target.value.replace(/\D/g, ""))))
                  }
                  inputMode="numeric"
                  aria-label="Quantity"
                  className="h-11 w-full min-w-0 rounded-lg border border-white/15 bg-white/5 text-center text-sm font-medium text-white outline-none focus:border-violet-500"
                />
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => clampQuantity(q + 1))}
                  disabled={quantity >= MAX_QUANTITY}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 text-zinc-200 transition-colors hover:border-white/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiPlus size={15} />
                </button>
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-zinc-200">
                External grade{" "}
                <span className="font-normal text-zinc-500">(optional)</span>
              </span>
              <Input
                value={externalGrade}
                onChange={(e) => setExternalGrade(e.target.value)}
                onPressEnter={submit}
                placeholder="e.g. PSA 9 MINT"
                className="mt-2"
                size="large"
                maxLength={40}
              />
            </label>
          </div>

          <p className="mt-2 text-[11px] text-zinc-500">
            Add an external grade if the card is already slabbed by another
            grader — it&apos;s kept separate from PixelGrade&apos;s own grade.
          </p>

          {/* ── Actions ── */}
          <div className="mt-7 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-zinc-200 transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={isSaving || !selectedId}
              className="rounded-full bg-violet-600 px-7 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Adding…" : "Add card"}
            </button>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
