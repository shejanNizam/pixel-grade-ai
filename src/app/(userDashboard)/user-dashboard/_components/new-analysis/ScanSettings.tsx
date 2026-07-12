"use client";

import { Select } from "antd";
import { useState } from "react";

/* Placeholder options — replace with the real taxonomy when it's defined. */
const cardTypes = [
  { value: "pokemon", label: "Pokémon" },
  { value: "magic", label: "Magic: The Gathering" },
  { value: "yugioh", label: "Yu-Gi-Oh!" },
  { value: "sports", label: "Sports" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "ja", label: "Japanese" },
  { value: "de", label: "German" },
  { value: "fr", label: "French" },
];

export default function ScanSettings() {
  const [cardType, setCardType] = useState<string>();
  const [language, setLanguage] = useState<string>();

  return (
    <section>
      <h2 className="text-lg font-medium text-white">Scan settings</h2>

      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="card-type"
            className="mb-1.5 block text-xs text-zinc-400"
          >
            Card type
          </label>
          <Select
            id="card-type"
            value={cardType}
            onChange={setCardType}
            options={cardTypes}
            placeholder="Card type"
            size="large"
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="language"
            className="mb-1.5 block text-xs text-zinc-400"
          >
            Language
          </label>
          <Select
            id="language"
            value={language}
            onChange={setLanguage}
            options={languages}
            placeholder="Language"
            size="large"
            className="w-full"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-[#111113] px-4 py-5 text-center">
          <p className="text-xs text-zinc-500">AI Model</p>
          <p className="mt-1 text-sm font-medium text-white">PixelGrade AI</p>
        </div>
      </div>
    </section>
  );
}
