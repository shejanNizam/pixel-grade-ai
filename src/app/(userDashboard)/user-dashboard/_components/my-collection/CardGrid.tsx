"use client";

import type { TCollectionItem } from "@/redux/features/collection/collectionApi";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiTrash2 } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { CARD_IMAGE } from "./data";

interface CardGridProps {
  items: TCollectionItem[];
  onToggleFavorite: (item: TCollectionItem) => void;
  onBuySlab: (item: TCollectionItem) => void;
  onRemove: (item: TCollectionItem) => void;
  /** Id of the item currently being deleted, so only its button spins. */
  removingId?: string | null;
}

/**
 * The grade shown beside the card name, e.g. "7 NM".
 *
 * Prefers the AI report, falling back to a third-party grade the card already
 * carries. Manual entries with neither show nothing rather than a placeholder —
 * a blank is honest, "—" reads like a grade of zero.
 */
const gradeBadge = (item: TCollectionItem): string | null => {
  const report = typeof item.report === "object" ? item.report : null;

  if (report) {
    return `${report.grade.toFixed(1).replace(/\.0$/, "")} ${report.gradeLabel}`;
  }

  return item.externalGrade ?? null;
};

const addedOn = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

export default function CardGrid({
  items,
  onToggleFavorite,
  onBuySlab,
  onRemove,
  removingId,
}: CardGridProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-sm text-zinc-500">
        No cards yet. Use “Add card” to put your first one in.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((item) => {
        const card = typeof item.card === "object" ? item.card : null;
        const name = card?.name ?? "Card";
        const image =
          card?.officialImageUrl ?? item.manualImageUrl ?? CARD_IMAGE;
        const hasReport = Boolean(item.report);
        const grade = gradeBadge(item);
        const isRemoving = removingId === item._id;

        return (
          <li key={item._id}>
            <div className="relative">
              <Image
                src={image}
                alt={`${name} — ${card?.setExpansion ?? ""}`}
                width={200}
                height={280}
                unoptimized={image !== CARD_IMAGE}
                className="aspect-5/7 w-full rounded-xl border border-white/10 object-cover"
              />

              <button
                type="button"
                onClick={() => onToggleFavorite(item)}
                aria-pressed={item.favorite}
                aria-label={
                  item.favorite
                    ? `Remove ${name} from favorites`
                    : `Add ${name} to favorites`
                }
                className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 transition-colors hover:bg-black/80"
              >
                <FiHeart
                  size={14}
                  className={
                    item.favorite
                      ? "fill-violet-400 text-violet-400"
                      : "text-white"
                  }
                />
              </button>

              {item.quantity > 1 && (
                <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white tabular-nums">
                  ×{item.quantity}
                </span>
              )}
            </div>

            <div className="mt-3">
              {/* Grade sits at the far right of the title row, per client
                  feedback 2026-07-29 ("Blastoise 7 NM"). The name truncates;
                  the grade never does — it is the column people scan down. */}
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm text-white">{name}</p>
                {grade && (
                  <span className="shrink-0 text-xs font-semibold text-violet-300 tabular-nums">
                    {grade}
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-zinc-400">
                {card?.setExpansion ?? ""}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {card?.cardNumber ?? item.externalGrade ?? ""}
              </p>
              <div className="mt-0.5 flex items-center justify-between text-xs text-zinc-600">
                <span>{addedOn(item.addedAt)}</span>
                {typeof item.report === "object" &&
                  item.report !== null &&
                  item.report.pixelVerified && (
                    <MdVerified
                      className="text-blue-400"
                      size={14}
                      title="Pixel Verified"
                      aria-label="Pixel Verified"
                    />
                  )}
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {hasReport ? (
                <Link
                  href={`/user-dashboard/analysis-report?reportId=${typeof item.report === "object" ? item.report?._id : item.report}`}
                  aria-label={`View the report for ${name}`}
                  className="block rounded-lg bg-violet-600 py-2 text-center text-xs font-medium text-white! transition-colors hover:bg-violet-500"
                >
                  View Report
                </Link>
              ) : (
                <p className="rounded-lg border border-white/10 py-2 text-center text-xs text-zinc-500">
                  {item.externalGrade ?? "Manual entry"}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onBuySlab(item)}
                  aria-label={`Buy a slab for ${name}`}
                  className="flex-1 rounded-lg border border-white/15 bg-white/5 py-2 text-center text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10"
                >
                  Buy Slab
                </button>

                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  disabled={isRemoving}
                  aria-label={`Remove ${name} from your collection`}
                  className="inline-flex w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-zinc-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
