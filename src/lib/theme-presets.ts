import type { PortfolioTheme } from "./portfolio-theme";
import { DEFAULT_THEME, mergeTheme, MAIN_SECTIONS } from "./portfolio-theme";

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  preview: { background: string; primary: string; accent: string };
  theme: PortfolioTheme;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "violet-pro",
    name: "Violet Professional",
    description: "Main sections only — clean and focused.",
    preview: { background: "#080b14", primary: "#8b5cf6", accent: "#6366f1" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "violet-pro",
      sections: { order: [...MAIN_SECTIONS], titles: DEFAULT_THEME.sections.titles },
    }),
  },
  {
    id: "ocean-minimal",
    name: "Ocean Minimal",
    description: "Main sections + contact form. Split hero layout.",
    preview: { background: "#0a1628", primary: "#0ea5e9", accent: "#06b6d4" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "ocean-minimal",
      colors: {
        background: "#0a1628",
        surface: "#0f2847",
        primary: "#0ea5e9",
        accent: "#06b6d4",
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
    preview: { background: "#0a120f", primary: "#10b981", accent: "#34d399" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "forest-creative",
      colors: {
        background: "#0a120f",
        surface: "#142019",
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
    preview: { background: "#1a0a0a", primary: "#f97316", accent: "#ef4444" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "sunset-bold",
      colors: {
        background: "#1a0a0a",
        surface: "#2d1515",
        primary: "#f97316",
        accent: "#ef4444",
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
          about: "About Me",
          experience: "Work Experience",
          stats: "Highlights",
          skills: "Expertise",
          projects: "Featured Work",
          contact: "Contact",
          contactform: "Contact Me",
          resume: "Resume",
          cta: "Let's Connect",
        },
      },
      typography: { headingFont: "serif" },
    }),
  },
  {
    id: "light-clean",
    name: "Light & Clean",
    description: "Main sections + contact info + resume. Bright corporate look.",
    preview: { background: "#fafafa", primary: "#18181b", accent: "#52525b" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "light-clean",
      colors: {
        background: "#fafafa",
        surface: "#ffffff",
        primary: "#18181b",
        accent: "#52525b",
        text: "#18181b",
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
];

export function getThemePreset(id: string): PortfolioTheme | null {
  const preset = THEME_PRESETS.find((p) => p.id === id);
  return preset ? structuredClone(preset.theme) : null;
}
