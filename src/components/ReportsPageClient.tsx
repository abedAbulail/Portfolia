"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import ReportsChart, { fillLast14Days } from "@/components/ReportsChart";
import { StatCard, StatCardCentered } from "@/components/StatCard";
import { AppIcon, type AppIconName } from "@/components/icons/AppIcons";

interface ReportStats {
  projects: number;
  skills: number;
  messages: number;
  unreadMessages: number;
  completion: number;
  visitors: number;
  cvDownloads: number;
  dailyVisitors: { date: string; count: number }[];
  dailyDownloads: { date: string; count: number }[];
  dailyMessages: { date: string; count: number }[];
  slug: string;
}

function formatChartLabel(date: string): string {
  const d = new Date(date + "T12:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ReportsPageClient() {
  const { t, dir } = useLocale();
  const [stats, setStats] = useState<ReportStats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/reports")
      .then((r) => r.json())
      .then((d) => setStats(d.stats));
  }, []);

  if (!stats) {
    return <p style={{ color: "var(--app-text-muted)" }}>{t("rep.loading")}</p>;
  }

  const secondaryCards: { label: string; value: number; icon: AppIconName }[] = [
    { label: t("rep.messages"), value: stats.messages, icon: "mail" },
    { label: t("rep.unread"), value: stats.unreadMessages, icon: "bell" },
    { label: t("rep.projects"), value: stats.projects, icon: "rocket" },
    { label: t("rep.skills"), value: stats.skills, icon: "bolt" },
  ];

  const visitorChart = fillLast14Days(stats.dailyVisitors, formatChartLabel);
  const downloadChart = fillLast14Days(stats.dailyDownloads, formatChartLabel);
  const messageChart = fillLast14Days(
    stats.dailyMessages.map((d) => ({ date: d.date, count: d.count })),
    formatChartLabel
  );

  return (
    <div dir={dir}>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title mb-1">{t("rep.title")}</h1>
          <p className="text-sm mb-0" style={{ color: "var(--app-text-muted)" }}>
            {t("rep.subtitle")}
          </p>
        </div>
        <Link href="/dashboard/editor" className="btn-primary text-sm inline-flex items-center gap-2">
          <AppIcon name="sparkles" size={16} />
          {t("dash.customize")}
        </Link>
      </div>

      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--app-primary-muted)", background: "var(--app-card-bg)" }}
      >
        <p className="text-sm mb-2" style={{ color: "var(--app-text-muted)" }}>
          {t("dash.portfolioUrl")}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <code
            className="text-sm px-3 py-1.5 rounded-lg"
            style={{
              color: "var(--app-primary)",
              background: "var(--app-primary-muted)",
            }}
          >
            /portfolio/{stats.slug}
          </code>
          <Link
            href={`/portfolio/${stats.slug}`}
            target="_blank"
            className="btn-secondary text-sm inline-flex items-center gap-2"
          >
            {t("nav.viewPortfolio")}
            <AppIcon name="external-link" size={14} />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-4">
        <StatCardCentered label={t("rep.visitors")} value={stats.visitors} icon="eye" />
        <StatCardCentered label={t("rep.cvDownloads")} value={stats.cvDownloads} icon="file" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {secondaryCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <div className="rounded-2xl border p-5" style={{ borderColor: "var(--app-border)", background: "var(--app-card-bg)" }}>
          <h2 className="font-semibold mb-4" style={{ color: "var(--app-text)" }}>
            {t("rep.chartVisitors")}
          </h2>
          <ReportsChart data={visitorChart} color="#7c3aed" />
        </div>
        <div className="rounded-2xl border p-5" style={{ borderColor: "var(--app-border)", background: "var(--app-card-bg)" }}>
          <h2 className="font-semibold mb-4" style={{ color: "var(--app-text)" }}>
            {t("rep.chartDownloads")}
          </h2>
          <ReportsChart data={downloadChart} color="#8b5cf6" />
        </div>
        <div className="rounded-2xl border p-5" style={{ borderColor: "var(--app-border)", background: "var(--app-card-bg)" }}>
          <h2 className="font-semibold mb-4" style={{ color: "var(--app-text)" }}>
            {t("rep.chartMessages")}
          </h2>
          <ReportsChart data={messageChart} color="#a78bfa" />
        </div>
      </div>

      <div className="rounded-2xl border p-5" style={{ borderColor: "var(--app-border)", background: "var(--app-card-bg)" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold" style={{ color: "var(--app-text)" }}>
            {t("rep.completion")}
          </h2>
          <span className="text-2xl font-bold tabular-nums" style={{ color: "var(--app-primary)" }}>
            {stats.completion}%
          </span>
        </div>
        <div className="h-3 rounded-full" style={{ background: "var(--app-input-bg)" }}>
          <div
            className="h-3 rounded-full transition-all"
            style={{ width: `${stats.completion}%`, background: "var(--app-primary)" }}
          />
        </div>
        <p className="text-sm mt-2" style={{ color: "var(--app-text-muted)" }}>
          {stats.completion}% {t("rep.complete")}
        </p>
      </div>
    </div>
  );
}
