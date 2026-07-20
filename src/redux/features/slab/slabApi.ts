import baseApi from "@/redux/api/baseApi";
import type { TGradingReport } from "@/redux/features/grading/gradingApi";
import type { TMeta, TResponse } from "@/types/auth";

// ---------------------------------------------------------------------------
// Slab labels. Only the background is AI-generated; the card image and label
// text are composited SERVER-side so a client can never break the template or
// shift the card opening. Geometry is stored per label because the printer's
// final spec sheet may adjust it — never hardcode dimensions when rendering.
// ---------------------------------------------------------------------------

export type TSlabStyle = "cosmic" | "inferno" | "aurora" | "vintage";

export interface TSlabLabel {
  _id: string;
  /** Populated on reads. */
  report: TGradingReport | string;
  user: string;
  styleId: TSlabStyle;
  /** The AI-generated layer — the only thing "regenerate" replaces. */
  backgroundUrl?: string;
  compositeUrl?: string;
  exportPngUrl?: string;
  exportPdfUrl?: string;
  widthMm: number;
  heightMm: number;
  openingWMm: number;
  openingHMm: number;
  bleedMm: number;
  safeMm: number;
  /** Increments on each regenerate. */
  version: number;
  createdAt?: string;
}

export const slabApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSlabStyles: builder.query<TSlabStyle[], void>({
      query: () => ({ url: "/slab/styles", method: "GET" }),
      transformResponse: (res: TResponse<TSlabStyle[]>) => res.data,
    }),

    /** Creates AND renders the label — slow (image generation + compositing). */
    createSlabLabel: builder.mutation<
      TSlabLabel,
      { reportId: string; styleId?: TSlabStyle }
    >({
      query: (body) => ({ url: "/slab", method: "POST", body }),
      transformResponse: (res: TResponse<TSlabLabel>) => res.data,
      invalidatesTags: ["slab", "dashboard"],
    }),

    getMySlabLabels: builder.query<
      { data: TSlabLabel[]; meta?: TMeta },
      { page?: number; limit?: number; sort?: string } | void
    >({
      query: (params) => ({
        url: "/slab",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TSlabLabel[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["slab"],
    }),

    getSlabLabel: builder.query<TSlabLabel, string>({
      query: (labelId) => ({ url: `/slab/${labelId}`, method: "GET" }),
      transformResponse: (res: TResponse<TSlabLabel>) => res.data,
      providesTags: ["slab"],
    }),

    /** New background art, same card and text. Version increments. */
    regenerateSlab: builder.mutation<
      TSlabLabel,
      { labelId: string; styleId?: TSlabStyle }
    >({
      query: ({ labelId, ...body }) => ({
        url: `/slab/${labelId}/regenerate`,
        method: "POST",
        body,
      }),
      transformResponse: (res: TResponse<TSlabLabel>) => res.data,
      invalidatesTags: ["slab"],
    }),
  }),
});

export const {
  useGetSlabStylesQuery,
  useCreateSlabLabelMutation,
  useGetMySlabLabelsQuery,
  useGetSlabLabelQuery,
  useRegenerateSlabMutation,
} = slabApi;
