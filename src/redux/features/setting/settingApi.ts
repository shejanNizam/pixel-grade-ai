import baseApi from "@/redux/api/baseApi";
import type { TResponse } from "@/types/auth";

// ---------------------------------------------------------------------------
// CMS pages (about / terms / privacy).
//
// Reads are public; writes are admin-only. Slug is the identity — there is no
// separate id, and no create/delete: the three pages always exist (seeded).
// ---------------------------------------------------------------------------

export type CmsSlug = "about" | "terms" | "privacy";

export interface CmsPage {
  _id: string;
  slug: CmsSlug;
  htmlContent: string;
  updatedAt?: string;
}

export const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCmsPage: builder.query<CmsPage, CmsSlug>({
      query: (slug) => ({ url: `/cms/${slug}`, method: "GET" }),
      transformResponse: (res: TResponse<CmsPage>) => res.data,
      providesTags: (result, error, slug) => [{ type: "cms", id: slug }],
    }),

    /** Admin editor save. Max 200,000 characters (backend-enforced). */
    updateCmsPage: builder.mutation<
      CmsPage,
      { slug: CmsSlug; htmlContent: string }
    >({
      query: ({ slug, htmlContent }) => ({
        url: `/cms/${slug}`,
        method: "PATCH",
        body: { htmlContent },
      }),
      transformResponse: (res: TResponse<CmsPage>) => res.data,
      invalidatesTags: (result, error, { slug }) => [{ type: "cms", id: slug }],
    }),
  }),
});

export const { useGetCmsPageQuery, useUpdateCmsPageMutation } = settingApi;
