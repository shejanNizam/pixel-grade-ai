// ---------------------------------------------------------------------------
// Auth token strategy — two layers, kept in sync:
//
//   1. localStorage ("token"/"refresh") → read in src/redux/api/baseApi.ts to
//      set the Authorization header on client-side API calls (with 401 refresh).
//   2. This "auth-token" cookie → readable on the server by src/middleware.ts
//      so routes can be gated during SSR before the page renders.
//
// On login set BOTH (localStorage + setAuthCookie); on logout clear BOTH.
// For stronger security, move to an httpOnly cookie set by your backend and
// drop the localStorage layer.
// ---------------------------------------------------------------------------

// Sets auth cookie so middleware can read it.
export const setAuthCookie = (token: string) => {
  const isProduction = process.env.NODE_ENV === "production";
  document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${isProduction ? "; Secure" : ""}`;
};

export const clearAuthCookie = () => {
  document.cookie = "auth-token=; path=/; max-age=0; SameSite=Lax";
};
