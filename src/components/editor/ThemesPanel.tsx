"use client";

import type { PortfolioTheme } from "@/lib/portfolio-theme";
import { THEME_PRESETS } from "@/lib/theme-presets";
import { PanelSection } from "./EditorShared";

interface ThemesPanelProps {
  theme: PortfolioTheme;
  updateTheme: (theme: PortfolioTheme) => void;
}

export default function ThemesPanel({ theme, updateTheme }: ThemesPanelProps) {
  return (
    <PanelSection title="Default themes">
      <p className="text-xs mb-3" style={{ color: "var(--app-text-muted)" }}>
        Apply a complete theme — colors, layout, sections, and styling all at once.
      </p>
      <div className="space-y-2">
        {THEME_PRESETS.map((preset) => {
          const active = theme.activeThemeId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => updateTheme({ ...preset.theme, activeThemeId: preset.id })}
              className="w-full text-left p-3 rounded-xl border transition-colors"
              style={
                active
                  ? {
                      borderColor: "var(--app-primary)",
                      background: "var(--app-primary-muted)",
                    }
                  : {
                      borderColor: "var(--app-border)",
                      background: "var(--app-input-bg)",
                    }
              }
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1 shrink-0">
                  <span
                    className="w-5 h-5 rounded-md border"
                    style={{
                      background: preset.preview.background,
                      borderColor: "var(--app-border)",
                    }}
                  />
                  <span className="w-5 h-5 rounded-md" style={{ background: preset.preview.primary }} />
                  <span className="w-5 h-5 rounded-md" style={{ background: preset.preview.accent }} />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm font-medium flex items-center gap-2"
                    style={{ color: "var(--app-text)" }}
                  >
                    {preset.name}
                    {active && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded text-white"
                        style={{ background: "var(--app-primary)" }}
                      >
                        Active
                      </span>
                    )}
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--app-text-muted)" }}>
                    {preset.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </PanelSection>
  );
}
