// ---------------------------------------------------------------------------
// Validated public environment variables.
//
// Reading env vars through this module (instead of `process.env.X` scattered
// around the code) gives one place to document and validate them. Missing
// required vars fail loudly in development instead of silently producing
// broken relative-URL requests.
//
// NOTE: only `NEXT_PUBLIC_*` vars are readable in the browser. They are inlined
// at build time, so they must be referenced as full `process.env.NEXT_PUBLIC_*`
// literals below (Next.js does not support dynamic access for these).
// ---------------------------------------------------------------------------

function required(value: string | undefined, name: string): string {
  if (!value) {
    // In production a misconfigured URL should hard-fail the build/boot.
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    // In development, warn but keep going so the UI still renders.
    console.warn(
      `[env] ${name} is not set. Add it to .env.local — see .env.example.`,
    );
  }
  return value ?? "";
}

export const env = {
  /** Base URL of the backend API. */
  API_URL: required(process.env.NEXT_PUBLIC_API_URL, "NEXT_PUBLIC_API_URL"),
  /** Base URL images/uploads are served from (often same host as the API). */
  IMAGE_URL: process.env.NEXT_PUBLIC_IMAGE_URL ?? "",
  /** Google OAuth client id — only needed if you wire up Google Sign-In. */
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
} as const;
