"use client";

import { useEffect } from "react";

// Global error boundary — catches errors in the root layout itself.
// Because it replaces the root layout when active, it must render its own
// <html> and <body> tags. Only shown in production.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "28rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
              Something went wrong
            </h1>
            <p style={{ marginTop: "1rem", color: "#4b5563" }}>
              A critical error occurred. Please try again.
            </p>
            <button
              onClick={() => reset()}
              style={{
                marginTop: "2rem",
                height: "3rem",
                padding: "0 1.75rem",
                borderRadius: "9999px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
