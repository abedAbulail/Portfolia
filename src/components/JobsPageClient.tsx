"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { AppIcon } from "@/components/icons/AppIcons";
import type { JobListing } from "@/lib/platform-data";
import type { JobApplicationStatus } from "@/lib/platform-data";

const STATUS_OPTIONS: JobApplicationStatus[] = ["saved", "applied", "waiting", "rejected", "accepted"];

export default function JobsPageClient() {
  const { t, dir } = useLocale();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [applications, setApplications] = useState<Array<{ jobId: string; status: JobApplicationStatus }>>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [source, setSource] = useState("");
  const [type, setType] = useState("");
  const [tab, setTab] = useState<"all" | "favorites" | "applied">("all");

  useEffect(() => {
    Promise.all([
      fetch(`/api/jobs?q=${encodeURIComponent(q)}&source=${source}&type=${type}`).then((r) => r.json()),
      fetch("/api/dashboard/jobs").then((r) => r.json()),
    ]).then(([jobsData, userData]) => {
      setJobs(jobsData.jobs || []);
      setFavorites(userData.favorites || []);
      setApplications(userData.applications || []);
    }).finally(() => setLoading(false));
  }, [q, source, type]);

  const favSet = useMemo(() => new Set(favorites), [favorites]);

  const displayed = useMemo(() => {
    if (tab === "favorites") return jobs.filter((j) => favSet.has(j.id));
    if (tab === "applied") {
      const appliedIds = new Set(applications.map((a) => a.jobId));
      return jobs.filter((j) => appliedIds.has(j.id));
    }
    return jobs;
  }, [jobs, tab, favSet, applications]);

  async function toggleFavorite(jobId: string) {
    const res = await fetch("/api/dashboard/jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggleFavorite", jobId }),
    });
    const data = await res.json();
    setFavorites(data.favorites || []);
  }

  async function setStatus(jobId: string, status: JobApplicationStatus) {
    const res = await fetch("/api/dashboard/jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setStatus", jobId, status }),
    });
    const data = await res.json();
    setApplications(data.applications || []);
  }

  function getStatus(jobId: string) {
    return applications.find((a) => a.jobId === jobId)?.status;
  }

  if (loading) return <p className="text-app-muted">{t("jobs.loading")}</p>;

  return (
    <div dir={dir} className="max-w-5xl">
      <h1 className="page-title">{t("jobs.title")}</h1>
      <p className="page-subtitle">{t("jobs.subtitle")}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", "favorites", "applied"] as const).map((tabId) => (
          <button
            key={tabId}
            type="button"
            onClick={() => setTab(tabId)}
            className="px-3 py-1.5 text-sm rounded-lg"
            style={tab === tabId ? { background: "var(--app-primary)", color: "#fff" } : { color: "var(--app-text-muted)" }}
          >
            {t(`jobs.tab.${tabId}`)}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("jobs.search")} className="input-field !py-2 text-sm" />
        <select value={source} onChange={(e) => setSource(e.target.value)} className="input-field !py-2 text-sm">
          <option value="">{t("jobs.allSources")}</option>
          <option value="jobs.ps">jobs.ps</option>
          <option value="remotive">Remotive</option>
          <option value="adzuna">Adzuna</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="input-field !py-2 text-sm">
          <option value="">{t("jobs.allTypes")}</option>
          <option value="remote">Remote</option>
          <option value="onsite">On-site</option>
        </select>
      </div>

      <div className="space-y-3">
        {displayed.length === 0 ? (
          <div className="card text-center py-12 text-app-muted">{t("jobs.empty")}</div>
        ) : (
          displayed.map((job) => (
            <article key={job.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold text-app">{job.title}</h2>
                  <p className="text-sm text-app-muted">{job.company} · {job.location}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded-full" style={{ background: "var(--app-primary-muted)", color: "var(--app-primary)" }}>{job.source}</span>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded-full border" style={{ borderColor: "var(--app-border)", color: "var(--app-text-muted)" }}>{job.type}</span>
                  </div>
                  {job.description && <p className="text-sm text-app-muted mt-2 line-clamp-2">{job.description}</p>}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button type="button" onClick={() => toggleFavorite(job.id)} className="p-2 rounded-lg border" style={{ borderColor: "var(--app-border)" }}>
                    <AppIcon name="sparkles" size={16} style={{ color: favSet.has(job.id) ? "var(--app-primary)" : "var(--app-text-muted)" }} />
                  </button>
                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs text-center">{t("jobs.apply")}</a>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t" style={{ borderColor: "var(--app-border)" }}>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(job.id, s)}
                    className="text-xs px-2 py-1 rounded-lg"
                    style={getStatus(job.id) === s ? { background: "var(--app-primary)", color: "#fff" } : { background: "var(--app-input-bg)", color: "var(--app-text-muted)" }}
                  >
                    {t(`jobs.status.${s}`)}
                  </button>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
