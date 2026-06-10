import type { Testimonial } from "@/lib/platform-data";
import type { PortfolioTheme } from "@/lib/portfolio-theme";
import { getRadiusClass } from "@/lib/portfolio-theme";

export default function TestimonialsSection({
  items,
  theme,
  layout,
}: {
  items: Testimonial[];
  theme: PortfolioTheme;
  layout?: string;
}) {
  const radius = getRadiusClass(theme.layout.borderRadius);
  if (!items.length) return null;

  const gridClass =
    layout === "list" ? "space-y-4" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={gridClass}>
      {items.map((t) => (
        <blockquote
          key={t.id}
          className={`border p-5 ${radius}`}
          style={{
            borderColor: `${theme.colors.textMuted}20`,
            backgroundColor: `${theme.colors.surface}80`,
          }}
        >
          {t.rating && (
            <div className="flex gap-1 mb-2">
              {Array.from({ length: t.rating }).map((_, i) => (
                <span
                  key={i}
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                  aria-hidden
                />
              ))}
            </div>
          )}
          <p className="leading-relaxed mb-4" style={{ color: theme.colors.textMuted }}>
            &ldquo;{t.quote}&rdquo;
          </p>
          <footer>
            <p className="font-semibold">{t.name}</p>
            <p className="text-sm" style={{ color: theme.colors.primary }}>
              {t.role}{t.company ? ` · ${t.company}` : ""}
            </p>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
