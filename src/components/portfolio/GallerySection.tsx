import type { GalleryItem } from "@/lib/platform-data";
import type { PortfolioTheme, SectionMediaHeight } from "@/lib/portfolio-theme";
import { getRadiusClass, getMediaHeightClass } from "@/lib/portfolio-theme";

export default function GallerySection({
  items,
  theme,
  columns = "3",
  mediaHeight = "md",
}: {
  items: GalleryItem[];
  theme: PortfolioTheme;
  columns?: string;
  mediaHeight?: SectionMediaHeight;
}) {
  const radius = getRadiusClass(theme.layout.borderRadius);
  const imgH = getMediaHeightClass(mediaHeight);
  if (!items.length) return null;

  const gridClass =
    columns === "2"
      ? "grid sm:grid-cols-2 gap-4"
      : columns === "1"
        ? "grid grid-cols-1 gap-4"
        : "grid sm:grid-cols-2 lg:grid-cols-3 gap-4";

  return (
    <div className={gridClass}>
      {items.map((item) => (
        <figure key={item.id} className={`pf-card-hover overflow-hidden border ${radius}`} style={{ borderColor: `${theme.colors.textMuted}20` }}>
          <img src={item.url} alt={item.caption || ""} className={`w-full object-cover ${imgH}`} />
          {item.caption && (
            <figcaption className="p-3 text-sm" style={{ color: theme.colors.textMuted }}>
              {item.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
