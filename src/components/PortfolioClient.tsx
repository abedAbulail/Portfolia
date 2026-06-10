"use client";

import type { PortfolioData } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { t, getDir, sectionLabel } from "@/lib/i18n";
import PortfolioView from "@/components/PortfolioView";

interface PortfolioClientProps {
  data: PortfolioData;
  slug: string;
  pageSlug?: string;
  sectionOrder?: string[];
}

export default function PortfolioClient({ data, slug, pageSlug = "", sectionOrder }: PortfolioClientProps) {
  const locale: Locale = data.theme.defaultLocale || "en";

  return (
    <div dir={getDir(locale)}>
      <PortfolioView
        data={data}
        slug={slug}
        locale={locale}
        sectionLabel={sectionLabel}
        t={(k) => t(locale, k)}
        pageSlug={pageSlug}
        sectionOrder={sectionOrder}
      />
    </div>
  );
}
