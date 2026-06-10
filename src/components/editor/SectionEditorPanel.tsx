"use client";

import type { PortfolioTheme, SectionId, SectionStyle, ColumnLayout, BorderRadius, ShadowStyle } from "@/lib/portfolio-theme";
import { SECTION_LABELS, getSectionStyleForInstance, getInstanceLabel } from "@/lib/portfolio-theme";
import type { PlatformData, SectionInstanceContent } from "@/lib/platform-data";
import { buildMapEmbedUrl } from "@/lib/background-utils";
import {
  getInstanceCustomHtml,
  getInstanceGallery,
  getInstanceTestimonials,
  getInstanceVideoUrl,
} from "@/lib/platform-data";
import type { PersonalInfo } from "@/lib/types";
import { ColorInput, OptionGroup, PanelSection } from "./EditorShared";
import {
  AboutContentEditor,
  SkillsOverviewEditor,
  ExperienceEditor,
  EducationEditor,
  StatsEditor,
  TechStackEditor,
  ServicesEditor,
  CaseStudiesEditor,
  BlogEditor,
  OpenSourceEditor,
  AwardsEditor,
  LanguagesEditor,
  CtaEditor,
  VideosEditor,
  TestimonialsEditor,
  GalleryEditor,
  CustomHtmlEditor,
  ProjectsNote,
  SkillsNote,
} from "./SectionContentEditors";

interface SectionEditorPanelProps {
  instanceId: string;
  sectionType: SectionId;
  theme: PortfolioTheme;
  updateTheme: (patch: Partial<PortfolioTheme>) => void;
  platform?: PlatformData;
  updatePlatform?: (patch: Partial<PlatformData>) => void;
  personalInfo?: PersonalInfo;
  updateProfile?: (patch: Partial<PersonalInfo>) => void;
}

const COLUMN_SECTIONS = new Set<SectionId>(["gallery", "testimonials", "services", "awards", "projects"]);
const MEDIA_HEIGHT_SECTIONS = new Set<SectionId>(["gallery", "video"]);

export default function SectionEditorPanel({
  instanceId,
  sectionType,
  theme,
  updateTheme,
  platform,
  updatePlatform,
  personalInfo,
  updateProfile,
}: SectionEditorPanelProps) {
  const instance = { id: instanceId, type: sectionType };
  const style = getSectionStyleForInstance(instance, theme.sectionStyles);
  const headerLabel = getInstanceLabel(instance, theme.sections.order, theme.sections.titles);

  function updateStyle(patch: Partial<SectionStyle>) {
    updateTheme({
      sectionStyles: {
        ...theme.sectionStyles,
        [instanceId]: { ...style, ...patch },
      },
    });
  }

  function updateInstancePlatformContent(patch: Partial<SectionInstanceContent>) {
    if (!updatePlatform || !platform) return;
    updatePlatform({
      sectionContent: {
        ...platform.sectionContent,
        [instanceId]: {
          ...(platform.sectionContent?.[instanceId] ?? {}),
          ...patch,
        },
      },
    });
  }

  function updateContent(patch: Partial<PortfolioTheme["content"]>) {
    updateTheme({ content: { ...theme.content, ...patch } });
  }

  function updateColors(patch: Partial<NonNullable<SectionStyle["colors"]>>) {
    updateStyle({ colors: { ...style.colors, ...patch } });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "var(--app-border)" }}>
        <h3 className="font-semibold" style={{ color: "var(--app-text)" }}>
          {headerLabel}
        </h3>
        <span className="text-xs" style={{ color: "var(--app-text-muted)" }}>
          {SECTION_LABELS[sectionType]}
        </span>
      </div>

      <PanelSection title="Section title">
        <input
          type="text"
          value={theme.sections.titles[instanceId] || ""}
          onChange={(e) =>
            updateTheme({
              sections: {
                ...theme.sections,
                titles: { ...theme.sections.titles, [instanceId]: e.target.value },
              },
            })
          }
          className="input-field text-sm"
        />
      </PanelSection>

      <PanelSection title="Layout & spacing">
        <div className="space-y-4">
          <div>
            <p className="text-xs mb-1.5" style={{ color: "var(--app-text-muted)" }}>Alignment</p>
            <OptionGroup
              value={style.alignment}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
              onChange={(v) => updateStyle({ alignment: v as SectionStyle["alignment"] })}
            />
          </div>
          <div>
            <p className="text-xs mb-1.5" style={{ color: "var(--app-text-muted)" }}>Padding</p>
            <OptionGroup
              value={style.padding}
              options={[
                { value: "none", label: "None" },
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
              ]}
              onChange={(v) => updateStyle({ padding: v as SectionStyle["padding"] })}
            />
          </div>
          <div>
            <p className="text-xs mb-1.5" style={{ color: "var(--app-text-muted)" }}>Section width</p>
            <OptionGroup
              value={style.maxWidth || "inherit"}
              options={[
                { value: "inherit", label: "Global" },
                { value: "narrow", label: "Narrow" },
                { value: "medium", label: "Medium" },
                { value: "wide", label: "Wide" },
              ]}
              onChange={(v) => updateStyle({ maxWidth: v as SectionStyle["maxWidth"] })}
            />
          </div>
          <div>
            <p className="text-xs mb-1.5" style={{ color: "var(--app-text-muted)" }}>Min height</p>
            <OptionGroup
              value={style.minHeight || "auto"}
              options={[
                { value: "auto", label: "Auto" },
                { value: "sm", label: "200px" },
                { value: "md", label: "320px" },
                { value: "lg", label: "480px" },
                { value: "xl", label: "640px" },
                { value: "screen", label: "Full screen" },
              ]}
              onChange={(v) => updateStyle({ minHeight: v as SectionStyle["minHeight"] })}
            />
          </div>
          {COLUMN_SECTIONS.has(sectionType) && (
            <div>
              <p className="text-xs mb-1.5" style={{ color: "var(--app-text-muted)" }}>Columns</p>
              <OptionGroup
                value={style.columns || "1"}
                options={[
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                ]}
                onChange={(v) => updateStyle({ columns: v as ColumnLayout })}
              />
            </div>
          )}
          {MEDIA_HEIGHT_SECTIONS.has(sectionType) && (
            <div>
              <p className="text-xs mb-1.5" style={{ color: "var(--app-text-muted)" }}>Media height</p>
              <OptionGroup
                value={style.mediaHeight || "md"}
                options={[
                  { value: "sm", label: "Small" },
                  { value: "md", label: "Medium" },
                  { value: "lg", label: "Large" },
                  { value: "xl", label: "Extra large" },
                  { value: "auto", label: "Auto" },
                ]}
                onChange={(v) => updateStyle({ mediaHeight: v as SectionStyle["mediaHeight"] })}
              />
            </div>
          )}
        </div>
      </PanelSection>

      <PanelSection title="Background & surface">
        <div className="space-y-4">
          <div>
            <p className="text-xs mb-1.5" style={{ color: "var(--app-text-muted)" }}>Background preset</p>
            <OptionGroup
              value={style.background}
              options={[
                { value: "transparent", label: "None" },
                { value: "surface", label: "Surface" },
                { value: "accent", label: "Accent" },
              ]}
              onChange={(v) => updateStyle({ background: v as SectionStyle["background"] })}
            />
          </div>
          <div>
            <p className="text-xs mb-1.5" style={{ color: "var(--app-text-muted)" }}>Background image URL</p>
            <input
              type="text"
              value={style.backgroundImage || ""}
              onChange={(e) => updateStyle({ backgroundImage: e.target.value })}
              placeholder="https://..."
              className="input-field text-xs"
            />
          </div>
          <div>
            <p className="text-xs mb-1.5" style={{ color: "var(--app-text-muted)" }}>Corner radius</p>
            <OptionGroup
              value={style.borderRadius || theme.layout.borderRadius}
              options={[
                { value: "none", label: "Sharp" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
                { value: "full", label: "Round" },
              ]}
              onChange={(v) => updateStyle({ borderRadius: v as BorderRadius })}
            />
          </div>
          <div>
            <p className="text-xs mb-1.5" style={{ color: "var(--app-text-muted)" }}>Shadow</p>
            <OptionGroup
              value={style.shadow || "none"}
              options={[
                { value: "none", label: "None" },
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
              ]}
              onChange={(v) => updateStyle({ shadow: v as ShadowStyle })}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={style.showDivider}
              onChange={(e) => updateStyle({ showDivider: e.target.checked })}
              className="rounded accent-violet-600"
            />
            <span className="text-sm" style={{ color: "var(--app-text)" }}>Show title divider</span>
          </label>
        </div>
      </PanelSection>

      <PanelSection title="Section colors">
        <p className="text-xs mb-3" style={{ color: "var(--app-text-muted)" }}>
          Override global theme colors for this section only. Leave blank to inherit.
        </p>
        <div className="space-y-3">
          <ColorInput label="Background" value={style.colors?.background || theme.colors.surface} onChange={(v) => updateColors({ background: v })} />
          <ColorInput label="Text" value={style.colors?.text || theme.colors.text} onChange={(v) => updateColors({ text: v })} />
          <ColorInput label="Title" value={style.colors?.title || theme.colors.primary} onChange={(v) => updateColors({ title: v })} />
          <ColorInput label="Accent" value={style.colors?.accent || theme.colors.accent} onChange={(v) => updateColors({ accent: v })} />
          <ColorInput label="Border" value={style.colors?.border || theme.colors.textMuted} onChange={(v) => updateColors({ border: v })} />
          {style.colors && (
            <button
              type="button"
              onClick={() => updateStyle({ colors: undefined })}
              className="text-xs"
              style={{ color: "var(--app-text-muted)" }}
            >
              Reset to global colors
            </button>
          )}
        </div>
      </PanelSection>

      <SectionContentRouter
        instanceId={instanceId}
        sectionType={sectionType}
        theme={theme}
        style={style}
        updateTheme={updateTheme}
        updateStyle={updateStyle}
        updateContent={updateContent}
        platform={platform}
        updatePlatform={updatePlatform}
        updateInstancePlatformContent={updateInstancePlatformContent}
        personalInfo={personalInfo}
        updateProfile={updateProfile}
      />
    </div>
  );
}

function SectionContentRouter({
  instanceId,
  sectionType,
  theme,
  style,
  updateTheme,
  updateStyle,
  updateContent,
  platform,
  updatePlatform,
  updateInstancePlatformContent,
  personalInfo,
  updateProfile,
}: {
  instanceId: string;
  sectionType: SectionId;
  theme: PortfolioTheme;
  style: SectionStyle;
  updateTheme: (patch: Partial<PortfolioTheme>) => void;
  updateStyle: (patch: Partial<SectionStyle>) => void;
  updateContent: (patch: Partial<PortfolioTheme["content"]>) => void;
  platform?: PlatformData;
  updatePlatform?: (patch: Partial<PlatformData>) => void;
  updateInstancePlatformContent: (patch: Partial<SectionInstanceContent>) => void;
  personalInfo?: PersonalInfo;
  updateProfile?: (patch: Partial<PersonalInfo>) => void;
}) {
  const noopProfile = updateProfile || (() => {});

  switch (sectionType) {
    case "about":
      return personalInfo ? (
        <AboutContentEditor
          theme={theme}
          personalInfo={personalInfo}
          onThemeChange={updateContent}
          onProfileChange={noopProfile}
        />
      ) : null;

    case "experience":
      return (
        <ExperienceEditor
          items={theme.content.experience}
          layout={style.layout || "timeline"}
          onLayoutChange={(layout) => updateStyle({ layout })}
          onChange={(experience) => updateContent({ experience })}
        />
      );

    case "stats":
      return (
        <StatsEditor
          items={theme.content.stats}
          layout={style.layout || "row"}
          onLayoutChange={(layout) => updateStyle({ layout })}
          onChange={(stats) => updateContent({ stats })}
        />
      );

    case "skills":
      return (
        <>
          {personalInfo && (
            <SkillsOverviewEditor
              theme={theme}
              personalInfo={personalInfo}
              onThemeChange={updateContent}
              onProfileChange={noopProfile}
            />
          )}
          <PanelSection title="Skills layout">
            <OptionGroup
              value={theme.layout.skillsLayout}
              options={[
                { value: "grid", label: "Grid" },
                { value: "list", label: "List" },
                { value: "tags", label: "Tags" },
              ]}
              onChange={(v) =>
                updateTheme({
                  layout: { ...theme.layout, skillsLayout: v as PortfolioTheme["layout"]["skillsLayout"] },
                })
              }
            />
          </PanelSection>
          <SkillsNote />
        </>
      );

    case "projects":
      return (
        <>
          <PanelSection title="Projects layout">
            <OptionGroup
              value={theme.layout.projectsLayout}
              options={[
                { value: "list", label: "List" },
                { value: "grid", label: "Grid" },
                { value: "cards", label: "Cards" },
              ]}
              onChange={(v) =>
                updateTheme({
                  layout: { ...theme.layout, projectsLayout: v as PortfolioTheme["layout"]["projectsLayout"] },
                })
              }
            />
          </PanelSection>
          <ProjectsNote />
        </>
      );

    case "contact":
      return (
        <>
          <PanelSection title="Layout">
            <OptionGroup
              value={style.layout || "cards"}
              options={[
                { value: "cards", label: "Cards" },
                { value: "inline", label: "Inline" },
                { value: "minimal", label: "Minimal" },
              ]}
              onChange={(v) => updateStyle({ layout: v })}
            />
          </PanelSection>
          <PanelSection title="Intro text">
            <textarea
              value={theme.content.contactNote}
              onChange={(e) => updateContent({ contactNote: e.target.value })}
              rows={3}
              className="input-field text-sm resize-y"
            />
          </PanelSection>
        </>
      );

    case "contactform":
      return (
        <PanelSection title="Form intro text">
          <textarea
            value={theme.content.contactFormNote}
            onChange={(e) => updateContent({ contactFormNote: e.target.value })}
            rows={3}
            className="input-field text-sm resize-y"
          />
        </PanelSection>
      );

    case "resume":
      return (
        <PanelSection title="Description">
          <textarea
            value={theme.content.resumeText}
            onChange={(e) => updateContent({ resumeText: e.target.value })}
            rows={3}
            className="input-field text-sm resize-y"
          />
        </PanelSection>
      );

    case "cta":
      return <CtaEditor cta={theme.content.cta} onChange={(cta) => updateContent({ cta })} />;

    case "location":
      return (
        <>
          <PanelSection title="Intro text">
            <textarea
              value={theme.content.locationNote}
              onChange={(e) => updateContent({ locationNote: e.target.value })}
              rows={3}
              className="input-field text-sm resize-y"
            />
          </PanelSection>
          <PanelSection title="Map embed URL">
            <input
              type="text"
              value={theme.content.locationMapUrl}
              onChange={(e) => updateContent({ locationMapUrl: e.target.value })}
              placeholder="Leave empty to auto-generate from profile location"
              className="input-field text-sm"
            />
            {personalInfo?.preferredLocation && (
              <button
                type="button"
                className="mt-2 text-xs px-3 py-1.5 rounded-lg border"
                style={{ borderColor: "var(--app-primary)", color: "var(--app-primary)" }}
                onClick={() =>
                  updateContent({
                    locationMapUrl: buildMapEmbedUrl(personalInfo.preferredLocation || ""),
                  })
                }
              >
                Generate map from profile location
              </button>
            )}
            <p className="text-xs mt-2" style={{ color: "var(--app-text-muted)" }}>
              Location text comes from Profile → Location. Or set map in Layout → Footer.
            </p>
          </PanelSection>
          <PanelSection title="Layout">
            <OptionGroup
              value={style.layout || "map"}
              options={[
                { value: "map", label: "Map + text" },
                { value: "split", label: "Side by side" },
                { value: "minimal", label: "Text only" },
              ]}
              onChange={(v) => updateStyle({ layout: v })}
            />
          </PanelSection>
        </>
      );

    case "timeline":
      return (
        <>
          <ExperienceEditor
            items={theme.content.experience}
            layout="timeline"
            onLayoutChange={() => {}}
            onChange={(experience) => updateContent({ experience })}
          />
          <EducationEditor items={theme.content.education} onChange={(education) => updateContent({ education })} />
        </>
      );

    case "techStack":
      return <TechStackEditor items={theme.content.techStack} onChange={(techStack) => updateContent({ techStack })} />;

    case "caseStudy":
      return <CaseStudiesEditor items={theme.content.caseStudies} onChange={(caseStudies) => updateContent({ caseStudies })} />;

    case "services":
      return (
        <>
          <PanelSection title="Layout">
            <OptionGroup
              value={style.layout || "cards"}
              options={[
                { value: "cards", label: "Cards" },
                { value: "list", label: "List" },
              ]}
              onChange={(v) => updateStyle({ layout: v })}
            />
          </PanelSection>
          <ServicesEditor items={theme.content.services} onChange={(services) => updateContent({ services })} />
        </>
      );

    case "blog":
      return <BlogEditor items={theme.content.articles} onChange={(articles) => updateContent({ articles })} />;

    case "openSource":
      return <OpenSourceEditor items={theme.content.openSource} onChange={(openSource) => updateContent({ openSource })} />;

    case "awards":
      return <AwardsEditor items={theme.content.awards} onChange={(awards) => updateContent({ awards })} />;

    case "languages":
      return <LanguagesEditor items={theme.content.languages} onChange={(languages) => updateContent({ languages })} />;

    case "testimonials":
      return updatePlatform && platform ? (
        <>
          <PanelSection title="Layout">
            <OptionGroup
              value={style.layout || "cards"}
              options={[
                { value: "cards", label: "Cards" },
                { value: "list", label: "List" },
              ]}
              onChange={(v) => updateStyle({ layout: v })}
            />
          </PanelSection>
          <TestimonialsEditor
            items={getInstanceTestimonials(platform, instanceId, sectionType, theme.sections.order)}
            onChange={(testimonials) => updateInstancePlatformContent({ testimonials })}
          />
        </>
      ) : null;

    case "gallery":
      return updatePlatform && platform ? (
        <GalleryEditor
          items={getInstanceGallery(platform, instanceId, sectionType, theme.sections.order)}
          onChange={(gallery) => updateInstancePlatformContent({ gallery })}
        />
      ) : null;

    case "video":
      return (
        <>
          <VideosEditor
            items={theme.content.videos}
            legacyUrl={platform ? getInstanceVideoUrl(platform, instanceId, sectionType, theme.sections.order) : ""}
            onChange={(videos) => updateContent({ videos })}
          />
          {updatePlatform && platform && (
            <PanelSection title="Legacy video URL">
              <input
                type="text"
                value={getInstanceVideoUrl(platform, instanceId, sectionType, theme.sections.order)}
                onChange={(e) => updateInstancePlatformContent({ videoUrl: e.target.value })}
                placeholder="YouTube or Vimeo URL"
                className="input-field text-xs"
              />
              <p className="text-xs mt-2" style={{ color: "var(--app-text-muted)" }}>
                Used when no videos are added above.
              </p>
            </PanelSection>
          )}
        </>
      );

    case "customHtml":
      return updatePlatform && platform ? (
        <CustomHtmlEditor
          value={getInstanceCustomHtml(platform, instanceId, sectionType, theme.sections.order)}
          onChange={(customHtml) => updateInstancePlatformContent({ customHtml })}
        />
      ) : null;

    default:
      return null;
  }
}
