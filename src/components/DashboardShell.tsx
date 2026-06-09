"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import { AppIcon } from "@/components/icons/AppIcons";

export default function DashboardShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { dir } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isEditor = pathname.startsWith("/dashboard/editor");

  if (isEditor) {
    return <div className="min-h-screen bg-[var(--app-bg)]">{children}</div>;
  }

  const isRtl = dir === "rtl";

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      {/* Mobile top bar */}
      <header
        className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b"
        style={{
          borderColor: "var(--app-border)",
          background: "var(--app-sidebar-bg)",
        }}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center h-10 w-10 rounded-lg border"
          style={{ borderColor: "var(--app-border)", color: "var(--app-text)" }}
          aria-label="Open menu"
        >
          <AppIcon name="list" size={20} />
        </button>
        <span className="font-display font-semibold" style={{ color: "var(--app-text)" }}>
          Portfolia
        </span>
        <div className="w-10" />
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={`flex min-h-[calc(100dvh-57px)] lg:min-h-screen ${isRtl ? "lg:flex-row-reverse" : ""}`}>
        <DashboardSidebar
          slug={slug}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <main className="flex-1 overflow-auto min-w-0 w-full">
          <div className="mx-auto max-w-5xl w-full px-4 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
