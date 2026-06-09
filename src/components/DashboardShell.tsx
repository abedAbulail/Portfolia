"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { dir } = useLocale();
  const isEditor = pathname.startsWith("/dashboard/editor");

  if (isEditor) {
    return <div className="min-h-screen bg-[var(--app-bg)]">{children}</div>;
  }

  const isRtl = dir === "rtl";

  return (
    <div
      className={`flex min-h-screen bg-[var(--app-bg)] ${isRtl ? "flex-row-reverse" : ""}`}
    >
      <DashboardSidebar slug={slug} />
      <main className="flex-1 overflow-auto min-w-0">
        <div className="mx-auto max-w-5xl w-full px-6 py-8 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
