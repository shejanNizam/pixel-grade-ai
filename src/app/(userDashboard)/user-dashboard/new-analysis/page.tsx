"use client";

import { useGetMySubscriptionQuery } from "@/redux/features/subscription/subscriptionApi";
import type { TUploadSource } from "@/redux/features/analysis/analysisApi";
import type { CardGame } from "@/types/card";
import { useState } from "react";
import AdvancedImport from "../_components/new-analysis/AdvancedImport";
import BestResultTips from "../_components/new-analysis/BestResultTips";
import CreditBalanceCard from "../_components/new-analysis/CreditBalanceCard";
import QuickImport from "../_components/new-analysis/QuickImport";
import ScanFlowModal from "../_components/new-analysis/ScanFlowModal";
import ScanSettings from "../_components/new-analysis/ScanSettings";

interface PendingScan {
  source: TUploadSource;
  front: File[];
  back: File[];
}

export default function NewAnalysis() {
  const { data } = useGetMySubscriptionQuery();

  // PixelScope (Advanced multi-image scan) is a paid feature — Free is locked
  // out of it and the Pixel Verified badge that comes with it. While the plan
  // is still loading, stay locked: the safe default matches Free.
  const pixelscopeLocked = !data?.plan.pixelscope;

  const [game, setGame] = useState<CardGame | undefined>("pokemon");
  const [language, setLanguage] = useState<string | undefined>();
  const [pending, setPending] = useState<PendingScan | null>(null);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-medium text-white">Scan Your Card</h2>
          <p className="mt-1.5 text-xs text-zinc-500">
            Get AI-powered analysis and a professional grade estimate in seconds
          </p>
        </div>

        <CreditBalanceCard />
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
        <div className="space-y-12">
          <QuickImport
            onStart={(front, back) =>
              setPending({ source: "standard", front, back })
            }
          />
          <AdvancedImport
            locked={pixelscopeLocked}
            onStart={(front, back) =>
              setPending({ source: "pixelscope", front, back })
            }
          />
        </div>

        <div className="space-y-10">
          <ScanSettings
            game={game}
            language={language}
            onGameChange={setGame}
            onLanguageChange={setLanguage}
          />
          <BestResultTips />
        </div>
      </div>

      <ScanFlowModal
        open={pending !== null}
        source={pending?.source ?? "standard"}
        game={game}
        language={language}
        front={pending?.front ?? []}
        back={pending?.back ?? []}
        onClose={() => setPending(null)}
      />
    </div>
  );
}
