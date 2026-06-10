export type AnimationLevel = "subtle" | "medium" | "high";

export interface ThemeAnimationConfig {
  level: AnimationLevel;
  overlay?: "scanline" | "grid" | "carbon" | "paper" | "dots" | "petals" | "bubbles";
  heroGlow?: "violet-pulse" | "neon" | "blob" | "gradient-shift" | "ice-top" | "sunset";
  heroLine?: "gold" | "blue";
  typewriterTitle?: boolean;
  photoShimmer?: boolean;
  glitchName?: boolean;
  splitEnter?: boolean;
  gradientText?: boolean;
  ctaPulse?: boolean;
  neonText?: boolean;
  goldShimmer?: boolean;
}

export const THEME_ANIMATION_CONFIG: Record<string, ThemeAnimationConfig> = {
  "violet-pro": { level: "subtle", heroGlow: "violet-pulse" },
  "ocean-minimal": { level: "medium", photoShimmer: true, splitEnter: true },
  "forest-creative": { level: "medium", overlay: "dots" },
  "sunset-bold": { level: "medium", heroGlow: "sunset", ctaPulse: true },
  "mono-dev": { level: "medium", typewriterTitle: true },
  "dark-bold": { level: "high", heroGlow: "blob", gradientText: true, ctaPulse: true },
  "midnight-glass": { level: "high", heroGlow: "violet-pulse" },
  "cyber-neon": { level: "high", overlay: "grid", neonText: true, glitchName: true },
  "deep-ocean": { level: "high", overlay: "bubbles" },
  "carbon-elite": { level: "subtle", overlay: "carbon", heroLine: "gold", goldShimmer: true },
  "aurora-dark": { level: "high", gradientText: true },
  "light-clean": { level: "subtle" },
  "corporate-pro": { level: "subtle", heroLine: "blue" },
  "ivory-luxe": { level: "medium", heroLine: "gold", goldShimmer: true },
  "arctic-clean": { level: "subtle", heroGlow: "ice-top" },
  "paper-ink": { level: "subtle", overlay: "paper" },
  "blossom": { level: "high", overlay: "petals", ctaPulse: true },
  "sage-studio": { level: "medium", overlay: "dots" },
};

export function getThemeAnimationConfig(themeId?: string): ThemeAnimationConfig {
  return THEME_ANIMATION_CONFIG[themeId || "violet-pro"] || { level: "subtle" };
}
