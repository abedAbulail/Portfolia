"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import PortfolioClient from "@/components/PortfolioClient";
import { AppIcon, type AppIconName } from "@/components/icons/AppIcons";
import { useLocale } from "@/context/LocaleContext";
import { useAppTheme } from "@/context/AppThemeContext";
import { LOCALES } from "@/lib/i18n";
import ThemesPanel from "@/components/editor/ThemesPanel";
import SectionEditorPanel from "@/components/editor/SectionEditorPanel";
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
import {
  DEFAULT_THEME,
  COLOR_PRESETS,
  SECTION_LABELS,
  sortByOrder,
  mergeTheme,
  getAvailableSections,
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
  const [data, setData] = useState<PortfolioData | null>(null);
  const [theme, setTheme] = useState<PortfolioTheme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<EditorTab>("themes");
  const [selectedSection, setSelectedSection] = useState<SectionId | null>(null);
  const [userSlug, setUserSlug] = useState("");
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const [uploadingHero, setUploadingHero] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>("edit");
  const { locale, setLocale, t, dir } = useLocale();
  const { theme: appTheme, toggleTheme } = useAppTheme();

  useEffect(() => {
    Promise.all([fetch("/api/dashboard"), fetch("/api/dashboard/theme")])
      .then(([dashRes, themeRes]) => Promise.all([dashRes.json(), themeRes.json()]))
      .then(([dash, themeData]) => {
        if (dash.personalInfo) {
          const loadedTheme = themeData.theme || DEFAULT_THEME;
          setUserSlug(dash.user?.slug || "");
          setTheme(loadedTheme);
          setData({
            personalInfo: {
              ...dash.personalInfo,
              resumeUrl:
                dash.personalInfo.resumeUrl || dash.personalInfo.resume?.[0]?.url,
            },
            projects: dash.projects || [],
            skills: dash.skills || [],
            theme: loadedTheme,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const updateTheme = useCallback((patch: Partial<PortfolioTheme> | PortfolioTheme) => {
    setTheme((prev) => {
      if ("sections" in patch && patch.sections && "colors" in patch && patch.colors) {
        return patch as PortfolioTheme;
      }
      return mergeTheme(prev, patch as Partial<PortfolioTheme>);
    });
  }, []);

  const applyFullTheme = useCallback((fullTheme: PortfolioTheme) => {
    setTheme(fullTheme);
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
      }
    : null;

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/dashboard/theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(theme),
    });
    setMessage(res.ok ? "Theme saved! View your live portfolio to see changes." : "Failed to save.");
    setSaving(false);
  }

  function moveSection(id: SectionId, dir: -1 | 1) {
    const order = [...theme.sections.order];
    const idx = order.indexOf(id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= order.length) return;
    [order[idx], order[newIdx]] = [order[newIdx], order[idx]];
    updateTheme({ sections: { ...theme.sections, order } });
  }

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
                  if (tab.id !== "sections") setSelectedSection(null);
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

            {activeTab === "sections" && !selectedSection && (
              <SectionsList
                theme={theme}
                updateTheme={updateTheme}
                moveSection={moveSection}
                onSelectSection={setSelectedSection}
              />
            )}

            {activeTab === "sections" && selectedSection && (
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedSection(null)}
                  className="text-xs mb-4 flex items-center gap-1"
                  style={{ color: "var(--app-primary)" }}
                >
                  <AppIcon name="arrow-left" size={12} />
                  {t("ed.backSections")}
                </button>
                <SectionEditorPanel
                  sectionId={selectedSection}
                  theme={theme}
                  updateTheme={updateTheme}
                />
              </div>
            )}

            {activeTab === "layout" && (
              <LayoutPanel
                theme={theme}
                updateTheme={updateTheme}
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
                  <PortfolioClient data={previewData} slug={userSlug} />
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
  updateTheme,
  moveSection,
  onSelectSection,
}: {
  theme: PortfolioTheme;
  updateTheme: (p: Partial<PortfolioTheme>) => void;
  moveSection: (id: SectionId, dir: -1 | 1) => void;
  onSelectSection: (id: SectionId) => void;
}) {
  const available = getAvailableSections(theme.sections.order);

  function addSection(id: SectionId) {
    updateTheme({
      sections: { ...theme.sections, order: [...theme.sections.order, id] },
    });
  }

  function removeSection(id: SectionId) {
    if (MAIN_SECTIONS.includes(id) && theme.sections.order.filter((s) => MAIN_SECTIONS.includes(s)).length <= 1) {
      return;
    }
    updateTheme({
      sections: {
        ...theme.sections,
        order: theme.sections.order.filter((s) => s !== id),
      },
    });
  }

  return (
    <>
      <PanelSection title="Active sections — click to edit">
        <div className="space-y-2">
          {theme.sections.order.map((id, idx) => (
            <div
              key={id}
              className={editorRowClass}
              style={editorRowStyle()}
            >
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveSection(id, -1)}
                  className="disabled:opacity-30"
                  style={{ color: "var(--app-text-muted)" }}
                >
                  <AppIcon name="chevron-up" size={12} />
                </button>
                <button
                  type="button"
                  disabled={idx === theme.sections.order.length - 1}
                  onClick={() => moveSection(id, 1)}
                  className="disabled:opacity-30"
                  style={{ color: "var(--app-text-muted)" }}
                >
                  <AppIcon name="chevron-down" size={12} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onSelectSection(id)}
                className="flex-1 text-left text-sm transition-colors py-1 min-w-0"
                style={{ color: "var(--app-text)" }}
              >
                {SECTION_LABELS[id]}
                <span className="text-xs ml-2" style={{ color: "var(--app-text-muted)" }}>
                  Edit →
                </span>
              </button>
              {!MAIN_SECTIONS.includes(id) && (
                <button
                  type="button"
                  onClick={() => removeSection(id)}
                  className="text-xs text-red-400 hover:text-red-300 px-2"
                >
                  <AppIcon name="x" size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </PanelSection>

      {available.length > 0 && (
        <PanelSection title="Add section">
          <div className="flex flex-wrap gap-2">
            {available.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => addSection(id)}
                className="px-3 py-1.5 text-xs rounded-lg border transition-colors"
                style={{
                  borderColor: "var(--app-primary)",
                  color: "var(--app-primary)",
                  background: "var(--app-primary-muted)",
                }}
              >
                + {SECTION_LABELS[id]}
              </button>
            ))}
          </div>
        </PanelSection>
      )}

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
          values={theme.features as Record<string, boolean>}
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

function LayoutPanel({
  theme,
  updateTheme,
  uploadingHero,
  onHeroUpload,
  onClearHeroImage,
}: {
  theme: PortfolioTheme;
  updateTheme: (p: Partial<PortfolioTheme>) => void;
  uploadingHero?: boolean;
  onHeroUpload?: (file: File) => void;
  onClearHeroImage?: () => void;
}) {
  const hero = theme.hero ?? {};

  return (
    <>
      <PanelSection title="Hero background">
        {hero.backgroundImage && (
          <div className="mb-3 rounded-lg overflow-hidden border" style={{ borderColor: "var(--app-border)" }}>
            <img src={hero.backgroundImage} alt="Hero background" className="w-full h-24 object-cover" />
          </div>
        )}
        <div className="flex gap-2">
          <label className="btn-secondary text-xs cursor-pointer flex-1 text-center">
            {uploadingHero ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingHero}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && onHeroUpload) onHeroUpload(file);
              }}
            />
          </label>
          {hero.backgroundImage && (
            <button type="button" onClick={onClearHeroImage} className="btn-secondary text-xs">
              Remove
            </button>
          )}
        </div>
      </PanelSection>

      <PanelSection title="Hero gradient colors">
        <div className="space-y-3">
          <ColorInput
            label="Gradient from"
            value={hero.gradientFrom || theme.colors.primary}
            onChange={(v) => updateTheme({ hero: { ...hero, gradientFrom: v } })}
          />
          <ColorInput
            label="Gradient to"
            value={hero.gradientTo || theme.colors.accent}
            onChange={(v) => updateTheme({ hero: { ...hero, gradientTo: v } })}
          />
          <div>
            <label className="text-xs block mb-1" style={{ color: "var(--app-text-muted)" }}>
              Image overlay ({Math.round((hero.overlayOpacity ?? 0.55) * 100)}%)
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={hero.overlayOpacity ?? 0.55}
              onChange={(e) =>
                updateTheme({ hero: { ...hero, overlayOpacity: parseFloat(e.target.value) } })
              }
              className="w-full"
            />
          </div>
        </div>
      </PanelSection>

      {[
        { title: "Hero style", key: "heroStyle", options: ["centered", "split", "minimal"] },
        { title: "Hero alignment", key: "heroAlignment", options: ["left", "center", "right"] },
        { title: "Content width", key: "contentWidth", options: ["narrow", "medium", "wide"] },
        { title: "Spacing", key: "spacing", options: ["compact", "normal", "relaxed"] },
        { title: "Border radius", key: "borderRadius", options: ["none", "md", "lg", "full"] },
      ].map(({ title, key, options }) => (
        <PanelSection key={key} title={title}>
          <OptionGroup
            value={theme.layout[key as keyof typeof theme.layout] as string}
            options={options.map((o) => ({ value: o, label: o.charAt(0).toUpperCase() + o.slice(1) }))}
            onChange={(v) => updateTheme({ layout: { ...theme.layout, [key]: v } })}
          />
        </PanelSection>
      ))}
      <PanelSection title="Heading font">
        <OptionGroup
          value={theme.typography.headingFont}
          options={[
            { value: "serif", label: "Serif" },
            { value: "sans", label: "Sans" },
            { value: "mono", label: "Mono" },
          ]}
          onChange={(v) => updateTheme({ typography: { headingFont: v as PortfolioTheme["typography"]["headingFont"] } })}
        />
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
