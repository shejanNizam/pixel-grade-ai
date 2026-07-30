// ---------------------------------------------------------------------------
// Auth token strategy — three layers, kept in sync at login/logout:
//
//   1. localStorage "accessToken" → read by src/redux/api/baseApi.ts to set
//      the Authorization header (with automatic refresh on 401/403).
//   2. httpOnly "refreshToken" cookie → set by the BACKEND at login; the
//      browser carries it automatically, this file never touches it.
//   3. These readable cookies → consumed by src/middleware.ts so protected
//      routes can be gated during SSR, before any page renders:
//        auth-token — presence gates /user-dashboard and /admin
//        auth-role  — gates /admin to admin/super_admin
//
// The role cookie is a ROUTING hint, not a security boundary — every admin
// endpoint re-checks the JWT's role server-side. Forging the cookie changes
// which shell renders, not what data is obtainable.
// ---------------------------------------------------------------------------

import type { UserRole } from "@/types/auth";

const COOKIE_BASE = "path=/; max-age=" + 60 * 60 * 24 * 7 + "; SameSite=Lax";
const secureSuffix = process.env.NODE_ENV === "production" ? "; Secure" : "";

export const setAuthCookie = (token: string, role: UserRole) => {
  document.cookie = `auth-token=${token}; ${COOKIE_BASE}${secureSuffix}`;
  document.cookie = `auth-role=${role}; ${COOKIE_BASE}${secureSuffix}`;
};

export const clearAuthCookie = () => {
  document.cookie = "auth-token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "auth-role=; path=/; max-age=0; SameSite=Lax";
};
