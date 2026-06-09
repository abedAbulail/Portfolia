"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

type AppTheme = "light" | "dark";

interface AppThemeContextValue {
  theme: AppTheme;
  toggleTheme: () => void;
  setTheme: (t: AppTheme) => void;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("app-theme") as AppTheme | null;
    if (saved === "light" || saved === "dark") {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const setTheme = useCallback((t: AppTheme) => {
    setThemeState(t);
    localStorage.setItem("app-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("app-theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);

  return (
    <AppThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within AppThemeProvider");
  return ctx;
}
