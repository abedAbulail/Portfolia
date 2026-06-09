"use client";

import type { PortfolioTheme, SectionId, SectionStyle, ExperienceItem, StatItem } from "@/lib/portfolio-theme";
import { SECTION_LABELS } from "@/lib/portfolio-theme";
import { AppIcon } from "@/components/icons/AppIcons";
import { OptionGroup, PanelSection } from "./EditorShared";

interface SectionEditorPanelProps {
  sectionId: SectionId;
  theme: PortfolioTheme;
  updateTheme: (patch: Partial<PortfolioTheme>) => void;
}

export default function SectionEditorPanel({ sectionId, theme, updateTheme }: SectionEditorPanelProps) {
  const style = theme.sectionStyles[sectionId];

  function updateStyle(patch: Partial<SectionStyle>) {
    updateTheme({
      sectionStyles: {
        ...theme.sectionStyles,
        [sectionId]: { ...style, ...patch },
      },
    });
  }

  function updateContent(patch: Partial<PortfolioTheme["content"]>) {
    updateTheme({ content: { ...theme.content, ...patch } });
  }

  return (
    <div className="space-y-5">
      <div
        className="flex items-center gap-2 pb-3 border-b"
        style={{ borderColor: "var(--app-border)" }}
      >
        <h3 className="font-semibold" style={{ color: "var(--app-text)" }}>
          {SECTION_LABELS[sectionId]}
        </h3>
      </div>

      <PanelSection title="Section title">
        <input
          type="text"
          value={theme.sections.titles[sectionId]}
          onChange={(e) =>
            updateTheme({
              sections: {
                ...theme.sections,
                titles: { ...theme.sections.titles, [sectionId]: e.target.value },
              },
            })
          }
          className="input-field text-sm"
        />
      </PanelSection>

      <PanelSection title="Design">
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
            <p className="text-xs mb-1.5" style={{ color: "var(--app-text-muted)" }}>Background</p>
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

      {sectionId === "experience" && (
        <ExperienceEditor
          items={theme.content.experience}
          layout={style.layout || "timeline"}
          onLayoutChange={(layout) => updateStyle({ layout })}
          onChange={(experience) => updateContent({ experience })}
        />
      )}

      {sectionId === "stats" && (
        <StatsEditor
          items={theme.content.stats}
          layout={style.layout || "row"}
          onLayoutChange={(layout) => updateStyle({ layout })}
          onChange={(stats) => updateContent({ stats })}
        />
      )}

      {sectionId === "contact" && (
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
      )}

      {sectionId === "contactform" && (
        <PanelSection title="Form intro text">
          <textarea
            value={theme.content.contactFormNote}
            onChange={(e) =>
              updateTheme({ content: { ...theme.content, contactFormNote: e.target.value } })
            }
            rows={3}
            className="input-field text-sm resize-y"
          />
          <p className="text-xs mt-2" style={{ color: "var(--app-text-muted)" }}>
            Messages appear in Dashboard → Messages.
          </p>
        </PanelSection>
      )}

      {sectionId === "resume" && (
        <PanelSection title="Description">
          <textarea
            value={theme.content.resumeText}
            onChange={(e) => updateContent({ resumeText: e.target.value })}
            rows={3}
            className="input-field text-sm resize-y"
          />
          <p className="text-xs mt-2" style={{ color: "var(--app-text-muted)" }}>
            Upload your CV in Dashboard → Profile. It will appear here automatically.
          </p>
        </PanelSection>
      )}

      {sectionId === "cta" && (
        <CtaEditor cta={theme.content.cta} onChange={(cta) => updateContent({ cta })} />
      )}

      {sectionId === "projects" && (
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
      )}

      {sectionId === "skills" && (
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
      )}
    </div>
  );
}

function ExperienceEditor({
  items,
  layout,
  onLayoutChange,
  onChange,
}: {
  items: ExperienceItem[];
  layout: string;
  onLayoutChange: (l: string) => void;
  onChange: (items: ExperienceItem[]) => void;
}) {
  function updateItem(id: string, patch: Partial<ExperienceItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addItem() {
    onChange([
      ...items,
      { id: `exp-${Date.now()}`, role: "", company: "", period: "", description: "" },
    ]);
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  return (
    <>
      <PanelSection title="Layout style">
        <OptionGroup
          value={layout}
          options={[
            { value: "timeline", label: "Timeline" },
            { value: "cards", label: "Cards" },
          ]}
          onChange={onLayoutChange}
        />
      </PanelSection>
      <PanelSection title="Experience entries">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border space-y-2"
              style={{ borderColor: "var(--app-border)", background: "var(--app-input-bg)" }}
            >
              <input placeholder="Role" value={item.role} onChange={(e) => updateItem(item.id, { role: e.target.value })} className="input-field text-xs" />
              <input placeholder="Company" value={item.company} onChange={(e) => updateItem(item.id, { company: e.target.value })} className="input-field text-xs" />
              <input placeholder="Period (e.g. 2020 — 2023)" value={item.period} onChange={(e) => updateItem(item.id, { period: e.target.value })} className="input-field text-xs" />
              <textarea placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} rows={2} className="input-field text-xs resize-y" />
              <button type="button" onClick={() => removeItem(item.id)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addItem} className="text-xs" style={{ color: "var(--app-primary)" }}>+ Add experience</button>
        </div>
      </PanelSection>
    </>
  );
}

function StatsEditor({
  items,
  layout,
  onLayoutChange,
  onChange,
}: {
  items: StatItem[];
  layout: string;
  onLayoutChange: (l: string) => void;
  onChange: (items: StatItem[]) => void;
}) {
  function updateItem(id: string, patch: Partial<StatItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addItem() {
    onChange([...items, { id: `stat-${Date.now()}`, label: "", value: "" }]);
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  return (
    <>
      <PanelSection title="Layout style">
        <OptionGroup
          value={layout}
          options={[
            { value: "row", label: "Row" },
            { value: "grid", label: "Grid" },
          ]}
          onChange={onLayoutChange}
        />
      </PanelSection>
      <PanelSection title="Stats">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-2 items-center">
              <input placeholder="Value" value={item.value} onChange={(e) => updateItem(item.id, { value: e.target.value })} className="input-field text-xs w-20" />
              <input placeholder="Label" value={item.label} onChange={(e) => updateItem(item.id, { label: e.target.value })} className="input-field text-xs flex-1" />
              <button type="button" onClick={() => removeItem(item.id)} className="text-red-400 px-1"><AppIcon name="x" size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={addItem} className="text-xs" style={{ color: "var(--app-primary)" }}>+ Add stat</button>
        </div>
      </PanelSection>
    </>
  );
}

function CtaEditor({
  cta,
  onChange,
}: {
  cta: PortfolioTheme["content"]["cta"];
  onChange: (cta: PortfolioTheme["content"]["cta"]) => void;
}) {
  return (
    <PanelSection title="Call to action content">
      <div className="space-y-3">
        <input placeholder="Headline" value={cta.headline} onChange={(e) => onChange({ ...cta, headline: e.target.value })} className="input-field text-sm" />
        <textarea placeholder="Subtext" value={cta.subtext} onChange={(e) => onChange({ ...cta, subtext: e.target.value })} rows={2} className="input-field text-sm resize-y" />
        <input placeholder="Button text" value={cta.buttonText} onChange={(e) => onChange({ ...cta, buttonText: e.target.value })} className="input-field text-sm" />
        <input placeholder="Button URL" value={cta.buttonUrl} onChange={(e) => onChange({ ...cta, buttonUrl: e.target.value })} className="input-field text-sm" />
      </div>
    </PanelSection>
  );
}
