import baseApi from "@/redux/api/baseApi";
import type { TMeta, TResponse, TUser } from "@/types/auth";

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

/** Query params for the admin user list — maps 1:1 onto QueryBuilder:
 *  `searchTerm` regex-matches name/email; any other key is a plain filter. */
export interface UserListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: "active" | "blocked";
  role?: TUser["role"];
  sort?: string;
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
          Pick<TUser, "name" | "username" | "phone"> & {
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

    // ---- admin ------------------------------------------------------------
    // These sit behind checkAuth(admin, super_admin) on the backend; a plain
    // user gets a 403, so nothing here needs client-side role checks beyond
    // not rendering the admin UI.

    /** Paginated user list. Keeps the envelope's `meta` — the tables need it. */
    getAllUsers: builder.query<
      { data: TUser[]; meta?: TMeta },
      UserListParams | void
    >({
      query: (params) => ({
        url: "/user/all-users",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TUser[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["user"],
    }),

    getUserById: builder.query<TUser, string>({
      query: (userId) => ({ url: `/user/${userId}`, method: "GET" }),
      transformResponse: (res: TResponse<TUser>) => res.data,
      providesTags: ["user"],
    }),

    /** Block/unblock and other admin edits — same PATCH the profile uses,
     *  but with the admin-only fields the backend guards for regular users. */
    updateUserByAdmin: builder.mutation<
      TUser,
      {
        userId: string;
        body: Partial<
          Pick<TUser, "name" | "phone" | "role" | "status" | "isEmailVerified">
        > & { blockReason?: string };
      }
    >({
      query: ({ userId, body }) => ({
        url: `/user/${userId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: TResponse<TUser>) => res.data,
      invalidatesTags: ["user", "dashboard"],
    }),

    /** Soft delete — the backend flips isDeleted, it does not drop the row. */
    deleteUserByAdmin: builder.mutation<TUser, string>({
      query: (userId) => ({ url: `/user/${userId}`, method: "DELETE" }),
      transformResponse: (res: TResponse<TUser>) => res.data,
      invalidatesTags: ["user", "dashboard"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadFilesMutation,
  useDeleteMyAccountMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserByAdminMutation,
  useDeleteUserByAdminMutation,
} = userApi;
