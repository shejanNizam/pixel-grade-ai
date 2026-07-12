"use client";

import Image from "next/image";
import { FiHeart } from "react-icons/fi";
import { CARD_IMAGE, type CollectionCard } from "./data";

interface CardGridProps {
  cards: CollectionCard[];
  onToggleFavorite: (id: string) => void;
}

export default function CardGrid({ cards, onToggleFavorite }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-sm text-zinc-500">
        No cards yet. Use “Add card” to put your first one in.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {cards.map((card) => (
        <li key={card.id}>
          <div className="relative">
            <Image
              src={card.imageUrl ?? CARD_IMAGE}
              alt={`${card.name} — ${card.set}`}
              width={200}
              height={280}
              unoptimized={Boolean(card.imageUrl)}
              className="aspect-5/7 w-full rounded-xl border border-white/10 object-cover"
            />

            <button
              type="button"
              onClick={() => onToggleFavorite(card.id)}
              aria-pressed={card.favorite}
              aria-label={
                card.favorite
                  ? `Remove ${card.name} from favorites`
                  : `Add ${card.name} to favorites`
              }
              className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 transition-colors hover:bg-black/80"
            >
              <FiHeart
                size={14}
                className={
                  card.favorite
                    ? "fill-violet-400 text-violet-400"
                    : "text-white"
                }
              />
            </button>
          </div>

          <div className="mt-3">
            <p className="truncate text-sm text-white">{card.name}</p>
            <p className="mt-0.5 truncate text-xs text-zinc-400">{card.set}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{card.number}</p>
            <p className="mt-0.5 text-xs text-zinc-600">{card.addedOn}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
