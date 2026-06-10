"use client";

import type { PortfolioTheme } from "@/lib/portfolio-theme";
import { THEME_PRESETS } from "@/lib/theme-presets";
import { PanelSection } from "./EditorShared";

const DARK_IDS = new Set([
  "violet-pro", "ocean-minimal", "forest-creative", "sunset-bold", "mono-dev", "dark-bold",
  "midnight-glass", "cyber-neon", "deep-ocean", "carbon-elite", "aurora-dark",
]);

function ThemeButton({
  preset,
  active,
  onSelect,
}: {
  preset: (typeof THEME_PRESETS)[0];
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left p-3 rounded-xl border transition-colors"
      style={
        active
          ? { borderColor: "var(--app-primary)", background: "var(--app-primary-muted)" }
          : { borderColor: "var(--app-border)", background: "var(--app-input-bg)" }
      }
    >
      <div className="flex items-center gap-3">
        <div className="flex gap-1 shrink-0">
          <span className="w-5 h-5 rounded-md border" style={{ background: preset.preview.background, borderColor: "var(--app-border)" }} />
          <span className="w-5 h-5 rounded-md" style={{ background: preset.preview.primary }} />
          <span className="w-5 h-5 rounded-md" style={{ background: preset.preview.accent }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium flex items-center gap-2" style={{ color: "var(--app-text)" }}>
            {preset.name}
            {active && (
              <span className="text-[10px] px-1.5 py-0.5 rounded text-white" style={{ background: "var(--app-primary)" }}>
                Active
              </span>
            )}
          </p>
          <p className="text-xs truncate" style={{ color: "var(--app-text-muted)" }}>{preset.description}</p>
        </div>
      </div>
    </button>
  );
}

export default function ThemesPanel({ theme, updateTheme }: { theme: PortfolioTheme; updateTheme: (theme: PortfolioTheme) => void }) {
  const dark = THEME_PRESETS.filter((p) => DARK_IDS.has(p.id));
  const light = THEME_PRESETS.filter((p) => !DARK_IDS.has(p.id));

  return (
    <div className="space-y-5">
      <p className="text-xs" style={{ color: "var(--app-text-muted)" }}>
        Apply a complete theme — colors, hero, sections, footer, and widgets all at once.
      </p>

      <PanelSection title="Dark themes">
        <div className="space-y-2">
          {dark.map((preset) => (
            <ThemeButton
              key={preset.id}
              preset={preset}
              active={theme.activeThemeId === preset.id}
              onSelect={() => updateTheme({ ...preset.theme, activeThemeId: preset.id })}
            />
          ))}
        </div>
      </PanelSection>

      <PanelSection title="Light themes">
        <div className="space-y-2">
          {light.map((preset) => (
            <ThemeButton
              key={preset.id}
              preset={preset}
              active={theme.activeThemeId === preset.id}
              onSelect={() => updateTheme({ ...preset.theme, activeThemeId: preset.id })}
            />
          ))}
        </div>
      </PanelSection>
    </div>
  );
}
