"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useAppTheme } from "@/context/AppThemeContext";
import { LOCALES } from "@/lib/i18n";
import { AppIcon, type AppIconName } from "@/components/icons/AppIcons";

const navItems: { href: string; labelKey: string; exact?: boolean; icon: AppIconName }[] = [
  { href: "/dashboard", labelKey: "nav.reports", exact: true, icon: "chart" },
  { href: "/dashboard/profile", labelKey: "nav.profile", icon: "user" },
  { href: "/dashboard/projects", labelKey: "nav.projects", icon: "rocket" },
  { href: "/dashboard/skills", labelKey: "nav.skills", icon: "bolt" },
  { href: "/dashboard/editor", labelKey: "nav.editor", icon: "sparkles" },
  { href: "/dashboard/messages", labelKey: "nav.messages", icon: "mail" },
  { href: "/dashboard/account", labelKey: "nav.account", icon: "settings" },
];

export default function DashboardSidebar({ slug }: { slug: string }) {
  const pathname = usePathname();
  const { locale, setLocale, t, dir } = useLocale();
  const { theme, toggleTheme } = useAppTheme();
  const isRtl = dir === "rtl";

  return (
    <aside
      className={`w-64 shrink-0 flex flex-col min-h-screen sticky top-0 ${
        isRtl ? "border-l" : "border-r"
      }`}
      style={{
        borderColor: "var(--app-border)",
        background: "var(--app-sidebar-bg)",
      }}
      dir={dir}
    >
      <div className="p-5 border-b" style={{ borderColor: "var(--app-border)" }}>
        <Link href="/" className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ background: "var(--app-primary)" }}
          >
            P
          </span>
          <span className="font-display text-lg font-semibold" style={{ color: "var(--app-text)" }}>
            Portfolia
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              style={
                active
                  ? {
                      background: "var(--app-primary-muted)",
                      color: "var(--app-primary)",
                    }
                  : { color: "var(--app-text-muted)" }
              }
            >
              <AppIcon name={item.icon} size={18} />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-3" style={{ borderColor: "var(--app-border)" }}>
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors"
          style={{
            borderColor: "var(--app-border)",
            color: "var(--app-text-muted)",
          }}
        >
          <AppIcon name={theme === "dark" ? "sun" : "moon"} size={14} />
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>

        <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--app-input-bg)" }}>
          {LOCALES.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLocale(l.id)}
              className="flex-1 py-1.5 text-xs rounded-md transition-colors"
              style={
                locale === l.id
                  ? { background: "var(--app-primary)", color: "#fff" }
                  : { color: "var(--app-text-muted)" }
              }
            >
              {l.label}
            </button>
          ))}
        </div>

        <Link
          href={`/portfolio/${slug}`}
          target="_blank"
          className="flex items-center justify-center gap-2 w-full rounded-lg border px-3 py-2 text-xs transition-colors"
          style={{
            borderColor: "var(--app-border)",
            color: "var(--app-text-muted)",
          }}
        >
          {t("nav.viewPortfolio")}
          <AppIcon name="external-link" size={12} />
        </Link>

        <button
          type="button"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/";
          }}
          className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          {t("nav.signOut")}
        </button>
      </div>
    </aside>
  );
}
