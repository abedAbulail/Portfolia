"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { AppIcon } from "@/components/icons/AppIcons";
import type { PortfolioPage } from "@/lib/platform-data";
import type { PortfolioTheme, SectionInstance } from "@/lib/portfolio-theme";
import { getInstanceLabel, parseThemeSettings } from "@/lib/portfolio-theme";

export default function PagesManagerClient() {
  const { t, dir } = useLocale();
  const [pages, setPages] = useState<PortfolioPage[]>([]);
  const [sectionInstances, setSectionInstances] = useState<SectionInstance[]>([]);
  const [sectionTitles, setSectionTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/platform").then((r) => r.json()),
      fetch("/api/dashboard/theme").then((r) => r.json()),
    ])
      .then(([platformRes, themeRes]) => {
        setPages(platformRes.platform?.pages || []);
        const theme: PortfolioTheme = parseThemeSettings(JSON.stringify(themeRes.theme ?? themeRes));
        setSectionInstances(theme.sections.order);
        setSectionTitles(theme.sections.titles);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (next: PortfolioPage[]) => {
    setSaving(true);
    await fetch("/api/dashboard/platform", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pages: next }),
    });
    setPages(next);
    setSaving(false);
  }, []);

  function addPage() {
    const id = `page-${Date.now()}`;
    const next = [
      ...pages,
      {
        id,
        slug: `page-${pages.length}`,
        title: "New Page",
        visible: true,
        sectionOrder: sectionInstances[0] ? [sectionInstances[0].id] : ["about"],
        colorMode: "inherit" as const,
      },
    ];
    save(next);
  }

  function updatePage(id: string, patch: Partial<PortfolioPage>) {
    save(pages.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function removePage(id: string) {
    const page = pages.find((p) => p.id === id);
    if (page?.isHome) return;
    save(pages.filter((p) => p.id !== id));
  }

  function onDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const next = [...pages];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    setDragIdx(null);
    save(next);
  }

  if (loading) return <p className="text-app-muted">{t("pages.loading")}</p>;

  return (
    <div dir={dir} className="max-w-3xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">{t("pages.title")}</h1>
          <p className="text-sm text-app-muted">{t("pages.subtitle")}</p>
        </div>
        <button type="button" onClick={addPage} className="btn-primary text-sm">
          + {t("pages.add")}
        </button>
      </div>

      <div className="space-y-3">
        {pages.map((page, idx) => (
          <div
            key={page.id}
            draggable
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(idx)}
            className="card p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <AppIcon name="arrow-up-down" size={16} className="text-app-muted cursor-grab" />
              <input
                value={page.title}
                onChange={(e) => updatePage(page.id, { title: e.target.value })}
                className="input-field flex-1 !py-2"
              />
              <label className="flex items-center gap-2 text-sm text-app-muted shrink-0">
                <input
                  type="checkbox"
                  checked={page.visible}
                  onChange={(e) => updatePage(page.id, { visible: e.target.checked })}
                />
                {t("pages.visible")}
              </label>
            </div>
            {!page.isHome && (
              <div className="flex gap-2">
                <input
                  value={page.slug}
                  onChange={(e) =>
                    updatePage(page.id, { slug: e.target.value.replace(/[^a-z0-9-]/gi, "-").toLowerCase() })
                  }
                  placeholder="slug"
                  className="input-field flex-1 !py-2 text-sm"
                />
                <button type="button" onClick={() => removePage(page.id)} className="text-red-400 text-sm px-3">
                  {t("pages.delete")}
                </button>
              </div>
            )}
            <div>
              <p className="text-xs text-app-muted mb-2">{t("pages.sections")}</p>
              <div className="flex flex-wrap gap-1">
                {sectionInstances.map((instance) => {
                  const active =
                    page.sectionOrder.includes(instance.id) ||
                    page.sectionOrder.includes(instance.type);
                  return (
                    <button
                      key={instance.id}
                      type="button"
                      onClick={() => {
                        const order = active
                          ? page.sectionOrder.filter(
                              (entry) => entry !== instance.id && entry !== instance.type
                            )
                          : [...page.sectionOrder, instance.id];
                        updatePage(page.id, { sectionOrder: order });
                      }}
                      className="text-xs px-2 py-1 rounded-lg border transition-colors"
                      style={
                        active
                          ? { borderColor: "var(--app-primary)", background: "var(--app-primary-muted)", color: "var(--app-primary)" }
                          : { borderColor: "var(--app-border)", color: "var(--app-text-muted)" }
                      }
                    >
                      {getInstanceLabel(instance, sectionInstances, sectionTitles)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      {saving && <p className="text-xs text-app-muted mt-4">{t("pages.saving")}</p>}
    </div>
  );
}
