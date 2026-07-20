"use client";

import {
  useConfirmCardMutation,
  useCreateAnalysisMutation,
  type TAnalysis,
  type TCardCandidate,
  type TUploadSource,
} from "@/redux/features/analysis/analysisApi";
import { useAddCollectionItemMutation } from "@/redux/features/collection/collectionApi";
import {
  useGradeAnalysisMutation,
  type TGradingReport,
} from "@/redux/features/grading/gradingApi";
import { analysisApi } from "@/redux/features/analysis/analysisApi";
import { useUploadFilesMutation } from "@/redux/features/user/userApi";
import type { CardGame } from "@/types/card";
import { useAppDispatch } from "@/redux/hooks";
import { App, ConfigProvider, Modal, Spin } from "antd";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiCheck } from "react-icons/fi";

// ---------------------------------------------------------------------------
// The scan pipeline in one dialog:
//
//   upload files → POST /analysis (identify, 10 credits) → user CONFIRMS the
//   match (hard gate — grading refuses to run without it) → POST /grading →
//   report.
//
// Identification failures are refunded server-side; the dialog just reports.
// ---------------------------------------------------------------------------

type Step =
  | { name: "uploading" }
  | { name: "identifying" }
  | { name: "confirm"; analysis: TAnalysis; candidates: TCardCandidate[] }
  | { name: "grading" }
  | { name: "result"; report: TGradingReport }
  | { name: "error"; message: string };

interface ScanFlowModalProps {
  open: boolean;
  source: TUploadSource;
  game?: CardGame;
  language?: string;
  front: File[];
  back: File[];
  onClose: () => void;
}

/** Pull the backend envelope's message out of an RTK error, if there is one. */
const errorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === "object" && err !== null && "data" in err) {
    const data = (err as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return fallback;
};

export default function ScanFlowModal({
  open,
  source,
  game,
  language,
  front,
  back,
  onClose,
}: ScanFlowModalProps) {
  const { message: toast } = App.useApp();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<Step>({ name: "uploading" });
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const [uploadFiles] = useUploadFilesMutation();
  const [createAnalysis] = useCreateAnalysisMutation();
  const [confirmCard, { isLoading: isConfirming }] = useConfirmCardMutation();
  const [gradeAnalysis] = useGradeAnalysisMutation();
  const [addToCollection, { isLoading: isAddingToCollection }] =
    useAddCollectionItemMutation();

  const [addedToCollection, setAddedToCollection] = useState(false);

  // One pipeline run per open. The ref guards against StrictMode double-fire.
  const runId = useRef(0);

  const runPipeline = useCallback(async () => {
    const id = ++runId.current;
    const stillCurrent = () => runId.current === id;

    try {
      setStep({ name: "uploading" });

      // The upload endpoint takes at most 10 files per request, which is
      // exactly one side's maximum — so upload per side.
      const uploadSide = async (files: File[]) => {
        if (files.length === 0) return [];
        const form = new FormData();
        files.forEach((file) => form.append("files", file));
        const result = await uploadFiles(form).unwrap();
        return Array.isArray(result) ? result : [result];
      };

      const [frontUploaded, backUploaded] = await Promise.all([
        uploadSide(front),
        uploadSide(back),
      ]);
      if (!stillCurrent()) return;

      setStep({ name: "identifying" });

      const analysis = await createAnalysis({
        source,
        game,
        language,
        images: [
          ...frontUploaded.map((file, i) => ({
            imageUrl: file.url,
            side: "front" as const,
            slotIndex: i,
          })),
          ...backUploaded.map((file, i) => ({
            imageUrl: file.url,
            side: "back" as const,
            slotIndex: i,
          })),
        ],
      }).unwrap();
      if (!stillCurrent()) return;

      // Candidates live on GET /analysis/:id (cards populated).
      const detail = await dispatch(
        analysisApi.endpoints.getAnalysis.initiate(analysis._id, {
          forceRefetch: true,
        }),
      ).unwrap();
      if (!stillCurrent()) return;

      setSelectedCardId(detail.candidates[0]?.card._id ?? null);
      setStep({
        name: "confirm",
        analysis: detail.analysis,
        candidates: detail.candidates,
      });
    } catch (err) {
      if (!stillCurrent()) return;
      setStep({
        name: "error",
        message: errorMessage(
          err,
          "The scan failed. Your credits were refunded — try again.",
        ),
      });
    }
  }, [back, createAnalysis, dispatch, front, game, language, source, uploadFiles]);

  useEffect(() => {
    if (!open) return;
    setAddedToCollection(false);
    void runPipeline();
    return () => {
      // Invalidate the run so a late response can't resurrect a closed dialog.
      runId.current++;
    };
  }, [open, runPipeline]);

  const confirmAndGrade = async () => {
    if (step.name !== "confirm" || !selectedCardId || isConfirming) return;
    const analysisId = step.analysis._id;

    try {
      await confirmCard({ analysisId, cardId: selectedCardId }).unwrap();
      setStep({ name: "grading" });
      const report = await gradeAnalysis(analysisId).unwrap();
      setStep({ name: "result", report });
    } catch (err) {
      setStep({
        name: "error",
        message: errorMessage(err, "Grading failed. Try again."),
      });
    }
  };

  const handleAddToCollection = async () => {
    if (step.name !== "result" || isAddingToCollection) return;
    try {
      await addToCollection({ report: step.report._id }).unwrap();
      setAddedToCollection(true);
      toast.success("Added to your collection.");
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't add the card. Try again."));
    }
  };

  const busy =
    step.name === "uploading" ||
    step.name === "identifying" ||
    step.name === "grading";

  const busyLabel =
    step.name === "uploading"
      ? "Uploading images…"
      : step.name === "identifying"
        ? "Identifying your card…"
        : "Grading your card — this can take a moment…";

  return (
    <ConfigProvider theme={{ components: { Modal: { contentBg: "#18181b" } } }}>
      <Modal
        open={open}
        onCancel={busy ? undefined : onClose}
        footer={null}
        centered
        width={560}
        maskClosable={false}
        closable={!busy}
        keyboard={!busy}
      >
        {busy && (
          <div className="flex flex-col items-center gap-4 py-14">
            <Spin size="large" />
            <p className="text-sm text-zinc-300">{busyLabel}</p>
          </div>
        )}

        {step.name === "confirm" && (
          <div className="py-2">
            <h2 className="text-lg font-semibold text-white">
              Confirm your card
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              Pick the card these images actually show — grading can&apos;t
              start until you confirm.
            </p>
            {step.analysis.detectedExternalGrade && (
              <p className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-[11px] text-amber-400">
                Detected an existing slab grade:{" "}
                {step.analysis.detectedExternalGrade}
              </p>
            )}

            <ul className="mt-5 max-h-80 space-y-2 overflow-y-auto pr-1">
              {step.candidates.map((candidate) => {
                const selected = selectedCardId === candidate.card._id;
                return (
                  <li key={candidate._id}>
                    <button
                      type="button"
                      onClick={() => setSelectedCardId(candidate.card._id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                        selected
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      {candidate.card.officialImageUrl ? (
                        <Image
                          src={candidate.card.officialImageUrl}
                          alt=""
                          width={40}
                          height={56}
                          className="h-14 w-10 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <span className="h-14 w-10 shrink-0 rounded-md bg-white/10" />
                      )}

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-white">
                          {candidate.card.name}
                        </span>
                        <span className="block truncate text-[11px] text-zinc-400">
                          {[
                            candidate.card.setExpansion,
                            candidate.card.cardNumber,
                            candidate.card.rarity,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                        {candidate.rank === 0 && (
                          <span className="mt-1 inline-block rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-medium text-violet-300">
                            Best match
                          </span>
                        )}
                      </span>

                      {selected && (
                        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white">
                          <FiCheck size={12} />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-white transition-colors hover:border-white/50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndGrade}
                disabled={!selectedCardId || isConfirming}
                className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isConfirming ? "Confirming…" : "Confirm & grade"}
              </button>
            </div>
          </div>
        )}

        {step.name === "result" && (
          <div className="py-2 text-center">
            <p className="text-xs tracking-wide text-zinc-400 uppercase">
              AI grade
            </p>
            <p className="mt-2 text-5xl font-semibold text-violet-400 tabular-nums">
              {step.report.grade}
            </p>
            <p className="mt-1 text-sm font-medium text-white">
              {step.report.gradeLabel}
              {step.report.pixelVerified && (
                <span className="ml-2 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                  Pixel Verified
                </span>
              )}
            </p>

            <dl className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-2">
              {[
                { label: "Surfaces", value: step.report.scoreSurface },
                { label: "Corners", value: step.report.scoreCorners },
                { label: "Edges", value: step.report.scoreEdges },
                { label: "Centering", value: step.report.scoreCentering },
              ].map((score) => (
                <div
                  key={score.label}
                  className="rounded-xl border border-violet-500/40 px-3 py-2.5"
                >
                  <dt className="text-[11px] text-zinc-400">{score.label}</dt>
                  <dd className="mt-0.5 text-lg font-medium text-white tabular-nums">
                    {score.value}
                  </dd>
                </div>
              ))}
            </dl>

            {step.report.reasoning && (
              <p className="mx-auto mt-4 max-w-md text-left text-xs leading-relaxed text-zinc-400">
                {step.report.reasoning}
              </p>
            )}

            <div className="mt-7 flex justify-center gap-3">
              <button
                onClick={handleAddToCollection}
                disabled={isAddingToCollection || addedToCollection}
                className="rounded-full border border-violet-500/60 px-5 py-2.5 text-sm text-violet-300 transition-colors hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addedToCollection ? "In your collection ✓" : "Add to collection"}
              </button>
              <button
                onClick={onClose}
                className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {step.name === "error" && (
          <div className="py-6 text-center">
            <p className="text-sm text-red-400">{step.message}</p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full border border-white/20 px-6 py-2.5 text-sm text-white transition-colors hover:border-white/50"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </ConfigProvider>
  );
}
