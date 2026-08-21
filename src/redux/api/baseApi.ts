import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout } from "@/redux/features/auth/authSlice";
import { clearAuthCookie } from "@/utils/cookieUtils";
import { env } from "@/config/env";
import type { TResponse } from "@/types/auth";

// ---------------------------------------------------------------------------
// One API slice for the whole app, pointed at the Express backend.
//
//   - Every route lives under /api/v1 (no trailing slashes).
//   - Responses arrive in the { statusCode, success, message, data, meta }
//     envelope; individual endpoints unwrap with transformResponse.
//   - The access token travels as a Bearer header from localStorage; the
//     REFRESH token lives in an httpOnly cookie the backend set at login,
//     which is why refresh sends no body and needs credentials: "include".
// ---------------------------------------------------------------------------

export const BASE_URL = `${env.API_URL}/api/v1`;

export const ACCESS_TOKEN_KEY = "accessToken";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    // Guard against SSR — `localStorage` only exists in the browser.
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
});

// ---------------------------------------------------------------------------
// Re-authentication wrapper
//
// On a 401/403 with a stored token, tries POST /auth/refresh-token once
// (deduping concurrent failures via a single shared promise), then retries the
// original request. If refresh fails, all credential layers are cleared.
//
// NOTE the backend quirk: an ABSENT token is rejected with 403, not 401, and
// refresh success returns 201. Both are matched deliberately.
// ---------------------------------------------------------------------------
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      // The refresh token is an httpOnly cookie — nothing to put in the body.
      credentials: "include",
    });

    if (!res.ok) return null;

    const body = (await res.json()) as TResponse<{ accessToken?: string }>;
    const accessToken = body.data?.accessToken;
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      return accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

const isAuthFailure = (status: unknown): boolean =>
  status === 401;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const hadToken =
    typeof window !== "undefined" &&
    Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));

  // Only attempt refresh when a token existed — a 403 on a public screen or a
  // role-denied admin route must not trigger a refresh loop. One retry max.
  if (result.error && isAuthFailure(result.error.status) && hadToken) {
    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });

    const newToken = await refreshPromise;

    if (newToken) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        clearAuthCookie();
      }
      api.dispatch(logout());
    }
  }

  return result;
};

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "auth",
    "user",
    "credit",
    "analysis",
    "grading",
    "collection",
    "price",
    "slab",
    "subscription",
    "transaction",
    "notification",
    "unreadCount",
    "notificationSettings",
    "support",
    "cms",
    "plan",
    "dashboard",
    "slabOrder",
    "Cart",
  ],
  endpoints: () => ({}),
});

export default baseApi;
