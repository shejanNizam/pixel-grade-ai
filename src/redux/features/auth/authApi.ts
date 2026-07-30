import baseApi from "@/redux/api/baseApi";
import type { LoginData, SignupData, TResponse, TUser } from "@/types/auth";

// ---------------------------------------------------------------------------
// Auth + onboarding endpoints, mapped 1:1 onto the Express backend.
//
// The signup flow is two calls: register → otp/verify. Register sends the
// verification email itself (server-side, since 2026-07-29) and reports whether
// it went out via `verificationEmailSent`; /otp/send remains for Resend only.
// Login is refused (403) until the email is verified. Password reset arrives as
// an emailed link to /reset-password?id=…&token=… — the token goes back as a
// Bearer header, not in the body.
// ---------------------------------------------------------------------------

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<
      SignupData,
      {
        name: string;
        email: string;
        password: string;
        /** Required by the server — the public Creator Profile handle. */
        username: string;
        phone?: string;
      }
    >({
      query: (body) => ({
        url: "/user/register",
        method: "POST",
        body,
      }),
      transformResponse: (res: TResponse<SignupData>) => res.data,
    }),

    login: builder.mutation<LoginData, { email: string; password: string }>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (res: TResponse<LoginData>) => res.data,
      invalidatesTags: ["auth", "user"],
    }),

    logoutApi: builder.mutation<null, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["auth", "user"],
    }),

    /** Email verification + any OTP-driven step. Rate limit: 5/hour. */
    sendOtp: builder.mutation<null, { email: string }>({
      query: (body) => ({
        url: "/otp/send",
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation<null, { email: string; otp: string }>({
      query: (body) => ({
        url: "/otp/verify",
        method: "POST",
        body,
      }),
    }),

    forgetPassword: builder.mutation<null, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    /** `token` comes from the emailed link's query string. */
    resetPassword: builder.mutation<
      null,
      { id: string; token: string; newPassword: string }
    >({
      query: ({ id, token, newPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: { id, newPassword },
      }),
    }),

    changePassword: builder.mutation<
      null,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),

    /** For Google-born accounts that have no password yet. */
    setPassword: builder.mutation<null, { password: string }>({
      query: (body) => ({
        url: "/auth/set-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export type { TUser };

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutApiMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useSetPasswordMutation,
} = authApi;
