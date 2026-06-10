import type { PortfolioTheme, SectionMediaHeight, VideoItem } from "@/lib/portfolio-theme";
import { getRadiusClass, getVideoAspectClass } from "@/lib/portfolio-theme";

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  if (url.includes("embed")) return url;
  return null;
}

export default function VideoSection({
  videos,
  legacyUrl,
  theme,
  mediaHeight = "md",
}: {
  videos?: VideoItem[];
  legacyUrl?: string;
  theme: PortfolioTheme;
  mediaHeight?: SectionMediaHeight;
}) {
  const radius = getRadiusClass(theme.layout.borderRadius);
  const aspect = getVideoAspectClass(mediaHeight);

  const items: VideoItem[] =
    videos && videos.length > 0
      ? videos.filter((v) => v.url)
      : legacyUrl
        ? [{ id: "legacy", url: legacyUrl }]
        : [];

  if (!items.length) return null;

  return (
    <div className={`space-y-6 ${items.length > 1 ? "grid sm:grid-cols-2 gap-6 space-y-0" : ""}`}>
      {items.map((item) => {
        const embed = getEmbedUrl(item.url);
        if (!embed) return null;
        return (
          <div key={item.id}>
            {item.title && (
              <h3 className="font-semibold mb-2 text-sm" style={{ color: theme.colors.text }}>
                {item.title}
              </h3>
            )}
            <div className={`overflow-hidden border ${aspect} ${radius}`} style={{ borderColor: `${theme.colors.textMuted}20` }}>
              <iframe
                src={embed}
                title={item.title || "Video"}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
