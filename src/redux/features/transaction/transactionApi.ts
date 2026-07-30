import baseApi from "@/redux/api/baseApi";
import type { TMeta, TResponse } from "@/types/auth";

// ---------------------------------------------------------------------------
// Money records — recurring subscriptions and one-off slab orders in one
// collection, mirroring transaction.interface.ts on the server.
// ---------------------------------------------------------------------------

export type TTxnType = "subscription" | "slab_order";
export type TTxnStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface TTransaction {
  _id: string;
  /** Populated with name/email on the admin list. */
  user: string | { _id: string; name: string; email: string };
  type: TTxnType;
  subscription?: string;
  /** Populated with name where set. */
  plan?: string | { _id: string; name: string };
  slabOrder?: string;
  invoiceNumber?: string;
  amount: number;
  currency: string;
  status: TTxnStatus;
  stripeRef?: string;
  createdAt?: string;
}

export interface TransactionListParams {
  page?: number;
  limit?: number;
  sort?: string;
  status?: TTxnStatus;
  type?: TTxnType;
}

/** Succeeded only; refunds reported separately, never netted off. */
export interface TEarnings {
  grossRevenue: number;
  subscriptionRevenue: number;
  slabOrderRevenue: number;
  subscriptionCount: number;
  slabOrderCount: number;
  refundedAmount: number;
  refundedCount: number;
}

export interface TMonthlyRevenue {
  _id: { year: number; month: number };
  total: number;
  count: number;
}

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query<
      { data: TTransaction[]; meta?: TMeta },
      TransactionListParams | void
    >({
      query: (params) => ({
        url: "/transaction",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TTransaction[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["transaction"],
    }),

    getMyTransactions: builder.query<
      { data: TTransaction[]; meta?: TMeta },
      TransactionListParams | void
    >({
      query: (params) => ({
        url: "/transaction/me",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TTransaction[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["transaction"],
    }),

    getEarnings: builder.query<
      TEarnings,
      { from?: string; to?: string } | void
    >({
      query: (params) => ({
        url: "/transaction/earnings",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TEarnings>) => res.data,
      providesTags: ["transaction"],
    }),

    getRevenueByMonth: builder.query<
      TMonthlyRevenue[],
      { months?: number } | void
    >({
      query: (params) => ({
        url: "/transaction/revenue-by-month",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TMonthlyRevenue[]>) => res.data,
      providesTags: ["transaction"],
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useGetMyTransactionsQuery,
  useGetEarningsQuery,
  useGetRevenueByMonthQuery,
} = transactionApi;
