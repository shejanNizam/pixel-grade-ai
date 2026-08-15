"use client";

import AuthHeader, { authAccentLink } from "@/components/auth/AuthHeader";
import { ACCESS_TOKEN_KEY, BASE_URL } from "@/redux/api/baseApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import type { TResponse, TUser } from "@/types/auth";
import { setAuthCookie } from "@/utils/cookieUtils";
import { Spin } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Where Google sign-in lands.
//
// WHY THIS PAGE EXISTS. The backend finishes OAuth by setting httpOnly
// `accessToken`/`refreshToken` cookies and redirecting here. But the app's auth
// state lives in three other places (see utils/cookieUtils.ts):
//
//   1. localStorage "accessToken" — baseApi's Authorization header
//   2. readable "auth-token"/"auth-role" cookies — middleware.ts SSR gating
//   3. the Redux auth slice — what components read synchronously
//
// An httpOnly cookie is, by design, invisible to all three. Without this bridge
// a successful Google login lands on a site that still believes nobody is
// signed in, and middleware bounces the user straight back to /login.
//
// So: trade the httpOnly refresh cookie for a readable access token, fetch the
// user it belongs to, and populate all three layers exactly as the password
// login does. The token never travels in the URL — putting it in the query
// string would leak it into browser history, referrer headers, and server logs.
// ---------------------------------------------------------------------------

const roleHome = (role: TUser["role"]) =>
  role === "admin" || role === "super_admin" ? "/admin" : "/user-dashboard";

function OAuthCallback() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  // React 18 StrictMode mounts effects twice in development. Two concurrent
  // refresh calls would race, and whichever token lost would already be stored.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const finish = async () => {
      try {
        // The refresh token is an httpOnly cookie the OAuth callback just set,
        // so this needs no body — only `credentials: "include"`.
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          throw new Error(
            "We couldn't complete your Google sign-in. Please try again.",
          );
        }

        const refreshBody = (await refreshRes.json()) as TResponse<{
          accessToken?: string;
        }>;
        const accessToken = refreshBody.data?.accessToken;

        if (!accessToken) {
          throw new Error("Google sign-in did not return a session.");
        }

        // Stored before /user/me so the request carries it — and so a failure
        // below still leaves a usable session rather than a half-signed-in one.
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

        const meRes = await fetch(`${BASE_URL}/user/me`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!meRes.ok) {
          throw new Error("Signed in, but your profile could not be loaded.");
        }

        const user = ((await meRes.json()) as TResponse<TUser>).data;

        setAuthCookie(accessToken, user.role);
        dispatch(setCredentials({ token: accessToken, user }));

        // `next` is whatever the middleware was aiming at before it bounced the
        // user to /login. Internal paths only — an absolute URL here would turn
        // our own OAuth return into an open redirect.
        const next = searchParams.get("next");
        const destination =
          next?.startsWith("/") && !next.startsWith("//")
            ? next
            : roleHome(user.role);

        // replace, not push: the back button should not return to a callback
        // whose one-time cookie exchange has already been spent.
        router.replace(destination);
      } catch (err) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setError(
          err instanceof Error
            ? err.message
            : "We couldn't complete your Google sign-in.",
        );
      }
    };

    void finish();
  }, [dispatch, router, searchParams]);

  if (error) {
    return (
      <>
        <AuthHeader title="Sign-in failed" subtitle={error} />
        <p className="text-center text-sm text-zinc-700 dark:text-zinc-200">
          <Link href="/login" className={authAccentLink}>
            Back to sign in
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <AuthHeader
        title="Signing you in"
        subtitle="Finishing up with Google — this only takes a moment."
      />
      <div className="flex justify-center py-6">
        <Spin size="large" />
      </div>
    </>
  );
}

export default function OAuthCallbackPage() {
  // useSearchParams needs a Suspense boundary or the whole route opts out of
  // static rendering at build time.
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-6">
          <Spin size="large" />
        </div>
      }
    >
      <OAuthCallback />
    </Suspense>
  );
}
