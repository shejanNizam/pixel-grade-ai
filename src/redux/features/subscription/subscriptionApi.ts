import baseApi from "@/redux/api/baseApi";
import type { TPlan } from "@/redux/features/plan/planApi";
import type { TMeta, TResponse } from "@/types/auth";

// ---------------------------------------------------------------------------
// Admin-side subscription endpoints.
//
// A "subscriber" row is a Subscription with its user and plan joined in —
// driven from the Subscription collection because "subscribed" is a fact
// about a subscription, not a column on the user account.
// ---------------------------------------------------------------------------

export type TSubscriptionStatus =
  | "active"
  | "past_due"
  | "cancelled"
  | "expired";

export interface TSubscriberRow {
  _id: string;
  status: TSubscriptionStatus;
  interval: "monthly" | "yearly";
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  subscribedAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
    status: "active" | "blocked";
    avatar?: { url: string; publicId: string };
    createdAt?: string;
  };
  plan: {
    _id: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
  };
}

export interface SubscriberListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  /** Omitted → backend defaults to active + past_due (people paying now). */
  status?: TSubscriptionStatus;
  /** Plan ObjectId. */
  plan?: string;
}

export interface TSubscriberStats {
  activeSubscriptions: number;
  /** Monthly recurring revenue — yearly plans counted at their effective monthly rate. */
  mrr: number;
  newThisMonth: number;
  newLastMonth: number;
}

export interface TSubscription {
  _id: string;
  user: string;
  plan: TPlan | string;
  status: TSubscriptionStatus;
  interval: "monthly" | "yearly";
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt?: string;
}

/** The caller's entitlement bundle: their subscription row (null on Free),
 *  the plan that actually applies (resolved server-side, so Free comes back
 *  as the Free plan document), and the live credit balance. */
export interface TMySubscription {
  subscription: TSubscription | null;
  plan: TPlan;
  credits: {
    /** Null for unlimited (Enterprise) wallets. */
    balance: number | null;
    scansLeft: number | null;
  };
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMySubscription: builder.query<TMySubscription, void>({
      query: () => ({ url: "/subscription/me", method: "GET" }),
      transformResponse: (res: TResponse<TMySubscription>) => res.data,
      providesTags: ["subscription", "credit"],
    }),

    /** Returns a Stripe Checkout URL — redirect the browser to it. */
    createCheckoutSession: builder.mutation<
      { url: string },
      { planId: string; interval: "monthly" | "yearly" }
    >({
      query: (body) => ({ url: "/subscription/checkout", method: "POST", body }),
      transformResponse: (res: TResponse<{ url: string }>) => res.data,
    }),

    cancelSubscription: builder.mutation<TSubscription, void>({
      query: () => ({ url: "/subscription/cancel", method: "POST" }),
      transformResponse: (res: TResponse<TSubscription>) => res.data,
      invalidatesTags: ["subscription", "credit", "dashboard"],
    }),

    getSubscribers: builder.query<
      { data: TSubscriberRow[]; meta?: TMeta },
      SubscriberListParams | void
    >({
      query: (params) => ({
        url: "/subscription/subscribers",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TSubscriberRow[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["subscription"],
    }),

    getSubscriberStats: builder.query<TSubscriberStats, void>({
      query: () => ({ url: "/subscription/stats", method: "GET" }),
      transformResponse: (res: TResponse<TSubscriberStats>) => res.data,
      providesTags: ["subscription"],
    }),
  }),
});

export const {
  useGetMySubscriptionQuery,
  useCreateCheckoutSessionMutation,
  useCancelSubscriptionMutation,
  useGetSubscribersQuery,
  useGetSubscriberStatsQuery,
} = subscriptionApi;
