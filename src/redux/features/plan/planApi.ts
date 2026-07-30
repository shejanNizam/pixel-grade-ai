import baseApi from "@/redux/api/baseApi";
import type { PlanName } from "@/config/plans";
import type { TResponse } from "@/types/auth";

// ---------------------------------------------------------------------------
// The plan catalogue, server side. Exactly four fixed tiers: edit-only — no
// create, no delete, and `name` is rejected by the backend so a tier can
// never be renamed. Field names follow plan.interface.ts (priceMonthly,
// creditAmount), not the frontend catalogue's (price, credits).
// ---------------------------------------------------------------------------

export interface TPlan {
  _id: string;
  name: PlanName;
  tagline?: string;
  priceMonthly: number;
  /** Effective per-month price when billed yearly; charged ×12 up front. */
  priceYearly: number;
  /** Credits granted each interval. `null` means unlimited (Enterprise). */
  creditAmount: number | null;
  creditInterval: "daily" | "monthly";
  pixelscope: boolean;
  priceTracking: boolean;
  watermarkReports: boolean;
  features: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdatePlanBody = Partial<
  Pick<
    TPlan,
    | "tagline"
    | "priceMonthly"
    | "priceYearly"
    | "creditAmount"
    | "creditInterval"
    | "pixelscope"
    | "priceTracking"
    | "watermarkReports"
    | "features"
    | "isActive"
  >
>;

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Public catalogue — active plans only. */
    getPlans: builder.query<TPlan[], void>({
      query: () => ({ url: "/plan", method: "GET" }),
      transformResponse: (res: TResponse<TPlan[]>) => res.data,
      providesTags: ["plan"],
    }),

    /** Admin catalogue — includes deactivated plans. */
    getAdminPlans: builder.query<TPlan[], void>({
      query: () => ({ url: "/plan/admin", method: "GET" }),
      transformResponse: (res: TResponse<TPlan[]>) => res.data,
      providesTags: ["plan"],
    }),

    updatePlan: builder.mutation<
      TPlan,
      { planId: string; body: UpdatePlanBody }
    >({
      query: ({ planId, body }) => ({
        url: `/plan/${planId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: TResponse<TPlan>) => res.data,
      // Plan changes ripple into subscriber MRR and the dashboards.
      invalidatesTags: ["plan", "subscription", "dashboard"],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetAdminPlansQuery,
  useUpdatePlanMutation,
} = planApi;
