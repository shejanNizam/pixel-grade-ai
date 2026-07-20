import baseApi from "@/redux/api/baseApi";
import type { TResponse } from "@/types/auth";

// ---------------------------------------------------------------------------
// Read-only aggregates for the two dashboard landing pages.
//
// Shapes mirror pixel-grade-ai-server/src/app/modules/dashboard/
// dashboard.interface.ts. `delta` is a month-over-month percentage and is
// nullable ON PURPOSE: growth from a zero baseline has no meaningful
// percentage — render no chip in that case, never an invented "+100%".
// ---------------------------------------------------------------------------

export interface TStatCard {
  value: number;
  delta: number | null;
}

export interface TAdminOverview {
  totalUsers: TStatCard;
  subscribedUsers: TStatCard;
  newSubscribers: TStatCard;
  totalEarnings: TStatCard;
  /** Monthly recurring revenue — monthly-equivalent of active subscriptions. */
  mrr: number;
}

export interface TUserOverview {
  collectionValue: TStatCard;
  cardsInCollection: TStatCard;
  slabsOrdered: TStatCard;
  totalScans: TStatCard;
  /** Null when nothing is graded yet — no average, not an average of zero. */
  averageGrade: TStatCard | null;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<TAdminOverview, void>({
      query: () => ({ url: "/dashboard/admin", method: "GET" }),
      transformResponse: (res: TResponse<TAdminOverview>) => res.data,
      providesTags: ["dashboard"],
    }),

    getUserOverview: builder.query<TUserOverview, void>({
      query: () => ({ url: "/dashboard/me", method: "GET" }),
      transformResponse: (res: TResponse<TUserOverview>) => res.data,
      providesTags: ["dashboard"],
    }),
  }),
});

export const { useGetAdminOverviewQuery, useGetUserOverviewQuery } =
  dashboardApi;
