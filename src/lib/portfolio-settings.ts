import type { PortfolioTheme } from "./portfolio-theme";
import { parseThemeSettings, DEFAULT_THEME } from "./portfolio-theme";
import { parsePlatformData, DEFAULT_PLATFORM, type PlatformData } from "./platform-data";

export interface PortfolioSettings {
  theme: PortfolioTheme;
  platform: PlatformData;
}

export function parsePortfolioSettings(raw?: string | null): PortfolioSettings {
  if (!raw?.trim()) {
    return { theme: structuredClone(DEFAULT_THEME), platform: structuredClone(DEFAULT_PLATFORM) };
  }
  try {
    const parsed = JSON.parse(raw) as Partial<PortfolioSettings & PortfolioTheme>;
    if (parsed.theme || parsed.platform) {
      return {
        theme: parseThemeSettings(JSON.stringify(parsed.theme ?? parsed)),
        platform: parsePlatformData(parsed.platform),
      };
    }
    return {
      theme: parseThemeSettings(raw),
      platform: parsePlatformData({ onboarding: { complete: true, step: 6 } }),
    };
  } catch {
    return { theme: structuredClone(DEFAULT_THEME), platform: structuredClone(DEFAULT_PLATFORM) };
  }
}

export function serializePortfolioSettings(settings: PortfolioSettings): string {
  return JSON.stringify(settings);
}
