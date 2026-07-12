/**
 * Cookie + localStorage key for the persisted theme preference.
 *
 * Lives outside the "use client" provider so the server layout can import the
 * literal string (exports of a client module become client references).
 *
 * Bump the suffix to invalidate every saved preference — done once already
 * when the default flipped from light to dark, so visitors who had `light`
 * persisted from the old default don't stay stuck on it.
 */
export const THEME_KEY = "pg-theme";
