import baseApi from "@/redux/api/baseApi";
import type { TMeta, TResponse } from "@/types/auth";
import type { CardGame, TCard } from "@/types/card";

// ---------------------------------------------------------------------------
// The scan flow. POST /analysis uploads image URLs and identifies the card
// (10 credits); the user must then CONFIRM the match — a hard gate, grading
// refuses to run without it.
//
// The 10 credits buy a finished report, so they come back whenever one never
// arrives: identification failed, the user cancelled at the confirmation step,
// or the server's sweeper found the scan still unconfirmed after the timeout.
// ---------------------------------------------------------------------------

export type TUploadSource = "standard" | "pixelscope";
export type TImageSide = "front" | "back";

export type TAnalysisStatus =
  | "identifying"
  | "awaiting_confirmation"
  | "confirmed"
  | "graded"
  | "failed"
  /** The user abandoned it. Distinct from `failed`, and always refunded. */
  | "canceled";

export interface TAnalysis {
  _id: string;
  user: string;
  source: TUploadSource;
  game: CardGame;
  language?: string;
  imageSetHash: string;
  status: TAnalysisStatus;
  /** Populated on GET /analysis/:id. */
  bestMatchCard?: TCard | string;
  confirmedCard?: TCard | string;
  wasCorrected: boolean;
  /** e.g. "PSA 9 MINT" — the photographed card is already slabbed. */
  detectedExternalGrade?: string;
  createdAt?: string;
}

export interface TAnalysisImage {
  _id: string;
  analysis: string;
  imageUrl: string;
  side: TImageSide;
  slotIndex: number;
  qualityScore?: number;
}

export interface TCardCandidate {
  _id: string;
  analysis: string;
  card: TCard;
  /** 0 = best match. */
  rank: number;
  /** Vendor scale (~0.7–1.3+, unbounded) — rank with it, NEVER render as "N%". */
  matchScore: number;
}

export interface CreateAnalysisBody {
  /**
   * Idempotency key, one per scan attempt. This is the only endpoint that
   * spends credits, so a retried or double-fired POST carrying the same key
   * resolves to the scan already in flight instead of starting — and charging
   * for — a second one.
   */
  clientRequestId?: string;
  source?: TUploadSource;
  game?: CardGame;
  language?: string;
  images: { imageUrl: string; side?: TImageSide; slotIndex?: number }[];
}

export const analysisApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Runs identification synchronously — expect this to take a few seconds. */
    createAnalysis: builder.mutation<TAnalysis, CreateAnalysisBody>({
      query: (body) => ({ url: "/analysis", method: "POST", body }),
      transformResponse: (res: TResponse<TAnalysis>) => res.data,
      invalidatesTags: ["analysis", "credit"],
    }),

    getMyAnalyses: builder.query<
      { data: TAnalysis[]; meta?: TMeta },
      {
        page?: number;
        limit?: number;
        sort?: string;
        status?: TAnalysisStatus;
      } | void
    >({
      query: (params) => ({
        url: "/analysis",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TAnalysis[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["analysis"],
    }),

    getAnalysis: builder.query<
      {
        analysis: TAnalysis;
        images: TAnalysisImage[];
        candidates: TCardCandidate[];
      },
      string
    >({
      query: (analysisId) => ({
        url: `/analysis/${analysisId}`,
        method: "GET",
      }),
      transformResponse: (
        res: TResponse<{
          analysis: TAnalysis;
          images: TAnalysisImage[];
          candidates: TCardCandidate[];
        }>,
      ) => res.data,
      providesTags: ["analysis"],
    }),

    /** The chosen card must be one of the offered candidates. */
    confirmCard: builder.mutation<
      TAnalysis,
      { analysisId: string; cardId: string }
    >({
      query: ({ analysisId, cardId }) => ({
        url: `/analysis/${analysisId}/confirm`,
        method: "PATCH",
        body: { cardId },
      }),
      transformResponse: (res: TResponse<TAnalysis>) => res.data,
      invalidatesTags: ["analysis"],
    }),

    /** Abandon an unconfirmed scan and get its 10 credits back. Idempotent —
     *  safe to fire on dialog close without tracking whether it already ran. */
    cancelAnalysis: builder.mutation<TAnalysis, string>({
      query: (analysisId) => ({
        url: `/analysis/${analysisId}/cancel`,
        method: "PATCH",
      }),
      transformResponse: (res: TResponse<TAnalysis>) => res.data,
      invalidatesTags: ["analysis", "credit"],
    }),
  }),
});

export const {
  useCreateAnalysisMutation,
  useGetMyAnalysesQuery,
  useGetAnalysisQuery,
  useConfirmCardMutation,
  useCancelAnalysisMutation,
} = analysisApi;
