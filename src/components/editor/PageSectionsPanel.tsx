"use client";

import type { PortfolioPage } from "@/lib/platform-data";
import type { PortfolioTheme } from "@/lib/portfolio-theme";
import { getInstanceLabel } from "@/lib/portfolio-theme";
import { PanelSection } from "./EditorShared";

export default function PageSectionsPanel({
  page,
  theme,
  onChange,
  label,
  hint,
}: {
  page: PortfolioPage;
  theme: PortfolioTheme;
  onChange: (sectionOrder: string[]) => void;
  label: string;
  hint: string;
}) {
  const instances = theme.sections.order;

  function toggleSection(instanceId: string, instanceType: string) {
    const active =
      page.sectionOrder.includes(instanceId) || page.sectionOrder.includes(instanceType);
    const order = active
      ? page.sectionOrder.filter((entry) => entry !== instanceId && entry !== instanceType)
      : [...page.sectionOrder, instanceId];
    onChange(order);
  }

  function moveSection(instanceId: string, dir: -1 | 1) {
    const order = [...page.sectionOrder];
    const idx = order.indexOf(instanceId);
    if (idx < 0) {
      const byType = instances.find((i) => i.type === instanceId);
      if (!byType) return;
      return moveSection(byType.id, dir);
    }
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= order.length) return;
    [order[idx], order[newIdx]] = [order[newIdx], order[idx]];
    onChange(order);
  }

  const orderedOnPage = page.sectionOrder
    .map((entry) => instances.find((i) => i.id === entry || i.type === entry))
    .filter(Boolean);

  return (
    <PanelSection title={label}>
      <p className="text-xs mb-3" style={{ color: "var(--app-text-muted)" }}>
        {hint}
      </p>

      {orderedOnPage.length > 0 && (
        <div className="space-y-1.5 mb-4">
          {orderedOnPage.map((instance) => {
            if (!instance) return null;
            const idx = page.sectionOrder.indexOf(instance.id);
            const orderIdx = idx >= 0 ? idx : page.sectionOrder.indexOf(instance.type);
            return (
              <div
                key={instance.id}
                className="flex items-center gap-2 p-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--app-border)", background: "var(--app-input-bg)" }}
              >
                <span className="flex-1 min-w-0 truncate" style={{ color: "var(--app-text)" }}>
                  {getInstanceLabel(instance, instances, theme.sections.titles)}
                </span>
                <button
                  type="button"
                  disabled={orderIdx <= 0}
                  onClick={() => moveSection(instance.id, -1)}
                  className="text-xs px-1.5 disabled:opacity-30"
                  style={{ color: "var(--app-text-muted)" }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={orderIdx >= page.sectionOrder.length - 1}
                  onClick={() => moveSection(instance.id, 1)}
                  className="text-xs px-1.5 disabled:opacity-30"
                  style={{ color: "var(--app-text-muted)" }}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => toggleSection(instance.id, instance.type)}
                  className="text-xs px-2 py-0.5 rounded text-red-400"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {instances.map((instance) => {
          const active =
            page.sectionOrder.includes(instance.id) || page.sectionOrder.includes(instance.type);
          if (active) return null;
          return (
            <button
              key={instance.id}
              type="button"
              onClick={() => toggleSection(instance.id, instance.type)}
              className="text-xs px-2 py-1 rounded-lg border transition-colors"
              style={{ borderColor: "var(--app-border)", color: "var(--app-text-muted)" }}
            >
              + {getInstanceLabel(instance, instances, theme.sections.titles)}
            </button>
          );
        })}
      </div>
    </PanelSection>
  );
}
