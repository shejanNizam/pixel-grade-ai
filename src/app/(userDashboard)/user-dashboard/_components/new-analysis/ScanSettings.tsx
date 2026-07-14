"use client";

import { Select } from "antd";
import { useState } from "react";

/* Placeholder options — replace with the real taxonomy when it's defined. */
const cardTypes = [
  { value: "pokemon", label: "Pokémon", comingSoon: false },
  { value: "magic", label: "Magic: The Gathering", comingSoon: true },
  { value: "yugioh", label: "Yu-Gi-Oh!", comingSoon: true },
  { value: "sports", label: "Sports", comingSoon: true },
];

const languages = [
  { value: "en", label: "English" },
  { value: "ja", label: "Japanese" },
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
            onChange={(val) => {
              const selected = cardTypes.find((c) => c.value === val);
              if (!selected?.comingSoon) setCardType(val);
            }}
            placeholder="Card type"
            size="large"
            className="w-full"
            optionRender={(option) => {
              const item = cardTypes.find((c) => c.value === option.value);
              return (
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {item?.comingSoon && (
                    <span className="ml-2 rounded text-xs font-medium text-amber-400">
                      Coming Soon
                    </span>
                  )}
                </div>
              );
            }}
            options={cardTypes.map((c) => ({
              value: c.value,
              label: c.label,
              disabled: c.comingSoon,
            }))}
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
