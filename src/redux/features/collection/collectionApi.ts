import baseApi from "@/redux/api/baseApi";
import type { TGradingReport } from "@/redux/features/grading/gradingApi";
import type { TMeta, TResponse } from "@/types/auth";
import type { TCard } from "@/types/card";

// ---------------------------------------------------------------------------
// Collection management. An entry is either a scanned card (backed by a
// grading report) or a manual one the user typed in — `report` is null on the
// manual path precisely so it never needs a fake grade.
// ---------------------------------------------------------------------------

export interface TCollectionItem {
  _id: string;
  user: string;
  /** Joined in by the list endpoint; a bare id on create/update responses. */
  card: TCard | string;
  /** Null when added manually — no AI grade exists. */
  report?: TGradingReport | string | null;
  manualImageUrl?: string;
  /** A third-party grade the card already carries, e.g. "PSA 9 MINT". */
  externalGrade?: string;
  quantity: number;
  favorite: boolean;
  currentPrice?: number;
  change24h?: number;
  change7d?: number;
  change30d?: number;
  addedAt?: string;
}

export interface CollectionListParams {
  page?: number;
  limit?: number;
  /** Regex-matches the card name. */
  searchTerm?: string;
  set?: string;
  rarity?: string;
  favorite?: boolean;
  verified?: boolean;
  minGrade?: number;
  maxGrade?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "addedAt" | "price" | "grade" | "name";
  sortOrder?: "asc" | "desc";
}

export interface TCollectionSummary {
  totalValue: number;
  /** Quantity-weighted — two copies of one card count as two. */
  totalCards: number;
  entryCount: number;
  /** Null when nothing is graded — not the same as an average of zero. */
  averageGrade: number | null;
  /** Entries in the collection carrying the server-awarded badge. Counted on
   *  the flag, never on "has a report". */
  pixelVerifiedCount: number;
  /** Mean confidence across graded entries. Null when nothing is graded. */
  averageConfidence: number | null;
}

export interface TValuePoint {
  /** "YYYY-MM". */
  month: string;
  value: number;
}

export interface TSetBucket {
  /** The set name; null bucket = cards with no set on record. */
  _id: string | null;
  count: number;
  value: number;
}

export interface AddCollectionItemBody {
  /** Scanned path: the report supplies the card server-side. */
  report?: string;
  /** Manual path: card id (+ optional image/grade). */
  card?: string;
  manualImageUrl?: string;
  externalGrade?: string;
  quantity?: number;
  favorite?: boolean;
}

export const collectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCollection: builder.query<
      { data: TCollectionItem[]; meta?: TMeta },
      CollectionListParams | void
    >({
      query: (params) => ({
        url: "/collection",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TCollectionItem[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["collection"],
    }),

    getCollectionSummary: builder.query<
      TCollectionSummary,
      { favorite?: boolean } | void
    >({
      query: (params) => ({
        url: "/collection/summary",
        method: "GET",
        params: params?.favorite ? { favorite: true } : undefined,
      }),
      transformResponse: (res: TResponse<TCollectionSummary>) => res.data,
      providesTags: ["collection"],
    }),

    getCollectionValueOverTime: builder.query<
      TValuePoint[],
      { months?: number } | void
    >({
      query: (params) => ({
        url: "/collection/value-over-time",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TValuePoint[]>) => res.data,
      providesTags: ["collection"],
    }),

    getCollectionBySet: builder.query<TSetBucket[], void>({
      query: () => ({ url: "/collection/by-set", method: "GET" }),
      transformResponse: (res: TResponse<TSetBucket[]>) => res.data,
      providesTags: ["collection"],
    }),

    addCollectionItem: builder.mutation<TCollectionItem, AddCollectionItemBody>(
      {
        query: (body) => ({ url: "/collection", method: "POST", body }),
        transformResponse: (res: TResponse<TCollectionItem>) => res.data,
        invalidatesTags: ["collection", "dashboard"],
      },
    ),

    updateCollectionItem: builder.mutation<
      TCollectionItem,
      {
        itemId: string;
        body: Partial<
          Pick<
            TCollectionItem,
            "quantity" | "favorite" | "externalGrade" | "manualImageUrl"
          >
        >;
      }
    >({
      query: ({ itemId, body }) => ({
        url: `/collection/${itemId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: TResponse<TCollectionItem>) => res.data,
      invalidatesTags: ["collection", "dashboard"],
    }),

    removeCollectionItem: builder.mutation<TCollectionItem, string>({
      query: (itemId) => ({ url: `/collection/${itemId}`, method: "DELETE" }),
      transformResponse: (res: TResponse<TCollectionItem>) => res.data,
      invalidatesTags: ["collection", "dashboard"],
    }),
  }),
});

export const {
  useGetMyCollectionQuery,
  useGetCollectionSummaryQuery,
  useGetCollectionValueOverTimeQuery,
  useGetCollectionBySetQuery,
  useAddCollectionItemMutation,
  useUpdateCollectionItemMutation,
  useRemoveCollectionItemMutation,
} = collectionApi;
