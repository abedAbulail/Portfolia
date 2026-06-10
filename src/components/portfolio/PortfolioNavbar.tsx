import type { PortfolioTheme } from "@/lib/portfolio-theme";
import type { PortfolioPage } from "@/lib/platform-data";
import { getContentMaxWidth } from "@/lib/portfolio-theme";
import { getVisiblePages } from "@/lib/platform-data";
import Link from "next/link";

export default function PortfolioNavbar({
  slug,
  theme,
  pages,
  currentPageSlug = "",
}: {
  slug: string;
  theme: PortfolioTheme;
  pages: PortfolioPage[];
  currentPageSlug?: string;
}) {
  const visible = getVisiblePages(pages);
  if (visible.length <= 1) return null;

  const base = `/portfolio/${slug}`;
  const maxW = getContentMaxWidth(theme.layout.contentWidth);

  return (
    <nav
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        borderColor: `${theme.colors.textMuted}20`,
        backgroundColor: `${theme.colors.background}ee`,
      }}
    >
      <div className={`mx-auto px-6 ${maxW} flex items-center gap-1 overflow-x-auto py-3`}>
        {visible.map((page) => {
          const href = page.isHome || !page.slug ? base : `${base}/${page.slug}`;
          const active = page.slug === currentPageSlug || (page.isHome && !currentPageSlug);
          return (
            <Link
              key={page.id}
              href={href}
              className="shrink-0 px-4 py-1.5 text-sm font-medium rounded-full transition-colors"
              style={
                active
                  ? { backgroundColor: theme.colors.primary, color: "#fff" }
                  : { color: theme.colors.textMuted }
              }
            >
              {page.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
