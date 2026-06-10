import type { PortfolioTheme } from "./portfolio-theme";
import { DEFAULT_THEME, mergeTheme, MAIN_SECTIONS } from "./portfolio-theme";

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  preview: { background: string; primary: string; accent: string };
  theme: PortfolioTheme;
}

const T = DEFAULT_THEME.sections.titles;

export const NEW_THEME_PRESETS: ThemePreset[] = [
  // ── Dark Themes ──
  {
    id: "midnight-glass",
    name: "Midnight Glass",
    description: "Deep black glassmorphism with purple gradients and particles.",
    preview: { background: "#030014", primary: "#a78bfa", accent: "#7c3aed" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "midnight-glass",
      colors: { background: "#030014", surface: "#0f0a1e99", primary: "#a78bfa", accent: "#7c3aed", text: "#f5f3ff", textMuted: "#a1a1aa" },
      layout: { heroStyle: "animated", heroAlignment: "center", contentWidth: "medium", projectsLayout: "cards", skillsLayout: "tags", spacing: "relaxed", borderRadius: "lg" },
      hero: { gradientFrom: "#7c3aed", gradientTo: "#a78bfa", particles: true, glassEffect: true, overlayOpacity: 0.7 },
      sections: { order: [...MAIN_SECTIONS, "techStack", "testimonials", "contactform"], titles: T },
      features: { showGradient: true, footerStyle: "minimal", showScrollProgress: true, showAvailabilityBadge: true, availableForWork: true },
      typography: { headingFont: "sans" },
    }),
  },
  {
    id: "cyber-neon",
    name: "Cyber Neon",
    description: "Hacker aesthetic with neon green lines and monospace font.",
    preview: { background: "#080c08", primary: "#00ff88", accent: "#00d4ff" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "cyber-neon",
      colors: { background: "#080c08", surface: "#0d140d", primary: "#00ff88", accent: "#00d4ff", text: "#e0ffe0", textMuted: "#6b9e7a" },
      layout: { heroStyle: "minimal", heroAlignment: "left", contentWidth: "wide", projectsLayout: "grid", skillsLayout: "tags", spacing: "compact", borderRadius: "none" },
      hero: { gradientFrom: "#00ff8840", gradientTo: "#00d4ff20", overlayOpacity: 0.5 },
      sections: { order: ["stats", "about", "techStack", "projects", "openSource", "contactform"], titles: T },
      features: { showGradient: true, footerStyle: "minimal", showScrollProgress: true, liveChatEnabled: true, liveChatType: "telegram", liveChatUrl: "https://t.me" },
      typography: { headingFont: "mono" },
    }),
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    description: "Dark navy with deep blue gradient and animated waves.",
    preview: { background: "#040d1a", primary: "#0ea5e9", accent: "#38bdf8" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "deep-ocean",
      colors: { background: "#040d1a", surface: "#071428", primary: "#0ea5e9", accent: "#38bdf8", text: "#f0f9ff", textMuted: "#7dd3fc" },
      layout: { heroStyle: "split", heroAlignment: "left", contentWidth: "medium", projectsLayout: "cards", skillsLayout: "grid", spacing: "normal", borderRadius: "lg" },
      hero: { gradientFrom: "#0ea5e9", gradientTo: "#0369a1", waves: true, overlayOpacity: 0.6 },
      sections: { order: [...MAIN_SECTIONS, "experience", "timeline", "contactform"], titles: T },
      features: { showGradient: true, footerStyle: "rich", showVisitorsCounter: true },
      typography: { headingFont: "sans" },
    }),
  },
  {
    id: "carbon-elite",
    name: "Carbon Elite",
    description: "Charcoal luxury with gold accents — corporate premium.",
    preview: { background: "#111111", primary: "#d4af37", accent: "#b8860b" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "carbon-elite",
      colors: { background: "#111111", surface: "#1a1a1a", primary: "#d4af37", accent: "#b8860b", text: "#f5f5f5", textMuted: "#a3a3a3" },
      layout: { heroStyle: "split", heroAlignment: "left", contentWidth: "narrow", projectsLayout: "list", skillsLayout: "list", spacing: "normal", borderRadius: "md" },
      hero: { gradientFrom: "#d4af3720", gradientTo: "#b8860b10", overlayOpacity: 0.4 },
      sections: { order: ["about", "experience", "awards", "projects", "services", "contact", "resume"], titles: T },
      features: { showGradient: false, footerStyle: "rich", showAvailabilityBadge: true, availableForWork: true },
      typography: { headingFont: "serif" },
    }),
  },
  {
    id: "aurora-dark",
    name: "Aurora Dark",
    description: "Black canvas with Aurora Borealis color shifts.",
    preview: { background: "#050508", primary: "#8b5cf6", accent: "#06b6d4" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "aurora-dark",
      colors: { background: "#050508", surface: "#0f0f18", primary: "#8b5cf6", accent: "#06b6d4", text: "#fafafa", textMuted: "#94a3b8" },
      layout: { heroStyle: "centered", heroAlignment: "center", contentWidth: "wide", projectsLayout: "grid", skillsLayout: "tags", spacing: "relaxed", borderRadius: "full" },
      hero: { aurora: true, particles: true, overlayOpacity: 0.5 },
      sections: { order: [...MAIN_SECTIONS, "gallery", "testimonials", "cta", "contactform"], titles: T },
      features: { showGradient: true, footerStyle: "cta", showScrollProgress: true },
      typography: { headingFont: "sans" },
    }),
  },
  // ── Light Themes ──
  {
    id: "ivory-luxe",
    name: "Ivory Luxe",
    description: "Warm white with gold and beige — luxury modern feel.",
    preview: { background: "#faf8f5", primary: "#92400e", accent: "#b45309" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "ivory-luxe",
      colors: { background: "#faf8f5", surface: "#ffffff", primary: "#92400e", accent: "#b45309", text: "#1c1917", textMuted: "#78716c" },
      layout: { heroStyle: "split", heroAlignment: "left", contentWidth: "medium", projectsLayout: "cards", skillsLayout: "grid", spacing: "relaxed", borderRadius: "lg" },
      sections: { order: [...MAIN_SECTIONS, "services", "testimonials", "contact"], titles: T },
      features: { showGradient: false, footerStyle: "rich" },
      typography: { headingFont: "serif" },
    }),
  },
  {
    id: "arctic-clean",
    name: "Arctic Clean",
    description: "Crisp white with icy blue — pure minimalist spacing.",
    preview: { background: "#ffffff", primary: "#0284c7", accent: "#0ea5e9" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "arctic-clean",
      colors: { background: "#ffffff", surface: "#f8fafc", primary: "#0284c7", accent: "#0ea5e9", text: "#0f172a", textMuted: "#94a3b8" },
      layout: { heroStyle: "minimal", heroAlignment: "center", contentWidth: "narrow", projectsLayout: "list", skillsLayout: "tags", spacing: "relaxed", borderRadius: "md" },
      sections: { order: [...MAIN_SECTIONS, "contactform"], titles: T },
      features: { showGradient: false, footerStyle: "minimal", showScrollProgress: true },
      typography: { headingFont: "sans" },
    }),
  },
  {
    id: "paper-ink",
    name: "Paper & Ink",
    description: "Light beige with black text — editorial magazine style.",
    preview: { background: "#f5f0e8", primary: "#1a1a1a", accent: "#525252" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "paper-ink",
      colors: { background: "#f5f0e8", surface: "#faf7f2", primary: "#1a1a1a", accent: "#525252", text: "#1a1a1a", textMuted: "#737373" },
      layout: { heroStyle: "centered", heroAlignment: "left", contentWidth: "narrow", projectsLayout: "list", skillsLayout: "list", spacing: "normal", borderRadius: "none" },
      sections: { order: ["about", "blog", "projects", "experience", "contact"], titles: T },
      features: { showGradient: false, footerStyle: "rich" },
      typography: { headingFont: "serif" },
    }),
  },
  {
    id: "blossom",
    name: "Blossom",
    description: "White with soft pink and elegant serif — for creatives.",
    preview: { background: "#fffbfb", primary: "#db2777", accent: "#f472b6" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "blossom",
      colors: { background: "#fffbfb", surface: "#ffffff", primary: "#db2777", accent: "#f472b6", text: "#1f0a14", textMuted: "#9d4f73" },
      layout: { heroStyle: "card3d", heroAlignment: "center", contentWidth: "medium", projectsLayout: "cards", skillsLayout: "tags", spacing: "relaxed", borderRadius: "full" },
      sections: { order: [...MAIN_SECTIONS, "gallery", "testimonials", "cta"], titles: T },
      features: { showGradient: true, footerStyle: "cta" },
      typography: { headingFont: "serif" },
    }),
  },
  {
    id: "sage-studio",
    name: "Sage Studio",
    description: "White with sage green and thin lines — creative studio vibe.",
    preview: { background: "#fafaf9", primary: "#4d7c0f", accent: "#65a30d" },
    theme: mergeTheme(DEFAULT_THEME, {
      activeThemeId: "sage-studio",
      colors: { background: "#fafaf9", surface: "#ffffff", primary: "#4d7c0f", accent: "#65a30d", text: "#1c1917", textMuted: "#78716c" },
      layout: { heroStyle: "split", heroAlignment: "left", contentWidth: "wide", projectsLayout: "grid", skillsLayout: "grid", spacing: "relaxed", borderRadius: "lg" },
      sections: { order: [...MAIN_SECTIONS, "services", "caseStudy", "languages", "contactform"], titles: T },
      features: { showGradient: false, footerStyle: "map", showAvailabilityBadge: true, availableForWork: true },
      typography: { headingFont: "sans", fontSize: "sm" },
    }),
  },
];
