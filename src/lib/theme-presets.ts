import type { PortfolioTheme } from "./portfolio-theme";
import { DEFAULT_THEME, mergeTheme, MAIN_SECTIONS } from "./portfolio-theme";
import { NEW_THEME_PRESETS, type ThemePreset } from "./theme-presets-new";

export type { ThemePreset };

const LEGACY_THEME_PRESETS: ThemePreset[] = [
  {
    id: "violet-pro",
    name: "Violet Professional",
    description: "Main sections only — clean and focused.",
    preview: { background: "#06080f", primary: "#7c3aed", accent: "#4f46e5" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "violet-pro",
      colors: {
        background: "#06080f",
        surface: "#0c1018",
        primary: "#7c3aed",
        accent: "#4f46e5",
        text: "#e2e8f0",
        textMuted: "#94a3b8",
      },
      sections: { order: [...MAIN_SECTIONS], titles: DEFAULT_THEME.sections.titles },
    }),
  },
  {
    id: "ocean-minimal",
    name: "Ocean Minimal",
    description: "Main sections + contact form. Split hero layout.",
    preview: { background: "#070d1a", primary: "#0ea5e9", accent: "#22d3ee" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "ocean-minimal",
      colors: {
        background: "#070d1a",
        surface: "#0a1525",
        primary: "#0ea5e9",
        accent: "#22d3ee",
        text: "#f0f9ff",
        textMuted: "#7dd3fc",
      },
      layout: {
        heroStyle: "split",
        heroAlignment: "left",
        contentWidth: "medium",
        projectsLayout: "cards",
        skillsLayout: "tags",
        spacing: "normal",
        borderRadius: "lg",
      },
      sections: {
        order: [...MAIN_SECTIONS, "contactform"],
        titles: DEFAULT_THEME.sections.titles,
      },
      typography: { headingFont: "sans" },
    }),
  },
  {
    id: "forest-creative",
    name: "Forest Creative",
    description: "Main + experience + stats. Relaxed earthy style.",
    preview: { background: "#060e0a", primary: "#10b981", accent: "#34d399" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "forest-creative",
      colors: {
        background: "#060e0a",
        surface: "#0a1812",
        primary: "#10b981",
        accent: "#34d399",
        text: "#ecfdf5",
        textMuted: "#6ee7b7",
      },
      layout: {
        heroStyle: "centered",
        heroAlignment: "center",
        contentWidth: "wide",
        projectsLayout: "grid",
        skillsLayout: "grid",
        spacing: "relaxed",
        borderRadius: "full",
      },
      sections: {
        order: ["about", "experience", "stats", "skills", "projects"],
        titles: DEFAULT_THEME.sections.titles,
      },
    }),
  },
  {
    id: "sunset-bold",
    name: "Sunset Bold",
    description: "Full portfolio with stats, CTA, and contact form.",
    preview: { background: "#120606", primary: "#f97316", accent: "#fbbf24" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "sunset-bold",
      colors: {
        background: "#120606",
        surface: "#1f0d0d",
        primary: "#f97316",
        accent: "#fbbf24",
        text: "#fff7ed",
        textMuted: "#fdba74",
      },
      layout: {
        heroStyle: "minimal",
        heroAlignment: "left",
        contentWidth: "medium",
        projectsLayout: "list",
        skillsLayout: "list",
        spacing: "compact",
        borderRadius: "md",
      },
      sections: {
        order: ["stats", "about", "experience", "projects", "skills", "cta", "contactform"],
        titles: {
          ...DEFAULT_THEME.sections.titles,
          about: "About Me",
          experience: "Work Experience",
          stats: "Highlights",
          skills: "Expertise",
          projects: "Featured Work",
        },
      },
      typography: { headingFont: "serif" },
    }),
  },
  {
    id: "light-clean",
    name: "Light & Clean",
    description: "Main sections + contact info + resume. Bright corporate look.",
    preview: { background: "#fafafa", primary: "#18181b", accent: "#3f3f46" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "light-clean",
      colors: {
        background: "#fafafa",
        surface: "#ffffff",
        primary: "#18181b",
        accent: "#3f3f46",
        text: "#09090b",
        textMuted: "#71717a",
      },
      layout: {
        heroStyle: "split",
        heroAlignment: "left",
        contentWidth: "narrow",
        projectsLayout: "cards",
        skillsLayout: "tags",
        spacing: "normal",
        borderRadius: "md",
      },
      sections: {
        order: [...MAIN_SECTIONS, "contact", "resume"],
        titles: DEFAULT_THEME.sections.titles,
      },
      features: {
        showHeroPhoto: true,
        showSocialLinks: true,
        showProjectImages: true,
        showSkillLevels: false,
        showProjectStatus: false,
        showFooter: true,
        showGradient: false,
        showResumeInHero: true,
      },
      typography: { headingFont: "sans" },
    }),
  },
  {
    id: "mono-dev",
    name: "Mono Developer",
    description: "Main sections + contact form. Terminal-inspired.",
    preview: { background: "#0d1117", primary: "#58a6ff", accent: "#3fb950" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "mono-dev",
      colors: {
        background: "#0d1117",
        surface: "#161b22",
        primary: "#58a6ff",
        accent: "#3fb950",
        text: "#c9d1d9",
        textMuted: "#8b949e",
      },
      layout: {
        heroStyle: "minimal",
        heroAlignment: "left",
        contentWidth: "wide",
        projectsLayout: "grid",
        skillsLayout: "tags",
        spacing: "compact",
        borderRadius: "none",
      },
      sections: {
        order: [...MAIN_SECTIONS, "contactform"],
        titles: DEFAULT_THEME.sections.titles,
      },
      typography: { headingFont: "mono" },
    }),
  },
  {
    id: "corporate-pro",
    name: "Corporate Pro",
    description: "Professional corporate look with contact and resume.",
    preview: { background: "#f8fafc", primary: "#1e40af", accent: "#2563eb" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "corporate-pro",
      colors: {
        background: "#f8fafc",
        surface: "#ffffff",
        primary: "#1e40af",
        accent: "#2563eb",
        text: "#0f172a",
        textMuted: "#64748b",
      },
      layout: {
        heroStyle: "split",
        heroAlignment: "left",
        contentWidth: "medium",
        projectsLayout: "cards",
        skillsLayout: "grid",
        spacing: "normal",
        borderRadius: "md",
      },
      sections: {
        order: [...MAIN_SECTIONS, "contact", "contactform", "resume"],
        titles: DEFAULT_THEME.sections.titles,
      },
      typography: { headingFont: "sans", fontSize: "md" },
    }),
  },
  {
    id: "dark-bold",
    name: "Dark Bold",
    description: "High-contrast dark theme with stats and CTA.",
    preview: { background: "#09090b", primary: "#a855f7", accent: "#ec4899" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "dark-bold",
      colors: {
        background: "#09090b",
        surface: "#18181b",
        primary: "#a855f7",
        accent: "#ec4899",
        text: "#fafafa",
        textMuted: "#a1a1aa",
      },
      layout: {
        heroStyle: "centered",
        heroAlignment: "center",
        contentWidth: "wide",
        projectsLayout: "grid",
        skillsLayout: "tags",
        spacing: "relaxed",
        borderRadius: "lg",
      },
      sections: {
        order: ["stats", "about", "projects", "skills", "testimonials", "cta", "contactform"],
        titles: DEFAULT_THEME.sections.titles,
      },
      typography: { headingFont: "sans", fontSize: "lg" },
    }),
  },
];

export const THEME_PRESETS: ThemePreset[] = [
  ...LEGACY_THEME_PRESETS,
  ...NEW_THEME_PRESETS,
];

export function getThemePreset(id: string): PortfolioTheme | null {
  const preset = THEME_PRESETS.find((p) => p.id === id);
  return preset ? structuredClone(preset.theme) : null;
}
