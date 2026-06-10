"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PortfolioClient from "@/components/PortfolioClient";
import { AppIcon, type AppIconName } from "@/components/icons/AppIcons";
import { useLocale } from "@/context/LocaleContext";
import { useAppTheme } from "@/context/AppThemeContext";
import { LOCALES } from "@/lib/i18n";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useAutoSave } from "@/hooks/useAutoSave";
import ThemesPanel from "@/components/editor/ThemesPanel";
import SectionEditorPanel from "@/components/editor/SectionEditorPanel";
import LayoutPanel from "@/components/editor/LayoutPanel";
import PageSectionsPanel from "@/components/editor/PageSectionsPanel";
import {
  PanelSection,
  ColorInput,
  OptionGroup,
  ToggleList,
  editorRowClass,
  editorRowStyle,
} from "@/components/editor/EditorShared";
import type { PortfolioData } from "@/lib/types";
import type { PortfolioTheme, SectionId } from "@/lib/portfolio-theme";
import type { PlatformData } from "@/lib/platform-data";
import type { PortfolioPage } from "@/lib/platform-data";
import { DEFAULT_PLATFORM, parsePlatformData } from "@/lib/platform-data";
import {
  DEFAULT_THEME,
  COLOR_PRESETS,
  SECTION_LABELS,
  sortByOrder,
  mergeTheme,
  ALL_SECTIONS,
  createSectionInstance,
  getInstanceLabel,
  DEFAULT_SECTION_STYLES,
  MAIN_SECTIONS,
} from "@/lib/portfolio-theme";

type EditorTab = "themes" | "sections" | "layout" | "colors" | "order";
type PreviewViewport = "desktop" | "tablet" | "mobile";
type MobilePane = "edit" | "preview";

const VIEWPORT_WIDTHS: Record<PreviewViewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export default function PortfolioEditor() {
  return (
    <Suspense
      fallback={
        <p className="py-12 text-center" style={{ color: "var(--app-text-muted)" }}>
          Loading editor…
        </p>
      }
    >
      <PortfolioEditorInner />
    </Suspense>
  );
}

function PortfolioEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const [data, setData] = useState<PortfolioData | null>(null);
  const [platform, setPlatform] = useState<PlatformData>(DEFAULT_PLATFORM);
  const { state: theme, set: setThemeState, undo, redo, canUndo, canRedo, reset: resetTheme } = useUndoRedo<PortfolioTheme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<EditorTab>("themes");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [userSlug, setUserSlug] = useState("");
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingFooter, setUploadingFooter] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>("edit");
  const [activePageId, setActivePageId] = useState<string | null>(pageParam);
  const { locale, setLocale, t, dir } = useLocale();
  const { theme: appTheme, toggleTheme } = useAppTheme();

  useEffect(() => {
    Promise.all([fetch("/api/dashboard"), fetch("/api/dashboard/theme"), fetch("/api/dashboard/platform")])
      .then(([dashRes, themeRes, platformRes]) =>
        Promise.all([dashRes.json(), themeRes.json(), platformRes.json()])
      )
      .then(([dash, themeData, platformData]) => {
        if (dash.personalInfo) {
          const loadedTheme = themeData.theme || DEFAULT_THEME;
          const loadedPlatform = parsePlatformData(platformData.platform);
          setUserSlug(dash.user?.slug || "");
          resetTheme(loadedTheme);
          setPlatform(loadedPlatform);
          setData({
            personalInfo: {
              ...dash.personalInfo,
              resumeUrl:
                dash.personalInfo.resumeUrl || dash.personalInfo.resume?.[0]?.url,
            },
            projects: dash.projects || [],
            skills: dash.skills || [],
            theme: loadedTheme,
            platform: loadedPlatform,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const updateTheme = useCallback((patch: Partial<PortfolioTheme> | PortfolioTheme) => {
    setThemeState((prev) => {
      if ("sections" in patch && patch.sections && "colors" in patch && patch.colors) {
        return patch as PortfolioTheme;
      }
      return mergeTheme(prev, patch as Partial<PortfolioTheme>);
    });
  }, [setThemeState]);

  const applyFullTheme = useCallback((fullTheme: PortfolioTheme) => {
    setThemeState(fullTheme);
  }, [setThemeState]);

  const saveTheme = useCallback(async (themeData: PortfolioTheme) => {
    const res = await fetch("/api/dashboard/theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(themeData),
    });
    if (res.ok) setAutoSaved(true);
    return res.ok;
  }, []);

  useAutoSave(theme, saveTheme, 2500, !loading && !!data);

  const savePlatform = useCallback(async (platformData: PlatformData) => {
    const res = await fetch("/api/dashboard/platform", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(platformData),
    });
    if (res.ok) {
      const json = await res.json();
      setPlatform(parsePlatformData(json.platform));
    }
    return res.ok;
  }, []);

  useAutoSave(platform, savePlatform, 2500, !loading && !!data);

  const updatePlatform = useCallback((patch: Partial<PlatformData>) => {
    setPlatform((prev) => {
      const next = parsePlatformData({ ...prev, ...patch });
      setData((d) => (d ? { ...d, platform: next } : d));
      return next;
    });
  }, []);

  useEffect(() => {
    setActivePageId(pageParam);
    if (pageParam) setActiveTab("sections");
  }, [pageParam]);

  const activePage: PortfolioPage | null =
    platform.pages.find((p) => p.id === activePageId) ||
    platform.pages.find((p) => p.isHome) ||
    platform.pages[0] ||
    null;

  function selectPage(pageId: string) {
    setActivePageId(pageId);
    router.push(`/dashboard/editor?page=${pageId}`);
  }

  const updateActivePageSections = useCallback(
    (sectionOrder: string[]) => {
      if (!activePageId) return;
      updatePlatform({
        pages: platform.pages.map((p) =>
          p.id === activePageId ? { ...p, sectionOrder } : p
        ),
      });
    },
    [activePageId, platform.pages, updatePlatform]
  );

  const updateProfile = useCallback(async (patch: Partial<PortfolioData["personalInfo"]>) => {
    setData((d) => (d ? { ...d, personalInfo: { ...d.personalInfo, ...patch } } : d));
    await fetch("/api/dashboard/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }, []);

  const previewData: PortfolioData | null = data
    ? {
        personalInfo: data.personalInfo,
        projects: sortByOrder(
          data.projects,
          theme.projectOrder.length ? theme.projectOrder : data.projects.map((p) => p.id)
        ),
        skills: sortByOrder(
          data.skills,
          theme.skillOrder.length ? theme.skillOrder : data.skills.map((s) => s.id)
        ),
        theme,
        platform,
      }
    : null;

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const ok = await saveTheme(theme);
    setMessage(ok ? "Theme saved! View your live portfolio to see changes." : "Failed to save.");
    setSaving(false);
  }

  function moveSection(instanceId: string, dir: -1 | 1) {
    const order = [...theme.sections.order];
    const idx = order.findIndex((item) => item.id === instanceId);
    const newIdx = idx + dir;
    if (idx < 0 || newIdx < 0 || newIdx >= order.length) return;
    [order[idx], order[newIdx]] = [order[newIdx], order[idx]];
    updateTheme({ sections: { ...theme.sections, order } });
  }

  const selectedInstance = selectedSectionId
    ? theme.sections.order.find((item) => item.id === selectedSectionId)
    : null;

  function moveItem(type: "project" | "skill", id: string, dir: -1 | 1) {
    if (!data) return;
    const currentOrder =
      type === "project"
        ? theme.projectOrder.length
          ? theme.projectOrder
          : data.projects.map((p) => p.id)
        : theme.skillOrder.length
          ? theme.skillOrder
          : data.skills.map((s) => s.id);
    const order = [...currentOrder];
    const idx = order.indexOf(id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= order.length) return;
    [order[idx], order[newIdx]] = [order[newIdx], order[idx]];
    updateTheme(type === "project" ? { projectOrder: order } : { skillOrder: order });
  }

  if (loading) {
    return (
      <p className="py-12 text-center" style={{ color: "var(--app-text-muted)" }}>
        {t("ed.loading")}
      </p>
    );
  }
  if (!data || !previewData) {
    return (
      <p className="py-12 text-center text-red-500">{t("ed.failed")}</p>
    );
  }

  const tabs: { id: EditorTab; label: string; icon: AppIconName }[] = [
    { id: "themes", label: "Themes", icon: "sparkles" },
    { id: "sections", label: "Sections", icon: "list" },
    { id: "layout", label: "Layout", icon: "layout" },
    { id: "colors", label: "Colors", icon: "palette" },
    { id: "order", label: "Order", icon: "arrow-up-down" },
  ];

  return (
    <div className="flex flex-col min-h-dvh h-dvh" dir={dir}>
      <header
        className="shrink-0 flex flex-col gap-3 px-3 sm:px-4 py-3 border-b"
        style={{ borderColor: "var(--app-border)", background: "var(--app-sidebar-bg)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/dashboard"
              className="text-sm flex items-center gap-1.5 transition-colors shrink-0"
              style={{ color: "var(--app-text-muted)" }}
            >
              <AppIcon name="arrow-left" size={14} />
              <span className="hidden sm:inline">{t("ed.back")}</span>
            </Link>
            <span className="text-sm font-semibold truncate" style={{ color: "var(--app-text)" }}>
              {t("ed.title")}
            </span>
            {platform.pages.length > 0 && (
              <select
                value={activePage?.id ?? ""}
                onChange={(e) => selectPage(e.target.value)}
                className="input-field !py-1.5 !px-2 text-xs max-w-[160px] sm:max-w-[200px]"
                aria-label={t("ed.selectPage")}
              >
                {platform.pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
            <div
              className="hidden sm:flex gap-1 p-1 rounded-lg border"
              style={{ borderColor: "var(--app-border)", background: "var(--app-input-bg)" }}
            >
              {LOCALES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLocale(l.id)}
                  className="px-2 py-1 text-[10px] sm:text-xs rounded-md transition-colors"
                  style={
                    locale === l.id
                      ? { background: "var(--app-primary)", color: "#fff" }
                      : { color: "var(--app-text-muted)" }
                  }
                >
                  {l.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="hidden sm:flex items-center justify-center h-8 w-8 rounded-lg border transition-colors disabled:opacity-40"
              style={{ borderColor: "var(--app-border)", color: "var(--app-text-muted)" }}
              title={t("ed.undo")}
            >
              ↶
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="hidden sm:flex items-center justify-center h-8 w-8 rounded-lg border transition-colors disabled:opacity-40"
              style={{ borderColor: "var(--app-border)", color: "var(--app-text-muted)" }}
              title={t("ed.redo")}
            >
              ↷
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="hidden sm:flex items-center justify-center h-8 w-8 rounded-lg border transition-colors"
              style={{ borderColor: "var(--app-border)", color: "var(--app-text-muted)" }}
              title={appTheme === "dark" ? t("ed.lightMode") : t("ed.darkMode")}
            >
              <AppIcon name={appTheme === "dark" ? "sun" : "moon"} size={16} />
            </button>

            <div
              className="hidden md:flex gap-1 p-1 rounded-lg border"
              style={{ borderColor: "var(--app-border)", background: "var(--app-input-bg)" }}
            >
              {(
                [
                  { id: "desktop" as const, label: "Desktop", icon: "monitor" as const },
                  { id: "tablet" as const, label: "Tablet", icon: "tablet" as const },
                  { id: "mobile" as const, label: "Mobile", icon: "smartphone" as const },
                ] as const
              ).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setViewport(v.id)}
                  className="px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-center"
                  style={
                    viewport === v.id
                      ? { background: "var(--app-primary)", color: "#fff" }
                      : { color: "var(--app-text-muted)" }
                  }
                  title={v.label}
                >
                  <AppIcon name={v.icon} size={16} />
                </button>
              ))}
            </div>

            <button type="button" onClick={handleSave} disabled={saving} className="btn-primary text-xs sm:text-sm px-3 sm:px-5">
              {saving ? t("ed.saving") : t("ed.save")}
            </button>
          </div>
        </div>

        {/* Mobile: edit / preview toggle + lang + theme */}
        <div className="flex lg:hidden items-center gap-2">
          <div
            className="flex flex-1 gap-1 p-1 rounded-lg border"
            style={{ borderColor: "var(--app-border)", background: "var(--app-input-bg)" }}
          >
            <button
              type="button"
              onClick={() => setMobilePane("edit")}
              className="flex-1 py-2 text-xs font-medium rounded-md transition-colors"
              style={
                mobilePane === "edit"
                  ? { background: "var(--app-primary)", color: "#fff" }
                  : { color: "var(--app-text-muted)" }
              }
            >
              {t("ed.editPanel")}
            </button>
            <button
              type="button"
              onClick={() => setMobilePane("preview")}
              className="flex-1 py-2 text-xs font-medium rounded-md transition-colors"
              style={
                mobilePane === "preview"
                  ? { background: "var(--app-primary)", color: "#fff" }
                  : { color: "var(--app-text-muted)" }
              }
            >
              {t("ed.previewPanel")}
            </button>
          </div>

          <div
            className="flex sm:hidden gap-0.5 p-0.5 rounded-lg border shrink-0"
            style={{ borderColor: "var(--app-border)", background: "var(--app-input-bg)" }}
          >
            {LOCALES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLocale(l.id)}
                className="px-1.5 py-1.5 text-[10px] rounded-md"
                style={
                  locale === l.id
                    ? { background: "var(--app-primary)", color: "#fff" }
                    : { color: "var(--app-text-muted)" }
                }
              >
                {l.id.toUpperCase()}
              </button>
            ))}
          </div>

            {autoSaved && (
              <span className="hidden sm:inline text-[10px] text-app-muted">{t("ed.autoSaved")}</span>
            )}

            <button
              type="button"
              onClick={toggleTheme}
            className="sm:hidden flex items-center justify-center h-9 w-9 rounded-lg border shrink-0"
            style={{ borderColor: "var(--app-border)", color: "var(--app-text-muted)" }}
          >
            <AppIcon name={appTheme === "dark" ? "sun" : "moon"} size={16} />
          </button>
        </div>
      </header>

      {activePage && (
        <div
          className="shrink-0 px-3 sm:px-4 py-2 border-b flex items-center justify-between gap-2 text-sm"
          style={{ borderColor: "var(--app-border)", background: "var(--app-primary-muted)" }}
        >
          <span style={{ color: "var(--app-text)" }}>
            {t("ed.editingPage")}: <strong>{activePage.title}</strong>
          </span>
          <Link href="/dashboard/pages" className="text-xs shrink-0" style={{ color: "var(--app-primary)" }}>
            {t("ed.managePages")}
          </Link>
        </div>
      )}

      {message && (
        <p
          className={`text-sm px-4 py-2 ${message.includes("saved") ? "text-emerald-500" : "text-red-400"}`}
          style={{ background: "var(--app-input-bg)" }}
        >
          {message}
        </p>
      )}

      <div className="flex flex-1 min-h-0 flex-col lg:flex-row overflow-hidden">
        <div
          className={`w-full lg:w-[380px] xl:w-[400px] shrink-0 flex flex-col overflow-hidden border-b lg:border-b-0 lg:border-r ${
            mobilePane === "edit" ? "flex flex-1 lg:flex-none min-h-0" : "hidden lg:flex"
          }`}
          style={{ borderColor: "var(--app-border)", background: "var(--app-sidebar-bg)" }}
        >
          <div
            className="flex gap-1 p-2 border-b overflow-x-auto shrink-0"
            style={{ borderColor: "var(--app-border)" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== "sections") setSelectedSectionId(null);
                }}
                className="shrink-0 min-w-[4.5rem] flex-1 rounded-lg py-2 px-1.5 text-[10px] sm:text-xs font-medium transition-colors"
                style={
                  activeTab === tab.id
                    ? { background: "var(--app-primary)", color: "#fff" }
                    : { color: "var(--app-text-muted)" }
                }
              >
                <span className="inline-flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1">
                  <AppIcon name={tab.icon} size={14} />
                  <span className="truncate">{tab.label}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0">
            {activeTab === "themes" && (
              <ThemesPanel theme={theme} updateTheme={applyFullTheme} />
            )}

            {activeTab === "sections" && !selectedSectionId && (
              <>
                {activePage && (
                  <div className="mb-6 pb-6 border-b" style={{ borderColor: "var(--app-border)" }}>
                    <PageSectionsPanel
                      page={activePage}
                      theme={theme}
                      onChange={updateActivePageSections}
                      label={t("ed.pageSections")}
                      hint={t("ed.pageSectionsHint")}
                    />
                  </div>
                )}
                <SectionsList
                  theme={theme}
                  platform={platform}
                  updateTheme={updateTheme}
                  updatePlatform={updatePlatform}
                  moveSection={moveSection}
                  onSelectSection={setSelectedSectionId}
                  activePageId={activePageId}
                />
              </>
            )}

            {activeTab === "sections" && selectedSectionId && selectedInstance && (
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedSectionId(null)}
                  className="text-xs mb-4 flex items-center gap-1"
                  style={{ color: "var(--app-primary)" }}
                >
                  <AppIcon name="arrow-left" size={12} />
                  {t("ed.backSections")}
                </button>
                <SectionEditorPanel
                  instanceId={selectedInstance.id}
                  sectionType={selectedInstance.type}
                  theme={theme}
                  updateTheme={updateTheme}
                  platform={platform}
                  updatePlatform={updatePlatform}
                  personalInfo={data?.personalInfo}
                  updateProfile={updateProfile}
                />
              </div>
            )}

            {activeTab === "layout" && (
              <LayoutPanel
                theme={theme}
                updateTheme={updateTheme}
                profileLocation={data?.personalInfo.preferredLocation}
                uploadingHero={uploadingHero}
                onHeroUpload={async (file) => {
                  setUploadingHero(true);
                  const form = new FormData();
                  form.append("file", file);
                  form.append("type", "hero");
                  const res = await fetch("/api/upload", { method: "POST", body: form });
                  const data = await res.json();
                  if (res.ok && data.url) {
                    updateTheme({
                      hero: { ...theme.hero, backgroundImage: data.url },
                    });
                  }
                  setUploadingHero(false);
                }}
                onClearHeroImage={() =>
                  updateTheme({ hero: { ...theme.hero, backgroundImage: "" } })
                }
                uploadingFooter={uploadingFooter}
                onFooterUpload={async (file) => {
                  setUploadingFooter(true);
                  const form = new FormData();
                  form.append("file", file);
                  form.append("type", "hero");
                  const res = await fetch("/api/upload", { method: "POST", body: form });
                  const data = await res.json();
                  if (res.ok && data.url) {
                    updateTheme({
                      footer: { ...theme.footer, backgroundImage: data.url },
                    });
                  }
                  setUploadingFooter(false);
                }}
                onClearFooterImage={() =>
                  updateTheme({ footer: { ...theme.footer, backgroundImage: "" } })
                }
              />
            )}
            {activeTab === "colors" && <ColorsPanel theme={theme} updateTheme={updateTheme} />}
            {activeTab === "order" && (
              <OrderPanel data={data} theme={theme} moveItem={moveItem} />
            )}
          </div>
        </div>

        <div
          className={`flex-1 min-w-0 overflow-auto p-3 sm:p-4 lg:p-6 flex justify-center min-h-0 ${
            mobilePane === "preview" ? "flex" : "hidden lg:flex"
          }`}
          style={{ background: "var(--app-bg)" }}
        >
          <div className="w-full max-w-full">
            <div className="flex items-center justify-between mb-3 gap-2">
              <p className="text-sm" style={{ color: "var(--app-text-muted)" }}>
                {t("ed.livePreview")} · {viewport}
                {activePage ? ` · ${activePage.title}` : ""}
              </p>
              {theme.activeThemeId && (
                <span className="text-xs capitalize truncate" style={{ color: "var(--app-text-muted)" }}>
                  {theme.activeThemeId.replace(/-/g, " ")}
                </span>
              )}
            </div>
            <div className="flex justify-center">
              <div
                className="rounded-xl border overflow-hidden shadow-lg transition-all duration-300 w-full"
                style={{
                  borderColor: "var(--app-border)",
                  maxWidth: VIEWPORT_WIDTHS[viewport],
                  maxHeight: "calc(100dvh - 11rem)",
                  overflowY: "auto",
                }}
              >
                {userSlug && previewData && (
                  <PortfolioClient
                    data={previewData}
                    slug={userSlug}
                    pageSlug={activePage?.slug ?? ""}
                    sectionOrder={activePage?.sectionOrder}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionsList({
  theme,
  platform,
  updateTheme,
  updatePlatform,
  moveSection,
  onSelectSection,
  activePageId,
}: {
  theme: PortfolioTheme;
  platform: PlatformData;
  updateTheme: (p: Partial<PortfolioTheme>) => void;
  updatePlatform: (patch: Partial<PlatformData>) => void;
  moveSection: (instanceId: string, dir: -1 | 1) => void;
  onSelectSection: (instanceId: string) => void;
  activePageId?: string | null;
}) {
  function addSection(type: SectionId, sourceInstanceId?: string) {
    const instance = createSectionInstance(type, theme.sections.order);
    const source = sourceInstanceId
      ? theme.sections.order.find((item) => item.id === sourceInstanceId)
      : undefined;
    const sourceStyle = source
      ? theme.sectionStyles[source.id] ?? theme.sectionStyles[source.type] ?? DEFAULT_SECTION_STYLES[type]
      : DEFAULT_SECTION_STYLES[type];
    const sourceTitle = source
      ? getInstanceLabel(source, theme.sections.order, theme.sections.titles)
      : SECTION_LABELS[type];

    updateTheme({
      sections: {
        ...theme.sections,
        order: [...theme.sections.order, instance],
        titles: {
          ...theme.sections.titles,
          [instance.id]: source ? `${sourceTitle} (copy)` : SECTION_LABELS[type],
        },
      },
      sectionStyles: {
        ...theme.sectionStyles,
        [instance.id]: { ...sourceStyle },
      },
    });

    if (source && platform.sectionContent?.[source.id]) {
      updatePlatform({
        sectionContent: {
          ...platform.sectionContent,
          [instance.id]: structuredClone(platform.sectionContent[source.id]),
        },
      });
    }

    if (activePageId) {
      updatePlatform({
        pages: platform.pages.map((p) =>
          p.id === activePageId && !p.sectionOrder.includes(instance.id)
            ? { ...p, sectionOrder: [...p.sectionOrder, instance.id] }
            : p
        ),
      });
    }
  }

  function duplicateSection(instanceId: string) {
    const source = theme.sections.order.find((item) => item.id === instanceId);
    if (!source) return;
    addSection(source.type, instanceId);
  }

  function removeSection(instanceId: string) {
    const instance = theme.sections.order.find((item) => item.id === instanceId);
    if (!instance) return;
    if (
      MAIN_SECTIONS.includes(instance.type) &&
      theme.sections.order.filter((item) => item.type === instance.type).length <= 1
    ) {
      return;
    }
    const titles = { ...theme.sections.titles };
    const sectionStyles = { ...theme.sectionStyles };
    delete titles[instanceId];
    delete sectionStyles[instanceId];
    updateTheme({
      sections: {
        ...theme.sections,
        order: theme.sections.order.filter((item) => item.id !== instanceId),
        titles,
      },
      sectionStyles,
    });
  }

  return (
    <>
      <PanelSection title="Active sections — click to edit">
        <div className="space-y-2">
          {theme.sections.order.map((instance, idx) => (
            <div
              key={instance.id}
              className={editorRowClass}
              style={editorRowStyle()}
            >
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveSection(instance.id, -1)}
                  className="disabled:opacity-30"
                  style={{ color: "var(--app-text-muted)" }}
                >
                  <AppIcon name="chevron-up" size={12} />
                </button>
                <button
                  type="button"
                  disabled={idx === theme.sections.order.length - 1}
                  onClick={() => moveSection(instance.id, 1)}
                  className="disabled:opacity-30"
                  style={{ color: "var(--app-text-muted)" }}
                >
                  <AppIcon name="chevron-down" size={12} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onSelectSection(instance.id)}
                className="flex-1 text-left text-sm transition-colors py-1 min-w-0"
                style={{ color: "var(--app-text)" }}
              >
                {getInstanceLabel(instance, theme.sections.order, theme.sections.titles)}
                <span className="text-xs ml-2" style={{ color: "var(--app-text-muted)" }}>
                  Edit →
                </span>
              </button>
              <button
                type="button"
                onClick={() => duplicateSection(instance.id)}
                className="text-xs px-2 shrink-0"
                style={{ color: "var(--app-text-muted)" }}
                title="Duplicate section"
              >
                Dup
              </button>
              {!(
                MAIN_SECTIONS.includes(instance.type) &&
                theme.sections.order.filter((item) => item.type === instance.type).length <= 1
              ) && (
                <button
                  type="button"
                  onClick={() => removeSection(instance.id)}
                  className="text-xs text-red-400 hover:text-red-300 px-2"
                >
                  <AppIcon name="x" size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </PanelSection>

      <PanelSection title="Add section">
        <div className="flex flex-wrap gap-2">
          {ALL_SECTIONS.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addSection(type)}
              className="px-3 py-1.5 text-xs rounded-lg border transition-colors"
              style={{
                borderColor: "var(--app-primary)",
                color: "var(--app-primary)",
                background: "var(--app-primary-muted)",
              }}
            >
              + {SECTION_LABELS[type]}
            </button>
          ))}
        </div>
      </PanelSection>

      <PanelSection title="Global display options">
        <ToggleList
          items={[
            { key: "showHeroPhoto", label: "Show profile photo" },
            { key: "showSocialLinks", label: "Show social links" },
            { key: "showResumeInHero", label: "Show CV button in hero" },
            { key: "showProjectImages", label: "Show project images" },
            { key: "showSkillLevels", label: "Show skill levels" },
            { key: "showProjectStatus", label: "Show project status" },
            { key: "showGradient", label: "Hero gradient" },
            { key: "showFooter", label: "Show footer" },
          ]}
          values={{
            showHeroPhoto: theme.features.showHeroPhoto,
            showSocialLinks: theme.features.showSocialLinks,
            showResumeInHero: theme.features.showResumeInHero,
            showProjectImages: theme.features.showProjectImages,
            showSkillLevels: theme.features.showSkillLevels,
            showProjectStatus: theme.features.showProjectStatus,
            showGradient: theme.features.showGradient,
            showFooter: theme.features.showFooter,
          }}
          onChange={(key, val) =>
            updateTheme({ features: { ...theme.features, [key]: val } as PortfolioTheme["features"] })
          }
        />
      </PanelSection>
    </>
  );
}

function ColorsPanel({
  theme,
  updateTheme,
}: {
  theme: PortfolioTheme;
  updateTheme: (p: Partial<PortfolioTheme>) => void;
}) {
  return (
    <>
      <PanelSection title="Quick color presets">
        <div className="grid grid-cols-2 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => updateTheme({ colors: { ...preset } })}
              className="flex items-center gap-2 p-2 rounded-lg border text-left"
              style={{
                borderColor: "var(--app-border)",
                background: "var(--app-input-bg)",
              }}
            >
              <span className="w-4 h-4 rounded-full shrink-0" style={{ background: preset.primary }} />
              <span className="text-xs truncate" style={{ color: "var(--app-text)" }}>
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Custom colors">
        <div className="space-y-3">
          {(
            [
              ["background", "Background"],
              ["surface", "Surface"],
              ["primary", "Primary"],
              ["accent", "Accent"],
              ["text", "Text"],
              ["textMuted", "Muted"],
            ] as const
          ).map(([key, label]) => (
            <ColorInput
              key={key}
              label={label}
              value={theme.colors[key]}
              onChange={(v) => updateTheme({ colors: { ...theme.colors, [key]: v } })}
            />
          ))}
        </div>
      </PanelSection>
    </>
  );
}

function OrderPanel({
  data,
  theme,
  moveItem,
}: {
  data: PortfolioData;
  theme: PortfolioTheme;
  moveItem: (type: "project" | "skill", id: string, dir: -1 | 1) => void;
}) {
  const projectOrder = theme.projectOrder.length
    ? sortByOrder(data.projects, theme.projectOrder)
    : data.projects;
  const skillOrder = theme.skillOrder.length
    ? sortByOrder(data.skills, theme.skillOrder)
    : data.skills;

  return (
    <>
      <PanelSection title="Project order">
        {projectOrder.length === 0 ? (
          <p className="text-xs" style={{ color: "var(--app-text-muted)" }}>No projects yet.</p>
        ) : (
          projectOrder.map((p, idx) => (
            <OrderRow key={p.id} label={p.projectName} idx={idx} total={projectOrder.length} onMove={(d) => moveItem("project", p.id, d)} />
          ))
        )}
      </PanelSection>
      <PanelSection title="Skill order">
        {skillOrder.length === 0 ? (
          <p className="text-xs" style={{ color: "var(--app-text-muted)" }}>No skills yet.</p>
        ) : (
          skillOrder.map((s, idx) => (
            <OrderRow key={s.id} label={s.skillName} idx={idx} total={skillOrder.length} onMove={(d) => moveItem("skill", s.id, d)} />
          ))
        )}
      </PanelSection>
    </>
  );
}

function OrderRow({ label, idx, total, onMove }: { label: string; idx: number; total: number; onMove: (d: -1 | 1) => void }) {
  return (
    <div className={`${editorRowClass} mb-1`} style={editorRowStyle()}>
      <div className="flex flex-col gap-0.5 shrink-0">
        <button type="button" disabled={idx === 0} onClick={() => onMove(-1)} className="disabled:opacity-30" style={{ color: "var(--app-text-muted)" }}><AppIcon name="chevron-up" size={12} /></button>
        <button type="button" disabled={idx === total - 1} onClick={() => onMove(1)} className="disabled:opacity-30" style={{ color: "var(--app-text-muted)" }}><AppIcon name="chevron-down" size={12} /></button>
      </div>
      <span className="text-sm truncate min-w-0" style={{ color: "var(--app-text)" }}>{label}</span>
    </div>
  );
}
