"use client";

import { useRef, useState } from "react";
import type {
  PortfolioTheme,
  ExperienceItem,
  EducationItem,
  StatItem,
  TechStackItem,
  CaseStudyItem,
  ServiceItem,
  ArticleItem,
  OpenSourceItem,
  AwardItem,
  LanguageItem,
  VideoItem,
} from "@/lib/portfolio-theme";
import type { PlatformData, Testimonial, GalleryItem } from "@/lib/platform-data";
import type { PersonalInfo } from "@/lib/types";
import { AppIcon } from "@/components/icons/AppIcons";
import { PanelSection } from "./EditorShared";

function Card({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove?: () => void;
}) {
  return (
    <div
      className="p-3 rounded-lg border space-y-2 relative"
      style={{ borderColor: "var(--app-border)", background: "var(--app-input-bg)" }}
    >
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 text-red-400 hover:text-red-300"
          aria-label="Remove"
        >
          <AppIcon name="x" size={14} />
        </button>
      )}
      {children}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-xs" style={{ color: "var(--app-primary)" }}>
      + {label}
    </button>
  );
}

function Field({
  placeholder,
  value,
  onChange,
  multiline,
  type = "text",
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  const cls = "input-field text-xs w-full";
  if (multiline) {
    return (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className={`${cls} resize-y`}
      />
    );
  }
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cls}
    />
  );
}

export function AboutContentEditor({
  theme,
  personalInfo,
  onThemeChange,
  onProfileChange,
}: {
  theme: PortfolioTheme;
  personalInfo: PersonalInfo;
  onThemeChange: (patch: Partial<PortfolioTheme["content"]>) => void;
  onProfileChange: (patch: Partial<PersonalInfo>) => void;
}) {
  const summary = theme.content.aboutSummary ?? personalInfo.professionalSummary ?? "";
  const bio = theme.content.aboutBio ?? personalInfo.bio ?? "";

  return (
    <PanelSection title="About content">
      <div className="space-y-3">
        <Field
          placeholder="Professional summary"
          value={summary}
          onChange={(v) => {
            onThemeChange({ aboutSummary: v });
            onProfileChange({ professionalSummary: v });
          }}
          multiline
        />
        <Field
          placeholder="Full bio"
          value={bio}
          onChange={(v) => {
            onThemeChange({ aboutBio: v });
            onProfileChange({ bio: v });
          }}
          multiline
        />
        <p className="text-xs" style={{ color: "var(--app-text-muted)" }}>
          Also editable in Dashboard → Profile.
        </p>
      </div>
    </PanelSection>
  );
}

export function SkillsOverviewEditor({
  theme,
  personalInfo,
  onThemeChange,
  onProfileChange,
}: {
  theme: PortfolioTheme;
  personalInfo: PersonalInfo;
  onThemeChange: (patch: Partial<PortfolioTheme["content"]>) => void;
  onProfileChange: (patch: Partial<PersonalInfo>) => void;
}) {
  const overview = theme.content.skillsOverview ?? personalInfo.skillsOverview ?? "";
  return (
    <PanelSection title="Skills intro text">
      <Field
        placeholder="Overview paragraph above skills"
        value={overview}
        onChange={(v) => {
          onThemeChange({ skillsOverview: v });
          onProfileChange({ skillsOverview: v });
        }}
        multiline
      />
      <p className="text-xs mt-2" style={{ color: "var(--app-text-muted)" }}>
        Manage individual skills in Dashboard → Skills.
      </p>
    </PanelSection>
  );
}

export function ExperienceEditor({
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

  return (
    <>
      <PanelSection title="Layout style">
        <div className="flex flex-wrap gap-1">
          {(["timeline", "cards"] as const).map((l) => (
            <LayoutChip key={l} active={layout === l} label={l} onClick={() => onLayoutChange(l)} />
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Experience entries">
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} onRemove={() => onChange(items.filter((i) => i.id !== item.id))}>
              <Field placeholder="Role" value={item.role} onChange={(v) => updateItem(item.id, { role: v })} />
              <Field placeholder="Company" value={item.company} onChange={(v) => updateItem(item.id, { company: v })} />
              <Field placeholder="Period" value={item.period} onChange={(v) => updateItem(item.id, { period: v })} />
              <Field placeholder="Description" value={item.description} onChange={(v) => updateItem(item.id, { description: v })} multiline />
            </Card>
          ))}
          <AddButton
            label="Add experience"
            onClick={() =>
              onChange([...items, { id: `exp-${Date.now()}`, role: "", company: "", period: "", description: "" }])
            }
          />
        </div>
      </PanelSection>
    </>
  );
}

export function EducationEditor({
  items,
  onChange,
}: {
  items: EducationItem[];
  onChange: (items: EducationItem[]) => void;
}) {
  function updateItem(id: string, patch: Partial<EducationItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <PanelSection title="Education entries">
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} onRemove={() => onChange(items.filter((i) => i.id !== item.id))}>
            <Field placeholder="Degree" value={item.degree} onChange={(v) => updateItem(item.id, { degree: v })} />
            <Field placeholder="School" value={item.school} onChange={(v) => updateItem(item.id, { school: v })} />
            <Field placeholder="Period" value={item.period} onChange={(v) => updateItem(item.id, { period: v })} />
            <Field placeholder="Description" value={item.description} onChange={(v) => updateItem(item.id, { description: v })} multiline />
          </Card>
        ))}
        <AddButton
          label="Add education"
          onClick={() =>
            onChange([...items, { id: `edu-${Date.now()}`, degree: "", school: "", period: "", description: "" }])
          }
        />
      </div>
    </PanelSection>
  );
}

export function StatsEditor({
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

  return (
    <>
      <PanelSection title="Layout style">
        <div className="flex flex-wrap gap-1">
          {(["row", "grid"] as const).map((l) => (
            <LayoutChip key={l} active={layout === l} label={l} onClick={() => onLayoutChange(l)} />
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Stats">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-2 items-center">
              <Field placeholder="Value" value={item.value} onChange={(v) => updateItem(item.id, { value: v })} />
              <Field placeholder="Label" value={item.label} onChange={(v) => updateItem(item.id, { label: v })} />
              <button type="button" onClick={() => onChange(items.filter((i) => i.id !== item.id))} className="text-red-400 px-1">
                <AppIcon name="x" size={14} />
              </button>
            </div>
          ))}
          <AddButton label="Add stat" onClick={() => onChange([...items, { id: `stat-${Date.now()}`, label: "", value: "" }])} />
        </div>
      </PanelSection>
    </>
  );
}

export function TechStackEditor({ items, onChange }: { items: TechStackItem[]; onChange: (items: TechStackItem[]) => void }) {
  function updateItem(id: string, patch: Partial<TechStackItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  return (
    <PanelSection title="Tech stack items">
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2 items-center">
            <Field placeholder="Badge" value={item.icon} onChange={(v) => updateItem(item.id, { icon: v })} />
            <Field placeholder="Name" value={item.name} onChange={(v) => updateItem(item.id, { name: v })} />
            <button type="button" onClick={() => onChange(items.filter((i) => i.id !== item.id))} className="text-red-400 px-1">
              <AppIcon name="x" size={14} />
            </button>
          </div>
        ))}
        <AddButton label="Add technology" onClick={() => onChange([...items, { id: `ts-${Date.now()}`, name: "", icon: "" }])} />
      </div>
    </PanelSection>
  );
}

export function ServicesEditor({ items, onChange }: { items: ServiceItem[]; onChange: (items: ServiceItem[]) => void }) {
  function updateItem(id: string, patch: Partial<ServiceItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  return (
    <PanelSection title="Service cards">
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} onRemove={() => onChange(items.filter((i) => i.id !== item.id))}>
            <Field placeholder="Badge (e.g. Dev)" value={item.icon} onChange={(v) => updateItem(item.id, { icon: v })} />
            <Field placeholder="Title" value={item.title} onChange={(v) => updateItem(item.id, { title: v })} />
            <Field placeholder="Description" value={item.description} onChange={(v) => updateItem(item.id, { description: v })} multiline />
            <Field placeholder="Price (optional)" value={item.price || ""} onChange={(v) => updateItem(item.id, { price: v })} />
          </Card>
        ))}
        <AddButton
          label="Add service"
          onClick={() => onChange([...items, { id: `svc-${Date.now()}`, title: "", description: "", icon: "" }])}
        />
      </div>
    </PanelSection>
  );
}

export function CaseStudiesEditor({ items, onChange }: { items: CaseStudyItem[]; onChange: (items: CaseStudyItem[]) => void }) {
  function updateItem(id: string, patch: Partial<CaseStudyItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  return (
    <PanelSection title="Case studies">
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} onRemove={() => onChange(items.filter((i) => i.id !== item.id))}>
            <Field placeholder="Title" value={item.title} onChange={(v) => updateItem(item.id, { title: v })} />
            <Field placeholder="Client" value={item.client} onChange={(v) => updateItem(item.id, { client: v })} />
            <Field placeholder="Image URL" value={item.imageUrl || ""} onChange={(v) => updateItem(item.id, { imageUrl: v })} />
            <Field placeholder="Challenge" value={item.challenge} onChange={(v) => updateItem(item.id, { challenge: v })} multiline />
            <Field placeholder="Solution" value={item.solution} onChange={(v) => updateItem(item.id, { solution: v })} multiline />
            <Field placeholder="Results" value={item.results} onChange={(v) => updateItem(item.id, { results: v })} multiline />
            <Field
              placeholder="Tags (comma-separated)"
              value={item.tags.join(", ")}
              onChange={(v) => updateItem(item.id, { tags: v.split(",").map((t) => t.trim()).filter(Boolean) })}
            />
          </Card>
        ))}
        <AddButton
          label="Add case study"
          onClick={() =>
            onChange([
              ...items,
              {
                id: `cs-${Date.now()}`,
                title: "",
                client: "",
                challenge: "",
                solution: "",
                results: "",
                tags: [],
              },
            ])
          }
        />
      </div>
    </PanelSection>
  );
}

export function BlogEditor({ items, onChange }: { items: ArticleItem[]; onChange: (items: ArticleItem[]) => void }) {
  function updateItem(id: string, patch: Partial<ArticleItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  return (
    <PanelSection title="Blog posts">
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} onRemove={() => onChange(items.filter((i) => i.id !== item.id))}>
            <Field placeholder="Title" value={item.title} onChange={(v) => updateItem(item.id, { title: v })} />
            <Field placeholder="Excerpt" value={item.excerpt} onChange={(v) => updateItem(item.id, { excerpt: v })} multiline />
            <Field placeholder="URL" value={item.url} onChange={(v) => updateItem(item.id, { url: v })} />
            <Field placeholder="Date" value={item.date} onChange={(v) => updateItem(item.id, { date: v })} />
          </Card>
        ))}
        <AddButton
          label="Add article"
          onClick={() => onChange([...items, { id: `art-${Date.now()}`, title: "", excerpt: "", url: "", date: "" }])}
        />
      </div>
    </PanelSection>
  );
}

export function OpenSourceEditor({ items, onChange }: { items: OpenSourceItem[]; onChange: (items: OpenSourceItem[]) => void }) {
  function updateItem(id: string, patch: Partial<OpenSourceItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  return (
    <PanelSection title="Repositories">
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} onRemove={() => onChange(items.filter((i) => i.id !== item.id))}>
            <Field placeholder="Name" value={item.name} onChange={(v) => updateItem(item.id, { name: v })} />
            <Field placeholder="Description" value={item.description} onChange={(v) => updateItem(item.id, { description: v })} multiline />
            <Field placeholder="URL" value={item.url} onChange={(v) => updateItem(item.id, { url: v })} />
            <div className="flex gap-2">
              <Field
                placeholder="Stars"
                value={String(item.stars)}
                onChange={(v) => updateItem(item.id, { stars: parseInt(v, 10) || 0 })}
                type="number"
              />
              <Field placeholder="Language" value={item.language} onChange={(v) => updateItem(item.id, { language: v })} />
            </div>
          </Card>
        ))}
        <AddButton
          label="Add repository"
          onClick={() =>
            onChange([...items, { id: `oss-${Date.now()}`, name: "", description: "", url: "", stars: 0, language: "" }])
          }
        />
      </div>
    </PanelSection>
  );
}

export function AwardsEditor({ items, onChange }: { items: AwardItem[]; onChange: (items: AwardItem[]) => void }) {
  function updateItem(id: string, patch: Partial<AwardItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  return (
    <PanelSection title="Awards">
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} onRemove={() => onChange(items.filter((i) => i.id !== item.id))}>
            <Field placeholder="Title" value={item.title} onChange={(v) => updateItem(item.id, { title: v })} />
            <Field placeholder="Issuer" value={item.issuer} onChange={(v) => updateItem(item.id, { issuer: v })} />
            <Field placeholder="Year" value={item.year} onChange={(v) => updateItem(item.id, { year: v })} />
            <Field placeholder="Image URL (optional)" value={item.imageUrl || ""} onChange={(v) => updateItem(item.id, { imageUrl: v })} />
          </Card>
        ))}
        <AddButton
          label="Add award"
          onClick={() => onChange([...items, { id: `awd-${Date.now()}`, title: "", issuer: "", year: "" }])}
        />
      </div>
    </PanelSection>
  );
}

export function LanguagesEditor({ items, onChange }: { items: LanguageItem[]; onChange: (items: LanguageItem[]) => void }) {
  function updateItem(id: string, patch: Partial<LanguageItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  return (
    <PanelSection title="Languages">
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2 items-center">
            <Field placeholder="Language" value={item.name} onChange={(v) => updateItem(item.id, { name: v })} />
            <Field placeholder="Level" value={item.level} onChange={(v) => updateItem(item.id, { level: v })} />
            <button type="button" onClick={() => onChange(items.filter((i) => i.id !== item.id))} className="text-red-400 px-1">
              <AppIcon name="x" size={14} />
            </button>
          </div>
        ))}
        <AddButton label="Add language" onClick={() => onChange([...items, { id: `lang-${Date.now()}`, name: "", level: "" }])} />
      </div>
    </PanelSection>
  );
}

export function CtaEditor({
  cta,
  onChange,
}: {
  cta: PortfolioTheme["content"]["cta"];
  onChange: (cta: PortfolioTheme["content"]["cta"]) => void;
}) {
  return (
    <PanelSection title="Call to action content">
      <div className="space-y-3">
        <Field placeholder="Headline" value={cta.headline} onChange={(v) => onChange({ ...cta, headline: v })} />
        <Field placeholder="Subtext" value={cta.subtext} onChange={(v) => onChange({ ...cta, subtext: v })} multiline />
        <Field placeholder="Button text" value={cta.buttonText} onChange={(v) => onChange({ ...cta, buttonText: v })} />
        <Field placeholder="Button URL" value={cta.buttonUrl} onChange={(v) => onChange({ ...cta, buttonUrl: v })} />
      </div>
    </PanelSection>
  );
}

export function VideosEditor({ items, onChange, legacyUrl }: { items: VideoItem[]; onChange: (items: VideoItem[]) => void; legacyUrl?: string }) {
  function updateItem(id: string, patch: Partial<VideoItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  return (
    <PanelSection title="Videos">
      <p className="text-xs mb-3" style={{ color: "var(--app-text-muted)" }}>
        YouTube or Vimeo URLs. {legacyUrl && !items.length ? "Legacy URL will show until you add videos here." : ""}
      </p>
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} onRemove={() => onChange(items.filter((i) => i.id !== item.id))}>
            <Field placeholder="Video URL" value={item.url} onChange={(v) => updateItem(item.id, { url: v })} />
            <Field placeholder="Title (optional)" value={item.title || ""} onChange={(v) => updateItem(item.id, { title: v })} />
          </Card>
        ))}
        <AddButton label="Add video" onClick={() => onChange([...items, { id: `vid-${Date.now()}`, url: "" }])} />
      </div>
    </PanelSection>
  );
}

export function TestimonialsEditor({
  items,
  onChange,
}: {
  items: Testimonial[];
  onChange: (items: Testimonial[]) => void;
}) {
  function updateItem(id: string, patch: Partial<Testimonial>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  return (
    <PanelSection title="Testimonial cards">
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} onRemove={() => onChange(items.filter((i) => i.id !== item.id))}>
            <Field placeholder="Name" value={item.name} onChange={(v) => updateItem(item.id, { name: v })} />
            <Field placeholder="Role" value={item.role} onChange={(v) => updateItem(item.id, { role: v })} />
            <Field placeholder="Company" value={item.company} onChange={(v) => updateItem(item.id, { company: v })} />
            <Field placeholder="Quote" value={item.quote} onChange={(v) => updateItem(item.id, { quote: v })} multiline />
            <Field placeholder="Avatar URL" value={item.avatarUrl || ""} onChange={(v) => updateItem(item.id, { avatarUrl: v })} />
            <Field
              placeholder="Rating (1-5)"
              value={item.rating ? String(item.rating) : ""}
              onChange={(v) => updateItem(item.id, { rating: Math.min(5, Math.max(0, parseInt(v, 10) || 0)) || undefined })}
              type="number"
            />
          </Card>
        ))}
        <AddButton
          label="Add testimonial"
          onClick={() =>
            onChange([...items, { id: `t-${Date.now()}`, name: "", role: "", company: "", quote: "" }])
          }
        />
      </div>
    </PanelSection>
  );
}

export function GalleryEditor({
  items,
  onChange,
}: {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function updateItem(id: string, patch: Partial<GalleryItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("type", "gallery");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (res.ok && json.url) {
        onChange([...items, { id: `gal-${Date.now()}`, url: json.url, caption: "" }]);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <PanelSection title="Gallery images">
      <div className="mb-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
          }}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="text-xs px-3 py-2 rounded-lg border w-full"
          style={{ borderColor: "var(--app-border)", color: "var(--app-primary)" }}
        >
          {uploading ? "Uploading…" : "+ Upload image"}
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} onRemove={() => onChange(items.filter((i) => i.id !== item.id))}>
            <Field placeholder="Image URL" value={item.url} onChange={(v) => updateItem(item.id, { url: v })} />
            <Field placeholder="Caption" value={item.caption || ""} onChange={(v) => updateItem(item.id, { caption: v })} />
            {item.url && (
              <img src={item.url} alt="" className="w-full h-20 object-cover rounded-md mt-1" />
            )}
          </Card>
        ))}
        <AddButton label="Add image" onClick={() => onChange([...items, { id: `gal-${Date.now()}`, url: "" }])} />
      </div>
    </PanelSection>
  );
}

export function CustomHtmlEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <PanelSection title="Custom HTML">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        className="input-field text-xs resize-y font-mono w-full"
        placeholder="<div>Your custom content</div>"
      />
      <p className="text-xs mt-2" style={{ color: "var(--app-text-muted)" }}>
        HTML is isolated to this section only — global styles like <code className="text-[10px]">body</code> or{" "}
        <code className="text-[10px]">*</code> won&apos;t affect the editor. Use <code className="text-[10px]">&lt;style&gt;</code> freely.
      </p>
    </PanelSection>
  );
}

function LayoutChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors"
      style={
        active
          ? { background: "var(--app-primary)", color: "#fff", borderColor: "var(--app-primary)" }
          : { background: "var(--app-input-bg)", color: "var(--app-text-muted)", borderColor: "var(--app-border)" }
      }
    >
      {label}
    </button>
  );
}

export function ProjectsNote() {
  return (
    <PanelSection title="Projects">
      <p className="text-xs" style={{ color: "var(--app-text-muted)" }}>
        Add and edit projects in{" "}
        <a href="/dashboard/projects" className="underline" style={{ color: "var(--app-primary)" }}>
          Dashboard → Projects
        </a>
        . Use layout options above to change how they display.
      </p>
    </PanelSection>
  );
}

export function SkillsNote() {
  return (
    <PanelSection title="Skills">
      <p className="text-xs" style={{ color: "var(--app-text-muted)" }}>
        Add and edit skills in{" "}
        <a href="/dashboard/skills" className="underline" style={{ color: "var(--app-primary)" }}>
          Dashboard → Skills
        </a>
        . Use layout options above to change how they display.
      </p>
    </PanelSection>
  );
}
