"use client";

import PillButton from "@/components/shared/PillButton";
import { App } from "antd";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import AddCardModal, {
  type AddCardValues,
} from "../_components/my-collection/AddCardModal";
import CardGrid from "../_components/my-collection/CardGrid";
import CollectionStats from "../_components/my-collection/CollectionStats";
import {
  initialCards,
  type CollectionCard,
} from "../_components/my-collection/data";

export default function MyCollection() {
  const { message } = App.useApp();
  const [cards, setCards] = useState<CollectionCard[]>(initialCards);
  const [isAdding, setIsAdding] = useState(false);

  const toggleFavorite = (id: string) =>
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, favorite: !card.favorite } : card,
      ),
    );

  const addCard = (values: AddCardValues, imageUrl: string) =>
    setCards((prev) => [
      {
        id: crypto.randomUUID(),
        name: values.name,
        set: values.set,
        number: values.number,
        addedOn: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        favorite: false,
        imageUrl,
      },
      ...prev,
    ]);

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

      <CollectionStats
        totalCards={cards.length}
        favorites={cards.filter((card) => card.favorite).length}
      />

      <section>
        <h3 className="mb-5 text-lg font-medium text-white">Recently added</h3>
        <CardGrid
          cards={cards}
          onToggleFavorite={toggleFavorite}
          onBuySlab={(card) =>
            message.info(`Custom slabs for ${card.name} are coming soon.`)
          }
        />
      </section>

      <AddCardModal
        open={isAdding}
        onClose={() => setIsAdding(false)}
        onAdd={addCard}
      />
    </div>
  );
}
