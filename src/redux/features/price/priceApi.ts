import baseApi from "@/redux/api/baseApi";
import type { TResponse } from "@/types/auth";
import type { TCard } from "@/types/card";

// ---------------------------------------------------------------------------
// Price tracking — Collector plan and above (server-enforced; expect 403 on
// Free). Change percentages are value-weighted, not a plain mean.
// ---------------------------------------------------------------------------

export type PriceWindow = "24h" | "7d" | "30d" | "1y";

export interface TPricePoint {
  capturedAt: string;
  price: number;
}

export interface TPortfolioSummary {
  totalValue: number;
  totalCards: number;
  /** Null when the portfolio has no value to weight against. */
  change24h: number | null;
  change7d: number | null;
  change30d: number | null;
}

export const priceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolioSummary: builder.query<TPortfolioSummary, void>({
      query: () => ({ url: "/price/portfolio", method: "GET" }),
      transformResponse: (res: TResponse<TPortfolioSummary>) => res.data,
      providesTags: ["price", "collection"],
    }),

    /** One request for many sparklines. Cards with no history come back as
     *  empty arrays, never missing keys. Capped at 50 ids. */
    getPriceHistoryBatch: builder.query<
      Record<string, TPricePoint[]>,
      { cardIds: string[]; window?: PriceWindow }
    >({
      query: ({ cardIds, window }) => ({
        url: "/price/history",
        method: "GET",
        params: { cardIds: cardIds.join(","), ...(window ? { window } : {}) },
      }),
      transformResponse: (res: TResponse<Record<string, TPricePoint[]>>) =>
        res.data,
      providesTags: ["price"],
    }),

    getCardPrice: builder.query<
      {
        card: TCard;
        window: PriceWindow;
        history: TPricePoint[];
        change?: number;
      },
      { cardId: string; window?: PriceWindow }
    >({
      query: ({ cardId, window }) => ({
        url: `/price/${cardId}`,
        method: "GET",
        params: window ? { window } : undefined,
      }),
      transformResponse: (
        res: TResponse<{
          card: TCard;
          window: PriceWindow;
          history: TPricePoint[];
          change?: number;
        }>,
      ) => res.data,
      providesTags: ["price"],
    }),
  }),
});

export const {
  useGetPortfolioSummaryQuery,
  useGetPriceHistoryBatchQuery,
  useGetCardPriceQuery,
} = priceApi;
