import baseApi from "@/redux/api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 01. get user data api endpoint
    getUserData: builder.query({
      query: () => {
        return {
          url: "api/auth/me/",
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),

    // 02. update user data api endpoint
    updateUserData: builder.mutation({
      query: (userData) => {
        return {
          url: "/",
          // url: "/user/update-profile",
          method: "POST",
          body: userData,
        };
      },
      invalidatesTags: ["user"],
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/api/auth/profile/",
        method: "PATCH",
        body: formData,
        formData: true, // Important for file upload
      }),
      invalidatesTags: ["auth", "user"],
    }),
  }),
});

export const {
  useGetUserDataQuery,
  useUpdateUserDataMutation,
  useUpdateProfileMutation,
} = userApi;
