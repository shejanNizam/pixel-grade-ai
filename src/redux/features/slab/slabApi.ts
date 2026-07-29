import baseApi from "@/redux/api/baseApi";
import type { TGradingReport } from "@/redux/features/grading/gradingApi";
import type { TMeta, TResponse } from "@/types/auth";

// ---------------------------------------------------------------------------
// Slab labels. Only the background artwork is AI-generated; the card image and
// label text are composited SERVER-side so a client can never break the
// template or shift the card opening. Geometry is stored per label because the
// printer's final spec sheet may adjust it — never hardcode dimensions when
// rendering.
//
// Since 2026-07-30 a label carries FOUR artwork options (EXT. ART 1-4) derived
// from the confirmed card, rather than one background from a fixed theme.
// ---------------------------------------------------------------------------

/** Legacy fixed themes. Only appears on labels created before 2026-07-30. */
export type TSlabStyle = "cosmic" | "inferno" | "aurora" | "vintage";

export interface TSlabVariant {
  /** 1-based, matching the "EXT. ART n" label shown to the user. */
  index: number;
  /** The generated environment ALONE — this is what the thumbnail shows. It
   *  never contains the card, per the client's explicit requirement. */
  artworkUrl: string;
  /** The full server render using this artwork: what the large preview shows
   *  and what the export contains. Pre-rendered for every option so switching
   *  between them is instant. */
  compositeUrl?: string;
}

export interface TSlabLabel {
  _id: string;
  /** Populated on reads. */
  report: TGradingReport | string;
  user: string;
  /** Legacy. Meaningless for labels created after the EXT. ART change. */
  styleId?: TSlabStyle;
  /** The four options the user chooses between. Empty on legacy labels. */
  variants: TSlabVariant[];
  /** Which option is selected, as a 1-based `TSlabVariant.index`. */
  selectedVariant?: number;
  /** What went in the card window, frozen when the label was first rendered. */
  cardImageUrl?: string;
  /** Which source produced it: the user's scan, the publisher's catalogue
   *  image, or an AI rendering. Surfaced in the UI so a slab is never
   *  ambiguous about whether it shows the card that was graded. */
  cardImageSource?: "scan" | "catalogue" | "generated";
  /** The selected option's artwork. */
  backgroundUrl?: string;
  compositeUrl?: string;
  exportPngUrl?: string;
  exportPdfUrl?: string;
  widthMm: number;
  heightMm: number;
  openingWMm: number;
  openingHMm: number;
  labelWMm: number;
  labelHMm: number;
  bleedMm: number;
  safeMm: number;
  /** Increments on each regenerate. */
  version: number;
  createdAt?: string;
}

export const slabApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Creates the label, generates its four EXT. ART options, and composites
     * all of them. SLOW — four image generations plus four full-canvas
     * composites. Expect tens of seconds, and give the user a progress state.
     */
    createSlabLabel: builder.mutation<TSlabLabel, { reportId: string }>({
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

    /**
     * Four COMPLETELY NEW options, same card and text. Version increments.
     *
     * Four more billed image generations every time — this is the expensive
     * button on the screen.
     */
    regenerateSlab: builder.mutation<TSlabLabel, { labelId: string }>({
      query: ({ labelId }) => ({
        url: `/slab/${labelId}/regenerate`,
        method: "POST",
        body: {},
      }),
      transformResponse: (res: TResponse<TSlabLabel>) => res.data,
      invalidatesTags: ["slab"],
    }),

    /** Switches which EXT. ART option the slab uses. Free — all four are
     *  already rendered, so this only re-points the export. */
    selectSlabVariant: builder.mutation<
      TSlabLabel,
      { labelId: string; variantIndex: number }
    >({
      query: ({ labelId, variantIndex }) => ({
        url: `/slab/${labelId}/variant`,
        method: "PATCH",
        body: { variantIndex },
      }),
      transformResponse: (res: TResponse<TSlabLabel>) => res.data,
      invalidatesTags: ["slab"],
    }),
  }),
});

export const {
  useCreateSlabLabelMutation,
  useGetMySlabLabelsQuery,
  useGetSlabLabelQuery,
  useRegenerateSlabMutation,
  useSelectSlabVariantMutation,
} = slabApi;
