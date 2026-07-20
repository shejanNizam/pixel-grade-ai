import baseApi from "@/redux/api/baseApi";
import type { TMeta, TResponse } from "@/types/auth";
import type { TCard } from "@/types/card";

// ---------------------------------------------------------------------------
// The card catalogue. READ-ONLY by design: rows are written by the
// identification pipeline, so a manual collection entry picks an existing
// catalogue card rather than inventing one.
// ---------------------------------------------------------------------------

export const cardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** `searchTerm` matches name, set/expansion, or card number. */
    searchCards: builder.query<
      { data: TCard[]; meta?: TMeta },
      { searchTerm?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/card",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TCard[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),

    /** Distinct set names, for collection filters. */
    getCardSets: builder.query<string[], void>({
      query: () => ({ url: "/card/sets", method: "GET" }),
      transformResponse: (res: TResponse<string[]>) => res.data,
    }),
  }),
});

export const { useSearchCardsQuery, useGetCardSetsQuery } = cardApi;
