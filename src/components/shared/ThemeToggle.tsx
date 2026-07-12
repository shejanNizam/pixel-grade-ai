"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="rounded-full animate-pulse" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`cursor-pointer p-2`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <span className="text-sm">
          <FaSun size={20} color="#2563EB" />
        </span>
      ) : (
        <span className="text-sm">
          <FaMoon size={20} color="#2563EB" />
        </span>
      )}
    </button>
  );
}
