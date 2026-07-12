"use client";

import { THEME_KEY } from "@/config/theme";
import { darkTheme, lightTheme } from "@/utils/antTheme";
import { App, ConfigProvider, theme } from "antd";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ThemeName = "light" | "dark";

/** Mirror the active theme into a cookie so the server (root layout +
 *  AntdRegistry) can render the matching theme on the next request — this is
 *  what prevents the flash of light inputs on reload in dark mode.
 *
 *  The key is versioned (`pg-theme`, not `theme`): while light was still the
 *  default, visitors had `light` persisted to their cookie and localStorage,
 *  and that stale value would otherwise outlive the switch to a dark default. */
function ThemeCookieSync() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    if (resolvedTheme) {
      document.cookie = `${THEME_KEY}=${resolvedTheme}; path=/; max-age=31536000; samesite=lax`;
    }
  }, [resolvedTheme]);
  return null;
}

function AntdConfigProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: ThemeName;
}) {
  const { resolvedTheme } = useTheme();
  // Seed from the server-resolved theme so SSR/first client render match
  // (no hydration mismatch, no flash), then keep in sync with next-themes.
  const [isDark, setIsDark] = useState<boolean>(initialTheme === "dark");

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  return (
    <ConfigProvider
      theme={{
        ...(isDark ? darkTheme : lightTheme),
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {/* `App` provides context-aware message/modal/notification (App.useApp).
          v6's cssVar App needs a real element, so we render its default <div>. */}
      <App>{children}</App>
    </ConfigProvider>
  );
}

export default function ThemeProvider({
  children,
  initialTheme = "dark",
}: {
  children: React.ReactNode;
  initialTheme?: ThemeName;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={initialTheme}
      enableSystem={false}
      storageKey={THEME_KEY}
    >
      <ThemeCookieSync />
      <AntdConfigProvider initialTheme={initialTheme}>
        {children}
      </AntdConfigProvider>
    </NextThemesProvider>
  );
}
