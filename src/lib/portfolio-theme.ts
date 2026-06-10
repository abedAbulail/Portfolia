export type SectionId =
  | "about"
  | "experience"
  | "stats"
  | "skills"
  | "projects"
  | "testimonials"
  | "gallery"
  | "video"
  | "timeline"
  | "techStack"
  | "caseStudy"
  | "services"
  | "blog"
  | "openSource"
  | "awards"
  | "languages"
  | "contact"
  | "contactform"
  | "resume"
  | "cta"
  | "location"
  | "customHtml";

/** A placed section on the page — same type can appear multiple times with unique ids. */
export interface SectionInstance {
  id: string;
  type: SectionId;
}

/** Sections shown by default on new accounts */
export const MAIN_SECTIONS: SectionId[] = ["about", "skills", "projects"];

/** Optional sections users can add from the editor */
export const OPTIONAL_SECTIONS: SectionId[] = [
  "experience",
  "stats",
  "testimonials",
  "gallery",
  "video",
  "contact",
  "contactform",
  "resume",
  "cta",
  "location",
  "customHtml",
  "timeline",
  "techStack",
  "caseStudy",
  "services",
  "blog",
  "openSource",
  "awards",
  "languages",
];

export type HeroStyle = "centered" | "split" | "minimal" | "animated" | "video" | "card3d";
export type FooterStyle = "default" | "minimal" | "rich" | "cta" | "map";
export type LiveChatType = "whatsapp" | "telegram";
export type ContentWidth = "narrow" | "medium" | "wide";
export type ProjectsLayout = "list" | "grid" | "cards";
export type SkillsLayout = "grid" | "list" | "tags";
export type Spacing = "compact" | "normal" | "relaxed";
export type BorderRadius = "none" | "md" | "lg" | "full";
export type HeadingFont = "serif" | "sans" | "mono";
export type FontSize = "sm" | "md" | "lg";
export type ShadowStyle = "none" | "sm" | "md" | "lg";
export type ColumnLayout = "1" | "2" | "3" | "full";
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

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  period: string;
  description: string;
}

export interface TechStackItem {
  id: string;
  name: string;
  icon: string;
}

export interface CaseStudyItem {
  id: string;
  title: string;
  client: string;
  challenge: string;
  solution: string;
  results: string;
  imageUrl?: string;
  tags: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  price?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
}

export interface OpenSourceItem {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  imageUrl?: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

export interface SectionColorOverrides {
  background?: string;
  text?: string;
  title?: string;
  primary?: string;
  accent?: string;
  border?: string;
}

export type SectionMinHeight = "auto" | "sm" | "md" | "lg" | "xl" | "screen";
export type SectionMediaHeight = "auto" | "sm" | "md" | "lg" | "xl";

export interface VideoItem {
  id: string;
  url: string;
  title?: string;
}

export interface SectionStyle {
  alignment: TextAlign;
  padding: SectionPadding;
  background: SectionBackground;
  showDivider: boolean;
  layout?: string;
  columns?: ColumnLayout;
  backgroundImage?: string;
  borderRadius?: BorderRadius;
  shadow?: ShadowStyle;
  /** Per-section width override; inherit = use global content width */
  maxWidth?: ContentWidth | "inherit";
  minHeight?: SectionMinHeight;
  /** Height for gallery images / video embeds */
  mediaHeight?: SectionMediaHeight;
  colors?: SectionColorOverrides;
}

export interface PortfolioContent {
  experience: ExperienceItem[];
  education: EducationItem[];
  stats: StatItem[];
  techStack: TechStackItem[];
  caseStudies: CaseStudyItem[];
  services: ServiceItem[];
  articles: ArticleItem[];
  openSource: OpenSourceItem[];
  awards: AwardItem[];
  languages: LanguageItem[];
  cta: {
    headline: string;
    subtext: string;
    buttonText: string;
    buttonUrl: string;
  };
  contactNote: string;
  contactFormNote: string;
  resumeText: string;
  locationNote: string;
  /** Google Maps embed URL or OpenStreetMap embed */
  locationMapUrl: string;
  /** Optional about overrides (falls back to profile fields) */
  aboutSummary?: string;
  aboutBio?: string;
  skillsOverview?: string;
  videos: VideoItem[];
}

export interface ProfileI18n {
  bio?: string;
  professionalSummary?: string;
  skillsOverview?: string;
  currentPosition?: string;
}

import type { BackgroundMode, BackgroundPattern } from "./background-utils";

export interface HeroSettings {
  backgroundMode?: BackgroundMode;
  backgroundColor?: string;
  backgroundPattern?: BackgroundPattern;
  backgroundImage?: string;
  videoBackgroundUrl?: string;
  gradientFrom?: string;
  gradientTo?: string;
  overlayOpacity?: number;
  particles?: boolean;
  glassEffect?: boolean;
  aurora?: boolean;
  waves?: boolean;
}

export interface FooterSettings {
  backgroundMode?: BackgroundMode;
  backgroundPattern?: BackgroundPattern;
  backgroundImage?: string;
  gradientFrom?: string;
  gradientTo?: string;
  overlayOpacity?: number;
  backgroundColor?: string;
  textColor?: string;
  textMutedColor?: string;
  accentColor?: string;
  borderColor?: string;
  showGradient?: boolean;
  alignment?: TextAlign;
  padding?: "sm" | "md" | "lg";
  /** Location label shown in map footer */
  mapLocation?: string;
  /** Custom embed URL; auto-generated from mapLocation when empty */
  mapEmbedUrl?: string;
  mapZoom?: number;
}

export interface PortfolioTheme {
  activeThemeId?: string;
  defaultLocale?: "en" | "ar";
  profileI18n?: { en?: ProfileI18n; ar?: ProfileI18n };
  hero?: HeroSettings;
  footer?: FooterSettings;
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
    order: SectionInstance[];
    /** @deprecated use order; kept for migration */
    visibility?: Partial<Record<SectionId, boolean>>;
    titles: Record<string, string>;
  };
  sectionStyles: Record<string, SectionStyle>;
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
    footerStyle: FooterStyle;
    showScrollProgress: boolean;
    showAvailabilityBadge: boolean;
    showVisitorsCounter: boolean;
    availableForWork: boolean;
    liveChatEnabled: boolean;
    liveChatType: LiveChatType;
    liveChatUrl: string;
  };
  typography: {
    headingFont: HeadingFont;
    fontSize?: FontSize;
  };
  pageColorMode?: "inherit" | "light" | "dark";
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
  testimonials: "Testimonials",
  gallery: "Gallery",
  video: "Video",
  contact: "Contact Info",
  contactform: "Contact Form",
  resume: "Resume / CV",
  cta: "Call to Action",
  location: "Location",
  customHtml: "Custom HTML",
  timeline: "Timeline",
  techStack: "Tech Stack",
  caseStudy: "Case Study",
  services: "Services",
  blog: "Blog / Articles",
  openSource: "Open Source",
  awards: "Awards & Certs",
  languages: "Languages",
};

export function isSectionInstance(value: unknown): value is SectionInstance {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as SectionInstance).id === "string" &&
    typeof (value as SectionInstance).type === "string" &&
    ALL_SECTIONS.includes((value as SectionInstance).type)
  );
}

/** Create a new section instance id for the given type. */
export function createSectionInstance(type: SectionId, order: SectionInstance[]): SectionInstance {
  const existingIds = new Set(order.map((item) => item.id));
  if (!existingIds.has(type)) return { id: type, type };

  let index = 2;
  while (existingIds.has(`${type}-${index}`)) index += 1;
  return { id: `${type}-${index}`, type };
}

export function getInstanceLabel(
  instance: SectionInstance,
  order: SectionInstance[],
  titles: Record<string, string>
): string {
  const customTitle = titles[instance.id]?.trim();
  const base = SECTION_LABELS[instance.type];
  const duplicates = order.filter((item) => item.type === instance.type);
  if (customTitle && customTitle !== base) return customTitle;
  if (duplicates.length > 1) {
    const index = duplicates.findIndex((item) => item.id === instance.id) + 1;
    return `${base} ${index}`;
  }
  return base;
}

export function getSectionTitleForInstance(
  instance: SectionInstance,
  titles: Record<string, string>,
  sectionLabelFn?: (locale: import("@/lib/i18n").Locale, id: string) => string,
  locale?: import("@/lib/i18n").Locale
): string {
  const custom = titles[instance.id]?.trim();
  if (custom) return custom;
  if (sectionLabelFn && locale) {
    const localized = sectionLabelFn(locale, instance.type);
    if (localized) return localized;
  }
  return SECTION_LABELS[instance.type];
}

export function getSectionStyleForInstance(
  instance: SectionInstance,
  styles: Record<string, SectionStyle>
): SectionStyle {
  return (
    styles[instance.id] ??
    styles[instance.type] ?? {
      ...DEFAULT_SECTION_STYLES[instance.type],
    }
  );
}

/** Resolve page-level section order (instance ids) to full instances. */
export function resolveSectionOrder(
  themeOrder: SectionInstance[],
  pageSectionOrder?: string[]
): SectionInstance[] {
  if (!pageSectionOrder?.length) return themeOrder;

  const byId = new Map(themeOrder.map((item) => [item.id, item]));
  const resolved: SectionInstance[] = [];
  for (const entry of pageSectionOrder) {
    const byInstanceId = byId.get(entry);
    if (byInstanceId) {
      resolved.push(byInstanceId);
      continue;
    }
    if (ALL_SECTIONS.includes(entry as SectionId)) {
      const legacy = themeOrder.find((item) => item.type === entry && item.id === entry);
      if (legacy) resolved.push(legacy);
    }
  }
  return resolved.length ? resolved : themeOrder;
}

export function isSectionActive(theme: PortfolioTheme, type: SectionId): boolean {
  return theme.sections.order.some((item) => item.type === type);
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
  education: [
    {
      id: "edu-1",
      degree: "BSc Computer Science",
      school: "University",
      period: "2016 — 2020",
      description: "Focus on software engineering and web technologies.",
    },
  ],
  stats: [
    { id: "stat-1", label: "Years Experience", value: "5+" },
    { id: "stat-2", label: "Projects Completed", value: "20+" },
    { id: "stat-3", label: "Happy Clients", value: "15+" },
    { id: "stat-4", label: "Technologies", value: "12+" },
  ],
  techStack: [
    { id: "ts-1", name: "React", icon: "Re" },
    { id: "ts-2", name: "TypeScript", icon: "TS" },
    { id: "ts-3", name: "Node.js", icon: "Nd" },
    { id: "ts-4", name: "Next.js", icon: "Nx" },
  ],
  caseStudies: [
    {
      id: "cs-1",
      title: "Platform Redesign",
      client: "Retail Co.",
      challenge: "Legacy checkout caused high abandonment.",
      solution: "Rebuilt checkout with modern UX.",
      results: "Conversion increased 28%.",
      tags: ["UX", "React"],
    },
  ],
  services: [
    { id: "svc-1", title: "Web Development", description: "Full-stack apps.", icon: "Dev", price: "From $500" },
    { id: "svc-2", title: "UI/UX Design", description: "Interfaces that convert.", icon: "UX", price: "From $300" },
  ],
  articles: [
    { id: "art-1", title: "Building Scalable React Apps", excerpt: "Lessons from production.", url: "#", date: "2024-01-15" },
  ],
  openSource: [
    { id: "oss-1", name: "portfolio-kit", description: "Open source starter.", url: "https://github.com", stars: 128, language: "TypeScript" },
  ],
  awards: [
    { id: "awd-1", title: "AWS Certified Developer", issuer: "AWS", year: "2023" },
  ],
  languages: [
    { id: "lang-1", name: "English", level: "Native" },
    { id: "lang-2", name: "Arabic", level: "Fluent" },
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
  locationNote: "Find me here — open to local meetings and remote collaboration.",
  locationMapUrl: "",
  aboutSummary: "",
  aboutBio: "",
  skillsOverview: "",
  videos: [],
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
  projects: { alignment: "left", padding: "md", background: "transparent", showDivider: true, columns: "1" },
  testimonials: { alignment: "center", padding: "md", background: "surface", showDivider: true, layout: "cards", columns: "2" },
  gallery: { alignment: "center", padding: "md", background: "transparent", showDivider: true, layout: "grid", columns: "3" },
  video: { alignment: "center", padding: "md", background: "transparent", showDivider: true, layout: "embed", columns: "1" },
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
  location: {
    alignment: "center",
    padding: "md",
    background: "surface",
    showDivider: true,
    layout: "map",
  },
  customHtml: {
    alignment: "left",
    padding: "none",
    background: "transparent",
    showDivider: false,
    layout: "raw",
  },
  timeline: { alignment: "left", padding: "md", background: "surface", showDivider: true, layout: "interactive" },
  techStack: { alignment: "center", padding: "md", background: "transparent", showDivider: true, layout: "icons" },
  caseStudy: { alignment: "left", padding: "lg", background: "surface", showDivider: true, layout: "detailed" },
  services: { alignment: "center", padding: "md", background: "accent", showDivider: true, layout: "cards", columns: "3" },
  blog: { alignment: "left", padding: "md", background: "transparent", showDivider: true, layout: "list" },
  openSource: { alignment: "left", padding: "md", background: "transparent", showDivider: true, layout: "repos" },
  awards: { alignment: "center", padding: "md", background: "surface", showDivider: true, layout: "grid", columns: "2" },
  languages: { alignment: "center", padding: "md", background: "transparent", showDivider: true, layout: "bars" },
};

export const DEFAULT_HERO: HeroSettings = {
  backgroundImage: "",
  gradientFrom: "",
  gradientTo: "",
  overlayOpacity: 0.55,
};

export const DEFAULT_FOOTER: FooterSettings = {
  backgroundMode: "solid",
  backgroundPattern: "dots",
  backgroundImage: "",
  gradientFrom: "",
  gradientTo: "",
  overlayOpacity: 0.94,
  showGradient: true,
  alignment: "center",
  padding: "md",
  mapLocation: "",
  mapEmbedUrl: "",
  mapZoom: 14,
};

export function resolveFooterColors(theme: PortfolioTheme) {
  const footer = theme.footer ?? {};
  return {
    background: footer.backgroundColor ?? theme.colors.surface,
    text: footer.textColor ?? theme.colors.text,
    textMuted: footer.textMutedColor ?? theme.colors.textMuted,
    accent: footer.accentColor ?? theme.colors.primary,
    border: footer.borderColor ?? `${theme.colors.textMuted}20`,
    gradientFrom: footer.gradientFrom || theme.colors.primary,
    gradientTo: footer.gradientTo || theme.colors.accent,
  };
}

export function getFooterPaddingClass(padding: FooterSettings["padding"] = "md"): string {
  switch (padding) {
    case "sm":
      return "py-6";
    case "lg":
      return "py-14";
    default:
      return "py-10";
  }
}

export function getFooterAlignClass(alignment: TextAlign = "center"): string {
  switch (alignment) {
    case "left":
      return "text-left items-start";
    case "right":
      return "text-right items-end";
    default:
      return "text-center items-center";
  }
}

export const DEFAULT_THEME: PortfolioTheme = {
  activeThemeId: "violet-pro",
  defaultLocale: "en",
  profileI18n: {},
  hero: structuredClone(DEFAULT_HERO),
  footer: structuredClone(DEFAULT_FOOTER),
  colors: {
    background: "#06080f",
    surface: "#0c1018",
    primary: "#7c3aed",
    accent: "#4f46e5",
    text: "#e2e8f0",
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
    order: MAIN_SECTIONS.map((type) => ({ id: type, type })),
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
      location: "Location",
      testimonials: "Testimonials",
      gallery: "Gallery",
      video: "Video",
      customHtml: "Custom",
      timeline: "Timeline",
      techStack: "Tech Stack",
      caseStudy: "Case Study",
      services: "Services",
      blog: "Blog",
      openSource: "Open Source",
      awards: "Awards",
      languages: "Languages",
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
    footerStyle: "default",
    showScrollProgress: false,
    showAvailabilityBadge: false,
    showVisitorsCounter: false,
    availableForWork: true,
    liveChatEnabled: false,
    liveChatType: "whatsapp",
    liveChatUrl: "",
  },
  typography: {
    headingFont: "serif",
    fontSize: "md",
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

function normalizeSectionOrder(
  order: (SectionId | SectionInstance)[] | undefined,
  legacyVisibility?: Partial<Record<SectionId, boolean>>
): SectionInstance[] {
  if (!order?.length) {
    return MAIN_SECTIONS.map((type) => ({ id: type, type }));
  }

  const list: SectionInstance[] = [];
  const seenIds = new Set<string>();

  for (const entry of order) {
    let instance: SectionInstance | null = null;

    if (typeof entry === "string") {
      if (!ALL_SECTIONS.includes(entry)) continue;
      if (legacyVisibility && legacyVisibility[entry] === false) continue;
      instance = { id: entry, type: entry };
    } else if (isSectionInstance(entry)) {
      if (legacyVisibility && legacyVisibility[entry.type] === false) continue;
      instance = entry;
    }

    if (!instance || seenIds.has(instance.id)) continue;
    seenIds.add(instance.id);
    list.push(instance);
  }

  return list.length ? list : MAIN_SECTIONS.map((type) => ({ id: type, type }));
}

function normalizeTitles(
  titles: Partial<Record<string, string>>,
  order: SectionInstance[]
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const instance of order) {
    result[instance.id] =
      titles[instance.id]?.trim() ||
      titles[instance.type]?.trim() ||
      DEFAULT_THEME.sections.titles[instance.type as SectionId] ||
      SECTION_LABELS[instance.type];
  }
  return result;
}

function normalizeSectionStyles(
  styles: Partial<Record<string, Partial<SectionStyle>>>,
  order: SectionInstance[]
): Record<string, SectionStyle> {
  const result: Record<string, SectionStyle> = {};
  for (const instance of order) {
    const defaults = DEFAULT_SECTION_STYLES[instance.type];
    result[instance.id] = {
      ...defaults,
      ...(styles[instance.id] ?? styles[instance.type] ?? {}),
    };
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

export function mergeTheme(
  base: PortfolioTheme,
  overrides: Partial<Omit<PortfolioTheme, "sections" | "sectionStyles" | "features" | "content">> & {
    sections?: {
      order?: (SectionId | SectionInstance)[];
      titles?: Partial<Record<string, string>>;
      visibility?: Partial<Record<SectionId, boolean>>;
    };
    sectionStyles?: Partial<Record<string, Partial<SectionStyle>>>;
    features?: Partial<PortfolioTheme["features"]>;
    content?: Partial<PortfolioContent>;
  }
): PortfolioTheme {
  const mergedSections = overrides.sections ?? base.sections;
  const mergedFeatures = { ...DEFAULT_THEME.features, ...base.features, ...overrides.features };
  const order = normalizeSectionOrder(
    mergedSections.order ?? base.sections.order,
    mergedSections.visibility ?? base.sections.visibility
  );

  return {
    activeThemeId: overrides.activeThemeId ?? base.activeThemeId,
    defaultLocale: overrides.defaultLocale ?? base.defaultLocale ?? "en",
    profileI18n: { ...base.profileI18n, ...overrides.profileI18n },
    hero: { ...DEFAULT_HERO, ...base.hero, ...overrides.hero },
    footer: { ...DEFAULT_FOOTER, ...base.footer, ...overrides.footer },
    colors: { ...base.colors, ...overrides.colors },
    layout: { ...base.layout, ...overrides.layout },
    sections: {
      order,
      titles: normalizeTitles({ ...base.sections.titles, ...mergedSections.titles }, order),
    },
    sectionStyles: normalizeSectionStyles(
      {
        ...base.sectionStyles,
        ...(overrides.sectionStyles ?? {}),
      },
      order
    ),
    content: {
      experience: overrides.content?.experience ?? base.content.experience ?? DEFAULT_CONTENT.experience,
      education: overrides.content?.education ?? base.content.education ?? DEFAULT_CONTENT.education,
      stats: overrides.content?.stats ?? base.content.stats ?? DEFAULT_CONTENT.stats,
      techStack: overrides.content?.techStack ?? base.content.techStack ?? DEFAULT_CONTENT.techStack,
      caseStudies: overrides.content?.caseStudies ?? base.content.caseStudies ?? DEFAULT_CONTENT.caseStudies,
      services: overrides.content?.services ?? base.content.services ?? DEFAULT_CONTENT.services,
      articles: overrides.content?.articles ?? base.content.articles ?? DEFAULT_CONTENT.articles,
      openSource: overrides.content?.openSource ?? base.content.openSource ?? DEFAULT_CONTENT.openSource,
      awards: overrides.content?.awards ?? base.content.awards ?? DEFAULT_CONTENT.awards,
      languages: overrides.content?.languages ?? base.content.languages ?? DEFAULT_CONTENT.languages,
      cta: { ...DEFAULT_CONTENT.cta, ...base.content.cta, ...overrides.content?.cta },
      contactNote: overrides.content?.contactNote ?? base.content.contactNote ?? DEFAULT_CONTENT.contactNote,
      contactFormNote: overrides.content?.contactFormNote ?? base.content.contactFormNote ?? DEFAULT_CONTENT.contactFormNote,
      resumeText: overrides.content?.resumeText ?? base.content.resumeText ?? DEFAULT_CONTENT.resumeText,
      locationNote: overrides.content?.locationNote ?? base.content.locationNote ?? DEFAULT_CONTENT.locationNote,
      locationMapUrl: overrides.content?.locationMapUrl ?? base.content.locationMapUrl ?? DEFAULT_CONTENT.locationMapUrl,
      aboutSummary: overrides.content?.aboutSummary ?? base.content.aboutSummary ?? DEFAULT_CONTENT.aboutSummary,
      aboutBio: overrides.content?.aboutBio ?? base.content.aboutBio ?? DEFAULT_CONTENT.aboutBio,
      skillsOverview: overrides.content?.skillsOverview ?? base.content.skillsOverview ?? DEFAULT_CONTENT.skillsOverview,
      videos: overrides.content?.videos ?? base.content.videos ?? DEFAULT_CONTENT.videos,
    },
    projectOrder: overrides.projectOrder ?? base.projectOrder,
    skillOrder: overrides.skillOrder ?? base.skillOrder,
    features: mergedFeatures,
    typography: { ...base.typography, ...overrides.typography, fontSize: overrides.typography?.fontSize ?? base.typography.fontSize ?? "md" },
    pageColorMode: overrides.pageColorMode ?? base.pageColorMode,
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

export function getShadowStyle(shadow: ShadowStyle = "none"): string | undefined {
  switch (shadow) {
    case "sm": return "0 1px 3px rgba(0,0,0,0.12)";
    case "md": return "0 4px 12px rgba(0,0,0,0.15)";
    case "lg": return "0 8px 30px rgba(0,0,0,0.2)";
    default: return undefined;
  }
}

export function getColumnClass(columns: ColumnLayout = "1"): string {
  switch (columns) {
    case "2": return "grid sm:grid-cols-2 gap-4";
    case "3": return "grid sm:grid-cols-2 lg:grid-cols-3 gap-4";
    case "full": return "w-full";
    default: return "grid grid-cols-1 gap-4";
  }
}

export function getSectionMaxWidthClass(maxWidth?: SectionStyle["maxWidth"]): string {
  if (!maxWidth || maxWidth === "inherit") return "";
  return getContentMaxWidth(maxWidth);
}

export function getSectionMinHeightClass(minHeight: SectionMinHeight = "auto"): string {
  switch (minHeight) {
    case "sm": return "min-h-[200px]";
    case "md": return "min-h-[320px]";
    case "lg": return "min-h-[480px]";
    case "xl": return "min-h-[640px]";
    case "screen": return "min-h-screen";
    default: return "";
  }
}

export function getMediaHeightClass(height: SectionMediaHeight = "md"): string {
  switch (height) {
    case "auto": return "h-auto";
    case "sm": return "h-32";
    case "md": return "h-48";
    case "lg": return "h-64";
    case "xl": return "h-96";
    default: return "h-48";
  }
}

export function getVideoAspectClass(height: SectionMediaHeight = "md"): string {
  switch (height) {
    case "sm": return "aspect-[21/9]";
    case "lg": return "aspect-[4/3]";
    case "xl": return "aspect-square";
    case "auto": return "min-h-[240px]";
    default: return "aspect-video";
  }
}

export function resolveSectionColors(style: SectionStyle, theme: PortfolioTheme) {
  const c = style.colors || {};
  return {
    background: c.background,
    text: c.text || theme.colors.text,
    title: c.title || theme.colors.primary,
    primary: c.primary || theme.colors.primary,
    accent: c.accent || theme.colors.accent,
    border: c.border || `${theme.colors.textMuted}30`,
  };
}

export function resolveSectionBackgroundStyle(
  style: SectionStyle,
  theme: PortfolioTheme
): Record<string, string> {
  const colors = resolveSectionColors(style, theme);
  if (colors.background) {
    return { backgroundColor: colors.background };
  }
  const base = getSectionBackgroundStyle(style.background, theme);
  return base || {};
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

export function getFontSizeClass(size: FontSize = "md"): string {
  switch (size) {
    case "sm": return "text-sm";
    case "lg": return "text-lg";
    default: return "text-base";
  }
}
