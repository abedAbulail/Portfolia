"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { AppIcon } from "@/components/icons/AppIcons";
import type { PortfolioPage } from "@/lib/platform-data";
import type { PortfolioTheme, SectionInstance } from "@/lib/portfolio-theme";
import { getInstanceLabel, parseThemeSettings } from "@/lib/portfolio-theme";

export default function PagesManagerClient() {
  const { t, dir } = useLocale();
  const [savedPages, setSavedPages] = useState<PortfolioPage[]>([]);
  const [draftPages, setDraftPages] = useState<PortfolioPage[]>([]);
  const [sectionInstances, setSectionInstances] = useState<SectionInstance[]>([]);
  const [sectionTitles, setSectionTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/platform").then((r) => r.json()),
      fetch("/api/dashboard/theme").then((r) => r.json()),
    ])
      .then(([platformRes, themeRes]) => {
        const loaded = platformRes.platform?.pages || [];
        setSavedPages(loaded);
        setDraftPages(loaded);
        const theme: PortfolioTheme = parseThemeSettings(JSON.stringify(themeRes.theme ?? themeRes));
        setSectionInstances(theme.sections.order);
        setSectionTitles(theme.sections.titles);
      })
      .finally(() => setLoading(false));
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(savedPages) !== JSON.stringify(draftPages),
    [savedPages, draftPages]
  );

  const updateDraft = useCallback((next: PortfolioPage[]) => {
    setDraftPages(next);
    setMessage("");
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/dashboard/platform", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pages: draftPages }),
    });
    if (res.ok) {
      setSavedPages(draftPages);
      setMessage(t("pages.saved"));
    } else {
      setMessage(t("pages.saveFailed"));
    }
    setSaving(false);
  }

  function addPage() {
    const id = `page-${Date.now()}`;
    updateDraft([
      ...draftPages,
      {
        id,
        slug: `page-${draftPages.length}`,
        title: "New Page",
        visible: true,
        sectionOrder: sectionInstances[0] ? [sectionInstances[0].id] : ["about"],
        colorMode: "inherit" as const,
      },
    ]);
  }

  function updatePage(id: string, patch: Partial<PortfolioPage>) {
    updateDraft(draftPages.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function removePage(id: string) {
    const page = draftPages.find((p) => p.id === id);
    if (page?.isHome) return;
    updateDraft(draftPages.filter((p) => p.id !== id));
  }

  function onDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const next = [...draftPages];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    setDragIdx(null);
    updateDraft(next);
  }

  if (loading) return <p className="text-app-muted">{t("pages.loading")}</p>;

  return (
    <div dir={dir} className="max-w-3xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">{t("pages.title")}</h1>
          <p className="text-sm text-app-muted">{t("pages.subtitle")}</p>
        </div>
        <button type="button" onClick={addPage} className="btn-secondary text-sm">
          + {t("pages.add")}
        </button>
      </div>

      <div className="space-y-3">
        {draftPages.map((page, idx) => (
          <div
            key={page.id}
            draggable
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(idx)}
            className="card p-4 space-y-3"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <AppIcon name="arrow-up-down" size={16} className="text-app-muted cursor-grab shrink-0" />
              <input
                value={page.title}
                onChange={(e) => updatePage(page.id, { title: e.target.value })}
                className="input-field flex-1 min-w-[140px] !py-2"
              />
              <label className="flex items-center gap-2 text-sm text-app-muted shrink-0">
                <input
                  type="checkbox"
                  checked={page.visible}
                  onChange={(e) => updatePage(page.id, { visible: e.target.checked })}
                />
                {t("pages.visible")}
              </label>
              <Link
                href={`/dashboard/editor?page=${page.id}`}
                className="btn-primary text-sm shrink-0 inline-flex items-center gap-1.5"
              >
                <AppIcon name="layout" size={14} />
                {t("pages.editInEditor")}
              </Link>
            </div>

            {!page.isHome && (
              <div className="flex gap-2 flex-wrap">
                <input
                  value={page.slug}
                  onChange={(e) =>
                    updatePage(page.id, { slug: e.target.value.replace(/[^a-z0-9-]/gi, "-").toLowerCase() })
                  }
                  placeholder="slug"
                  className="input-field flex-1 min-w-[140px] !py-2 text-sm"
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
                          ? {
                              borderColor: "var(--app-primary)",
                              background: "var(--app-primary-muted)",
                              color: "var(--app-primary)",
                            }
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

      <div
        className="sticky bottom-4 mt-6 flex items-center justify-between gap-3 p-4 rounded-xl border shadow-lg"
        style={{ borderColor: "var(--app-border)", background: "var(--app-sidebar-bg)" }}
      >
        <p className="text-sm" style={{ color: isDirty ? "var(--app-primary)" : "var(--app-text-muted)" }}>
          {isDirty ? t("pages.unsaved") : t("pages.allSaved")}
        </p>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="btn-primary text-sm disabled:opacity-50"
        >
          {saving ? t("pages.saving") : t("pages.save")}
        </button>
      </div>

      {message && (
        <p className={`text-sm mt-3 ${message.includes("Failed") ? "text-red-400" : "text-emerald-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
