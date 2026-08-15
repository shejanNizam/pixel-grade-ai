"use client";

import { BASE_URL } from "@/redux/api/baseApi";
import { Button } from "antd";
import { useState } from "react";

// ---------------------------------------------------------------------------
// "Continue with Google" — the entry point to the backend's OAuth flow.
//
// This MUST be a full-page navigation, not a fetch. The whole point of the
// redirect flow is that the browser visits Google, then the backend callback,
// which sets the httpOnly auth cookies on a top-level response. An XHR cannot
// follow that chain, and cookies set on a cross-origin XHR redirect would be
// dropped anyway.
//
// One button serves both sign-up and sign-in because Google's flow cannot tell
// them apart — the backend decides: an existing google identity logs in, a
// matching email links to that account, and anything else creates one (see
// config/passport.ts). That is what makes it work for new AND returning users.
// ---------------------------------------------------------------------------

/**
 * Master switch for "Continue with Google" on /login and /signup.
 *
 * Hidden at the client's request on 2026-08-15 — NOT because anything is
 * broken. The whole flow is wired and verified end to end: the passport
 * strategy, the /oauth/callback token bridge, and the production redirect URI.
 * Set this to `true` to bring it back on both pages; nothing else needs to
 * change.
 *
 * Typed `boolean` rather than inferred as the literal `false` so the pages
 * behind it stay type-checked instead of being narrowed into dead branches.
 */
export const SHOW_GOOGLE_SIGN_IN: boolean = false;
// export const SHOW_GOOGLE_SIGN_IN: boolean = true;

interface GoogleAuthButtonProps {
  /** Where to land after a successful login. Defaults to the `?next=` the
   *  middleware added when it bounced the user here; failing that, the role's
   *  home, which /oauth/callback resolves once it knows who signed in. */
  next?: string | null;
  /** Verb shown on the button. The flow is identical either way. */
  label?: string;
}

/** Google's brand mark. Inlined rather than fetched — the auth pages must
 *  render before any network call, and Google's brand guidelines require the
 *  official four-colour glyph on a plain surface. */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden focusable="false">
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
    />
    <path
      fill="#FBBC05"
      d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
    />
  </svg>
);

export default function GoogleAuthButton({
  next,
  label = "Continue with Google",
}: GoogleAuthButtonProps) {
  // Held true for the lifetime of the click: the page is navigating away, so
  // there is no success path that would ever clear it. Without this the button
  // stays live during the redirect and a double-click starts two OAuth flows.
  const [redirecting, setRedirecting] = useState(false);

  const start = () => {
    setRedirecting(true);

    // Read at click time rather than render time: this keeps the component out
    // of useSearchParams, which would force a Suspense boundary onto every auth
    // page that hosts the button.
    const destination =
      next ?? new URLSearchParams(window.location.search).get("next");

    // Round-trips through Google as the OAuth `state` and comes back to the
    // backend, which appends it to FRONTEND_PUBLIC_URL. `//` is excluded so a
    // protocol-relative path cannot ride the return trip off-site.
    const target =
      destination?.startsWith("/") && !destination.startsWith("//")
        ? `/oauth/callback?next=${encodeURIComponent(destination)}`
        : "/oauth/callback";

    window.location.href = `${BASE_URL}/auth/google?redirect=${encodeURIComponent(target)}`;
  };

  return (
    <Button
      size="large"
      block
      icon={<GoogleIcon />}
      loading={redirecting}
      onClick={start}
      className="h-13! items-center! justify-center! gap-1! rounded-full! border-zinc-300! bg-white! text-[15px]! font-medium! text-zinc-800! shadow-none! hover:border-zinc-400! hover:bg-zinc-50! dark:border-zinc-700! dark:bg-zinc-900! dark:text-zinc-100! dark:hover:border-zinc-600! dark:hover:bg-zinc-800!"
    >
      {redirecting ? "Redirecting…" : label}
    </Button>
  );
}

/** "or" rule between the Google button and the email/password form. */
export function AuthDivider({ text = "or" }: { text?: string }) {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{text}</span>
      <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}
