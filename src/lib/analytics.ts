export interface PortfolioAnalytics {
  visitors: number;
  cvDownloads: number;
  dailyVisitors: { date: string; count: number }[];
  dailyDownloads: { date: string; count: number }[];
}

export const EMPTY_ANALYTICS: PortfolioAnalytics = {
  visitors: 0,
  cvDownloads: 0,
  dailyVisitors: [],
  dailyDownloads: [],
};

export function parseAnalytics(raw?: string | null): PortfolioAnalytics {
  if (!raw?.trim()) return { ...EMPTY_ANALYTICS };
  try {
    const parsed = JSON.parse(raw) as Partial<PortfolioAnalytics>;
    return {
      visitors: parsed.visitors ?? 0,
      cvDownloads: parsed.cvDownloads ?? 0,
      dailyVisitors: parsed.dailyVisitors ?? [],
      dailyDownloads: parsed.dailyDownloads ?? [],
    };
  } catch {
    return { ...EMPTY_ANALYTICS };
  }
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function bumpDaily(
  list: { date: string; count: number }[],
  date: string
): { date: string; count: number }[] {
  const copy = [...list];
  const idx = copy.findIndex((d) => d.date === date);
  if (idx >= 0) copy[idx] = { ...copy[idx], count: copy[idx].count + 1 };
  else copy.push({ date, count: 1 });
  return copy.slice(-14);
}

export function incrementVisitors(analytics: PortfolioAnalytics): PortfolioAnalytics {
  const date = todayKey();
  return {
    ...analytics,
    visitors: analytics.visitors + 1,
    dailyVisitors: bumpDaily(analytics.dailyVisitors, date),
  };
}

export function incrementCvDownloads(analytics: PortfolioAnalytics): PortfolioAnalytics {
  const date = todayKey();
  return {
    ...analytics,
    cvDownloads: analytics.cvDownloads + 1,
    dailyDownloads: bumpDaily(analytics.dailyDownloads, date),
  };
}
