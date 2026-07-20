import baseApi from "@/redux/api/baseApi";
import type { TMeta, TResponse } from "@/types/auth";

// ---------------------------------------------------------------------------
// Credit wallet + ledger. Every balance change writes a ledger row, so the
// latest row's `balanceAfter` IS the current balance — there is no separate
// admin balance endpoint, and none is needed.
// ---------------------------------------------------------------------------

export type TCreditReason =
  | "grant_daily"
  | "grant_monthly"
  | "scan"
  | "refund"
  | "admin_adjust";

export interface TCreditLedgerRow {
  _id: string;
  user: string;
  /** Positive for a grant, negative for a spend (-10 for one scan). */
  amount: number;
  reason: TCreditReason;
  analysis?: string;
  /** Balance immediately after this entry. */
  balanceAfter: number;
  meta?: Record<string, unknown>;
  createdAt?: string;
}

/** Matches CreditServices.getBalance. `balance`, `scansRemaining`, and
 *  `allowance` are null on an unlimited (Enterprise) wallet — read
 *  `isUnlimited` rather than treating null as zero. */
export interface TCreditBalance {
  balance: number | null;
  isUnlimited: boolean;
  creditsPerScan: number;
  scansRemaining: number | null;
  allowance: number | null;
  interval: "daily" | "monthly";
  periodEnd?: string;
}

export const creditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCreditBalance: builder.query<TCreditBalance, void>({
      query: () => ({ url: "/credit/me", method: "GET" }),
      transformResponse: (res: TResponse<TCreditBalance>) => res.data,
      providesTags: ["credit"],
    }),

    /** Admin view of any user's ledger, newest first. */
    getUserLedger: builder.query<
      { data: TCreditLedgerRow[]; meta?: TMeta },
      { userId: string; page?: number; limit?: number }
    >({
      query: ({ userId, ...params }) => ({
        url: `/credit/${userId}/ledger`,
        method: "GET",
        params,
      }),
      transformResponse: (res: TResponse<TCreditLedgerRow[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["credit"],
    }),

    /** Additive admin adjustment — never a reset; negative clamps at zero. */
    adjustUserCredits: builder.mutation<
      { balance: number },
      { userId: string; amount: number; note?: string }
    >({
      query: ({ userId, ...body }) => ({
        url: `/credit/${userId}/adjust`,
        method: "POST",
        body,
      }),
      transformResponse: (res: TResponse<{ balance: number }>) => res.data,
      invalidatesTags: ["credit"],
    }),
  }),
});

export const {
  useGetMyCreditBalanceQuery,
  useGetUserLedgerQuery,
  useAdjustUserCreditsMutation,
} = creditApi;
