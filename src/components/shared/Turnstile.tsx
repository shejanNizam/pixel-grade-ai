"use client";

// ---------------------------------------------------------------------------
// Cloudflare Turnstile widget.
//
// Bot protection on support ticket submission (client, 2026-08-10). Rendered
// only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set — without a key the component
// renders nothing and immediately reports a null token, so the form still
// works in environments where the keys haven't been provisioned. The server
// mirrors that: it skips verification unless TURNSTILE_SECRET_KEY is set.
//
// The two keys are a pair. Setting one without the other means either every
// submission is rejected (secret only) or the challenge is decorative (site key
// only).
// ---------------------------------------------------------------------------

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

/** Whether bot protection is configured on this build. */
export const captchaEnabled = Boolean(SITE_KEY);

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** Loads the Turnstile script once per page, shared across mounts. */
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    if (window.turnstile) return resolve();

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

interface TurnstileProps {
  /** Fires with the solution, or null when it expires, errors, or is unset. */
  onToken: (token: string | null) => void;
}

export interface TurnstileHandle {
  reset: () => void;
}

export default function Turnstile({ onToken }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // `onToken` is usually an inline arrow, so holding it in a ref keeps a
  // re-render from tearing down and re-rendering the widget.
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!SITE_KEY) {
      onTokenRef.current(null);
      return;
    }

    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme: "dark",
          callback: (token) => onTokenRef.current(token),
          // A solved challenge goes stale after a few minutes. Clearing the
          // token makes the submit button disable itself rather than letting
          // the user submit something the server will reject.
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
        });
      })
      .catch(() => onTokenRef.current(null));

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} className="mt-1" />;
}
