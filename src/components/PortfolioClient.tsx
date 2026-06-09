"use client";

import { useState } from "react";
import type { PortfolioData } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { LOCALES, t, getDir, sectionLabel } from "@/lib/i18n";
import PortfolioView from "@/components/PortfolioView";

interface PortfolioClientProps {
  data: PortfolioData;
  slug: string;
}

export default function PortfolioClient({ data, slug }: PortfolioClientProps) {
  const [locale, setLocale] = useState<Locale>(data.theme.defaultLocale || "en");

  return (
    <div dir={getDir(locale)}>
      <div
        className="sticky top-0 z-50 flex items-center justify-end gap-2 px-4 py-2 border-b backdrop-blur-md"
        style={{
          backgroundColor: `${data.theme.colors.background}ee`,
          borderColor: `${data.theme.colors.textMuted}20`,
        }}
      >
        <span className="text-xs" style={{ color: data.theme.colors.textMuted }}>
          {t(locale, "pf.lang")}:
        </span>
        {LOCALES.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLocale(l.id)}
            className="px-3 py-1 text-xs rounded-lg transition-colors"
            style={{
              backgroundColor: locale === l.id ? data.theme.colors.primary : "transparent",
              color: locale === l.id ? data.theme.colors.background : data.theme.colors.textMuted,
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
      <PortfolioView data={data} slug={slug} locale={locale} sectionLabel={sectionLabel} t={(k) => t(locale, k)} />
    </div>
  );
}
