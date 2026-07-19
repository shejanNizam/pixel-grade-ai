import baseApi from "@/redux/api/baseApi";
import type { TResponse, TUser } from "@/types/auth";

// ---------------------------------------------------------------------------
// Profile endpoints.
//
// Avatar changes are two steps by design: upload the file to POST /upload
// (Cloudinary, returns { url, publicId }), then PATCH the user with that
// object. The backend accepts no multipart on the user routes.
// ---------------------------------------------------------------------------

export interface UploadedFile {
  url: string;
  publicId: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<TUser, void>({
      query: () => ({ url: "/user/me", method: "GET" }),
      transformResponse: (res: TResponse<TUser>) => res.data,
      providesTags: ["user"],
    }),

    updateProfile: builder.mutation<
      TUser,
      {
        userId: string;
        body: Partial<
          Pick<TUser, "name" | "phone"> & {
            avatar: { url: string; publicId: string };
          }
        >;
      }
    >({
      query: ({ userId, body }) => ({
        url: `/user/${userId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: TResponse<TUser>) => res.data,
      invalidatesTags: ["user"],
    }),

    /** Field name must be exactly `files`; 1-10 per request. Single file in →
     *  single object out, several in → array out (backend contract). */
    uploadFiles: builder.mutation<UploadedFile | UploadedFile[], FormData>({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
      transformResponse: (res: TResponse<UploadedFile | UploadedFile[]>) =>
        res.data,
    }),

    deleteMyAccount: builder.mutation<null, void>({
      query: () => ({ url: "/user/me", method: "DELETE" }),
      invalidatesTags: ["auth", "user"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadFilesMutation,
  useDeleteMyAccountMutation,
} = userApi;
