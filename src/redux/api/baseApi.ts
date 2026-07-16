import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout } from "@/redux/features/auth/authSlice";
import { env } from "@/config/env";

export const BASE_URL = env.API_URL;

// ---------------------------------------------------------------------------
// Base query
// ---------------------------------------------------------------------------
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    // Guard against SSR — `localStorage` only exists in the browser.
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", "Bearer " + token);
      }
    }
    return headers;
  },
});

// ---------------------------------------------------------------------------
// Re-authentication wrapper
//
// On a 401, tries to refresh the access token once (deduping concurrent 401s
// via a single shared promise), then retries the original request. If refresh
// fails, credentials are cleared and the auth state is reset.
// ---------------------------------------------------------------------------
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { access?: string };
    if (data.access) {
      localStorage.setItem("token", data.access);
      return data.access;
    }
    return null;
  } catch {
    return null;
  }
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Dedupe: if a refresh is already in flight, await the same promise.
    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });

    const newToken = await refreshPromise;

    if (newToken) {
      // Retry the original request with the refreshed token.
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Refresh failed — clear credentials and reset auth state.
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user_id");
      }
      api.dispatch(logout());
    }
  }

  return result;
};

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------
const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "auth",
    "user",
    "notification",
    "unreadCount",
    "notificationSettings",
    "settings",
  ],
  endpoints: () => ({}),
});

export default baseApi;
