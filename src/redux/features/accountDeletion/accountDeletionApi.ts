import baseApi from "@/redux/api/baseApi";

export interface DeleteAccountRequest {
  password: string;
  refresh?: string;
}

export interface DeleteAccountResponse {
  message: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const accountDeletionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteAccount: builder.mutation<
      DeleteAccountResponse,
      DeleteAccountRequest
    >({
      query: (body) => ({
        url: "api/auth/me/delete/",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["auth", "user"],
    }),

    //
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "api/auth/password/change/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const { useDeleteAccountMutation, useChangePasswordMutation } =
  accountDeletionApi;
