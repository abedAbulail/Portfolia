export type SectionId =
  | "about"
  | "experience"
  | "stats"
  | "skills"
  | "projects"
  | "contact"
  | "contactform"
  | "resume"
  | "cta";

/** Sections shown by default on new accounts */
export const MAIN_SECTIONS: SectionId[] = ["about", "skills", "projects"];

/** Optional sections users can add from the editor */
export const OPTIONAL_SECTIONS: SectionId[] = [
  "experience",
  "stats",
  "contact",
  "contactform",
  "resume",
  "cta",
];

export type HeroStyle = "centered" | "split" | "minimal";
export type ContentWidth = "narrow" | "medium" | "wide";
export type ProjectsLayout = "list" | "grid" | "cards";
export type SkillsLayout = "grid" | "list" | "tags";
export type Spacing = "compact" | "normal" | "relaxed";
export type BorderRadius = "none" | "md" | "lg" | "full";
export type HeadingFont = "serif" | "sans" | "mono";
export type TextAlign = "left" | "center" | "right";
export type SectionBackground = "transparent" | "surface" | "accent";
export type SectionPadding = "none" | "sm" | "md" | "lg";

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
}

export interface SectionStyle {
  alignment: TextAlign;
  padding: SectionPadding;
  background: SectionBackground;
  showDivider: boolean;
  layout?: string;
}

export interface PortfolioContent {
  experience: ExperienceItem[];
  stats: StatItem[];
  cta: {
    headline: string;
    subtext: string;
    buttonText: string;
    buttonUrl: string;
  };
  contactNote: string;
  contactFormNote: string;
  resumeText: string;
}

export interface ProfileI18n {
  bio?: string;
  professionalSummary?: string;
  skillsOverview?: string;
  currentPosition?: string;
}

export interface HeroSettings {
  backgroundImage?: string;
  gradientFrom?: string;
  gradientTo?: string;
  overlayOpacity?: number;
}

export interface PortfolioTheme {
  activeThemeId?: string;
  defaultLocale?: "en" | "ar";
  profileI18n?: { en?: ProfileI18n; ar?: ProfileI18n };
  hero?: HeroSettings;
  colors: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
    textMuted: string;
  };
  layout: {
    heroStyle: HeroStyle;
    heroAlignment: TextAlign;
    contentWidth: ContentWidth;
    projectsLayout: ProjectsLayout;
    skillsLayout: SkillsLayout;
    spacing: Spacing;
    borderRadius: BorderRadius;
  };
  sections: {
    order: SectionId[];
    /** @deprecated use order; kept for migration */
    visibility?: Partial<Record<SectionId, boolean>>;
    titles: Record<SectionId, string>;
  };
  sectionStyles: Record<SectionId, SectionStyle>;
  content: PortfolioContent;
  projectOrder: string[];
  skillOrder: string[];
  features: {
    showHeroPhoto: boolean;
    showSocialLinks: boolean;
    showProjectImages: boolean;
    showSkillLevels: boolean;
    showProjectStatus: boolean;
    showFooter: boolean;
    showGradient: boolean;
    showResumeInHero: boolean;
  };
  typography: {
    headingFont: HeadingFont;
  };
}

export const ALL_SECTIONS: SectionId[] = [
  ...MAIN_SECTIONS,
  ...OPTIONAL_SECTIONS,
];

export const SECTION_LABELS: Record<SectionId, string> = {
  about: "About",
  experience: "Experience",
  stats: "Stats / Highlights",
  skills: "Skills",
  projects: "Projects",
  contact: "Contact Info",
  contactform: "Contact Form",
  resume: "Resume / CV",
  cta: "Call to Action",
};

export function getAvailableSections(order: SectionId[]): SectionId[] {
  return ALL_SECTIONS.filter((id) => !order.includes(id));
}

export function isSectionActive(theme: PortfolioTheme, id: SectionId): boolean {
  return theme.sections.order.includes(id);
}

export const DEFAULT_CONTENT: PortfolioContent = {
  experience: [
    {
      id: "exp-1",
      role: "Senior Developer",
      company: "Tech Company",
      period: "2022 — Present",
      description: "Led development of key product features and mentored junior developers.",
    },
    {
      id: "exp-2",
      role: "Full Stack Developer",
      company: "Startup Inc.",
      period: "2020 — 2022",
      description: "Built and shipped multiple web applications from concept to production.",
    },
  ],
  stats: [
    { id: "stat-1", label: "Years Experience", value: "5+" },
    { id: "stat-2", label: "Projects Completed", value: "20+" },
    { id: "stat-3", label: "Happy Clients", value: "15+" },
    { id: "stat-4", label: "Technologies", value: "12+" },
  ],
  cta: {
    headline: "Let's work together",
    subtext: "I'm open to freelance projects, collaborations, and full-time opportunities.",
    buttonText: "Get in touch",
    buttonUrl: "mailto:hello@example.com",
  },
  contactNote: "Feel free to reach out — I'm always happy to connect!",
  contactFormNote: "Send me a message and I'll respond as soon as possible.",
  resumeText: "Download my full resume to learn more about my experience and qualifications.",
};

export const DEFAULT_SECTION_STYLES: Record<SectionId, SectionStyle> = {
  about: { alignment: "left", padding: "md", background: "transparent", showDivider: true },
  experience: {
    alignment: "left",
    padding: "md",
    background: "surface",
    showDivider: true,
    layout: "timeline",
  },
  stats: {
    alignment: "center",
    padding: "md",
    background: "accent",
    showDivider: false,
    layout: "row",
  },
  skills: { alignment: "left", padding: "md", background: "transparent", showDivider: true },
  projects: { alignment: "left", padding: "md", background: "transparent", showDivider: true },
  contact: {
    alignment: "center",
    padding: "lg",
    background: "surface",
    showDivider: true,
    layout: "cards",
  },
  contactform: {
    alignment: "center",
    padding: "lg",
    background: "surface",
    showDivider: true,
    layout: "form",
  },
  resume: {
    alignment: "center",
    padding: "md",
    background: "transparent",
    showDivider: true,
    layout: "banner",
  },
  cta: {
    alignment: "center",
    padding: "lg",
    background: "accent",
    showDivider: false,
    layout: "banner",
  },
};

export const DEFAULT_HERO: HeroSettings = {
  backgroundImage: "",
  gradientFrom: "",
  gradientTo: "",
  overlayOpacity: 0.55,
};

export const DEFAULT_THEME: PortfolioTheme = {
  activeThemeId: "violet-pro",
  defaultLocale: "en",
  profileI18n: {},
  hero: structuredClone(DEFAULT_HERO),
  colors: {
    background: "#080b14",
    surface: "#111827",
    primary: "#8b5cf6",
    accent: "#6366f1",
    text: "#f1f5f9",
    textMuted: "#94a3b8",
  },
  layout: {
    heroStyle: "centered",
    heroAlignment: "center",
    contentWidth: "medium",
    projectsLayout: "list",
    skillsLayout: "grid",
    spacing: "normal",
    borderRadius: "lg",
  },
  sections: {
    order: [...MAIN_SECTIONS],
    titles: {
      about: "About",
      experience: "Experience",
      stats: "Highlights",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact",
      contactform: "Contact Me",
      resume: "Resume",
      cta: "Let's Connect",
    },
  },
  sectionStyles: structuredClone(DEFAULT_SECTION_STYLES),
  content: structuredClone(DEFAULT_CONTENT),
  projectOrder: [],
  skillOrder: [],
  features: {
    showHeroPhoto: true,
    showSocialLinks: true,
    showProjectImages: true,
    showSkillLevels: true,
    showProjectStatus: true,
    showFooter: true,
    showGradient: true,
    showResumeInHero: false,
  },
  typography: {
    headingFont: "serif",
  },
};

export const COLOR_PRESETS = [
  { name: "Violet Night", background: "#080b14", surface: "#111827", primary: "#8b5cf6", accent: "#6366f1", text: "#f1f5f9", textMuted: "#94a3b8" },
  { name: "Ocean Blue", background: "#0a1628", surface: "#0f2847", primary: "#0ea5e9", accent: "#06b6d4", text: "#f0f9ff", textMuted: "#7dd3fc" },
  { name: "Forest", background: "#0a120f", surface: "#142019", primary: "#10b981", accent: "#34d399", text: "#ecfdf5", textMuted: "#6ee7b7" },
  { name: "Sunset", background: "#1a0a0a", surface: "#2d1515", primary: "#f97316", accent: "#ef4444", text: "#fff7ed", textMuted: "#fdba74" },
  { name: "Rose Gold", background: "#120810", surface: "#1f1020", primary: "#ec4899", accent: "#f472b6", text: "#fdf2f8", textMuted: "#f9a8d4" },
  { name: "Minimal Light", background: "#fafafa", surface: "#ffffff", primary: "#18181b", accent: "#52525b", text: "#18181b", textMuted: "#71717a" },
];

function normalizeSectionOrder(order: SectionId[], legacyVisibility?: Partial<Record<SectionId, boolean>>): SectionId[] {
  const seen = new Set<SectionId>();
  let list = order.filter((id) => {
    if (!ALL_SECTIONS.includes(id) || seen.has(id)) return false;
    if (legacyVisibility && legacyVisibility[id] === false) return false;
    seen.add(id);
    return true;
  });
  if (list.length === 0) list = [...MAIN_SECTIONS];
  return list;
}

function normalizeTitles(titles: Partial<Record<SectionId, string>>): Record<SectionId, string> {
  return { ...DEFAULT_THEME.sections.titles, ...titles };
}

function normalizeSectionStyles(
  styles: Partial<Record<SectionId, Partial<SectionStyle>>>
): Record<SectionId, SectionStyle> {
  const result = structuredClone(DEFAULT_SECTION_STYLES);
  for (const id of ALL_SECTIONS) {
    if (styles[id]) result[id] = { ...result[id], ...styles[id] };
  }
  return result;
}

export function parseThemeSettings(raw?: string | null): PortfolioTheme {
  if (!raw?.trim()) return structuredClone(DEFAULT_THEME);
  try {
    const parsed = JSON.parse(raw) as Partial<PortfolioTheme>;
    return mergeTheme(DEFAULT_THEME, parsed);
  } catch {
    return structuredClone(DEFAULT_THEME);
  }
}

export function mergeTheme(base: PortfolioTheme, overrides: Partial<Omit<PortfolioTheme, "sectionStyles">> & { sectionStyles?: Partial<Record<SectionId, Partial<SectionStyle>>> }): PortfolioTheme {
  const mergedSections = overrides.sections ?? base.sections;
  const mergedFeatures = { ...base.features, ...overrides.features };

  return {
    activeThemeId: overrides.activeThemeId ?? base.activeThemeId,
    defaultLocale: overrides.defaultLocale ?? base.defaultLocale ?? "en",
    profileI18n: { ...base.profileI18n, ...overrides.profileI18n },
    hero: { ...DEFAULT_HERO, ...base.hero, ...overrides.hero },
    colors: { ...base.colors, ...overrides.colors },
    layout: { ...base.layout, ...overrides.layout },
    sections: {
      order: normalizeSectionOrder(
        mergedSections.order ?? base.sections.order,
        mergedSections.visibility ?? base.sections.visibility
      ),
      titles: normalizeTitles({ ...base.sections.titles, ...mergedSections.titles }),
    },
    sectionStyles: normalizeSectionStyles({
      ...base.sectionStyles,
      ...(overrides.sectionStyles ?? {}),
    }),
    content: {
      experience: overrides.content?.experience ?? base.content.experience,
      stats: overrides.content?.stats ?? base.content.stats,
      cta: { ...base.content.cta, ...overrides.content?.cta },
      contactNote: overrides.content?.contactNote ?? base.content.contactNote,
      contactFormNote: overrides.content?.contactFormNote ?? base.content.contactFormNote,
      resumeText: overrides.content?.resumeText ?? base.content.resumeText,
    },
    projectOrder: overrides.projectOrder ?? base.projectOrder,
    skillOrder: overrides.skillOrder ?? base.skillOrder,
    features: mergedFeatures,
    typography: { ...base.typography, ...overrides.typography },
  };
}

export function sortByOrder<T extends { id: string }>(items: T[], order: string[]): T[] {
  if (!order.length) return items;
  const map = new Map(items.map((item) => [item.id, item]));
  const sorted: T[] = [];
  for (const id of order) {
    const item = map.get(id);
    if (item) {
      sorted.push(item);
      map.delete(id);
    }
  }
  for (const item of map.values()) sorted.push(item);
  return sorted;
}

export function themeToCssVars(theme: PortfolioTheme): Record<string, string> {
  return {
    "--pf-bg": theme.colors.background,
    "--pf-surface": theme.colors.surface,
    "--pf-primary": theme.colors.primary,
    "--pf-accent": theme.colors.accent,
    "--pf-text": theme.colors.text,
    "--pf-text-muted": theme.colors.textMuted,
  };
}

export function getContentMaxWidth(width: ContentWidth): string {
  switch (width) {
    case "narrow": return "max-w-2xl";
    case "wide": return "max-w-6xl";
    default: return "max-w-4xl";
  }
}

export function getSpacingClass(spacing: Spacing): string {
  switch (spacing) {
    case "compact": return "space-y-8 py-10";
    case "relaxed": return "space-y-24 py-20";
    default: return "space-y-16 py-16";
  }
}

export function getRadiusClass(radius: BorderRadius): string {
  switch (radius) {
    case "none": return "rounded-none";
    case "md": return "rounded-lg";
    case "full": return "rounded-3xl";
    default: return "rounded-xl";
  }
}

export function getHeadingFontClass(font: HeadingFont): string {
  switch (font) {
    case "sans": return "font-sans";
    case "mono": return "font-mono";
    default: return "font-display";
  }
}

export function getAlignClass(align: TextAlign): string {
  switch (align) {
    case "center": return "text-center items-center";
    case "right": return "text-right items-end";
    default: return "text-left items-start";
  }
}

export function getSectionPaddingClass(padding: SectionPadding): string {
  switch (padding) {
    case "none": return "py-0 px-0";
    case "sm": return "py-6 px-4";
    case "lg": return "py-12 px-6";
    default: return "py-8 px-5";
  }
}

export function getSectionBackgroundStyle(
  bg: SectionBackground,
  theme: PortfolioTheme
): Record<string, string> | undefined {
  switch (bg) {
    case "surface":
      return { backgroundColor: `${theme.colors.surface}cc` };
    case "accent":
      return {
        background: `linear-gradient(135deg, ${theme.colors.primary}18, ${theme.colors.accent}12)`,
      };
    default:
      return undefined;
  }
}
