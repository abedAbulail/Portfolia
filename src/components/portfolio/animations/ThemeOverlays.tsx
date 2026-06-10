"use client";

import type { ThemeAnimationConfig } from "@/lib/theme-animation-config";
import type { PortfolioTheme } from "@/lib/portfolio-theme";

export function ThemeOverlays({ config, theme }: { config: ThemeAnimationConfig; theme: PortfolioTheme }) {
  return (
    <>
      {config.overlay === "scanline" && <div className="pf-overlay pf-scanline pointer-events-none fixed inset-0 z-[60]" aria-hidden />}
      {config.overlay === "grid" && (
        <div
          className="pf-overlay pf-grid-scroll pointer-events-none fixed inset-0 z-0"
          style={{ "--pf-grid-color": `${theme.colors.primary}0d` } as React.CSSProperties}
          aria-hidden
        />
      )}
      {config.overlay === "carbon" && <div className="pf-overlay pf-carbon pointer-events-none fixed inset-0 z-0 opacity-30" aria-hidden />}
      {config.overlay === "paper" && <div className="pf-overlay pf-paper pointer-events-none fixed inset-0 z-0 opacity-40" aria-hidden />}
      {config.overlay === "dots" && (
        <div
          className="pf-overlay pf-dots pointer-events-none fixed inset-0 z-0"
          style={{ "--pf-dot-color": `${theme.colors.primary}25` } as React.CSSProperties}
          aria-hidden
        />
      )}
      {config.overlay === "petals" && <PetalsOverlay color={theme.colors.primary} />}
      {config.overlay === "bubbles" && <BubblesOverlay color={theme.colors.primary} />}
    </>
  );
}

function PetalsOverlay({ color }: { color: string }) {
  return (
    <div className="pf-petals pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="pf-petal"
          style={{
            left: `${10 + i * 11}%`,
            animationDelay: `${i * 1.2}s`,
            animationDuration: `${8 + (i % 3) * 2}s`,
            background: color,
          }}
        />
      ))}
    </div>
  );
}

function BubblesOverlay({ color }: { color: string }) {
  return (
    <div className="pf-bubbles pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="pf-bubble"
          style={{
            left: `${8 + i * 9}%`,
            width: `${6 + (i % 4) * 4}px`,
            height: `${6 + (i % 4) * 4}px`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${6 + (i % 3) * 2}s`,
            borderColor: `${color}40`,
          }}
        />
      ))}
    </div>
  );
}
