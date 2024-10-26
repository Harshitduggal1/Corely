"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDarkMode =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="flex items-center gap-2">
      {isDarkMode ? (
        <Moon
          className={`h-5 w-5 ${
            isDarkMode ? "text-primary" : "text-primary/50"
          }`}
          onClick={() => setTheme("light")}
        />
      ) : (
        <Sun
          className={`h-5 w-5 ${
            isDarkMode ? "text-primary/50" : "text-primary"
          }`}
          onClick={() => setTheme("dark")}
        />
      )}
    </div>
  );
}
