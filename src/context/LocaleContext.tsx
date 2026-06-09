"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { t, getDir } from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  defaultLocale = "en",
}: {
  children: ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboard-locale") as Locale | null;
      if (saved === "en" || saved === "ar") return saved;
    }
    return defaultLocale;
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("dashboard-locale", l);
  }, []);

  const translate = useCallback((key: string) => t(locale, key), [locale]);

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, t: translate, dir: getDir(locale) }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
