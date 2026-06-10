export type BackgroundMode = "inherit" | "solid" | "gradient" | "image" | "pattern";
export type BackgroundPattern = "dots" | "grid" | "diagonal";

export function buildMapEmbedUrl(location: string, zoom = 14): string {
  const query = location.trim();
  if (!query) return "";
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;
}

export function resolveMapEmbedUrl(
  customUrl: string | undefined,
  location: string | undefined,
  zoom = 14
): string {
  if (customUrl?.trim()) return customUrl.trim();
  if (location?.trim()) return buildMapEmbedUrl(location, zoom);
  return "";
}

export function getPatternStyle(pattern: BackgroundPattern, color: string): Record<string, string> {
  switch (pattern) {
    case "grid":
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 24V0h1v23h23v1H0z' fill='${encodeURIComponent(color)}' fill-opacity='.14'/%3E%3C/svg%3E")`,
        backgroundSize: "24px 24px",
      };
    case "diagonal":
      return {
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${color}14 10px, ${color}14 11px)`,
      };
    default:
      return {
        backgroundImage: `radial-gradient(${color}28 1px, transparent 1px)`,
        backgroundSize: "18px 18px",
      };
  }
}

export function inferHeroBackgroundMode(hero: {
  backgroundMode?: BackgroundMode;
  backgroundImage?: string;
}): BackgroundMode {
  if (hero.backgroundMode) return hero.backgroundMode;
  if (hero.backgroundImage) return "image";
  return "gradient";
}

export function inferFooterBackgroundMode(footer: {
  backgroundMode?: BackgroundMode;
  backgroundImage?: string;
}): BackgroundMode {
  if (footer.backgroundMode) return footer.backgroundMode;
  if (footer.backgroundImage) return "image";
  return "solid";
}
