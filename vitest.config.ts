import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    // Mirror the "@/*" -> "src/*" path alias from tsconfig.json.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
