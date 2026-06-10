"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppIcon } from "@/components/icons/AppIcons";

interface Profile {
  slug: string;
  name: string;
  position?: string;
  location?: string;
  industry?: string;
  photoUrl?: string;
  skills: string[];
  visitors: number;
  featured: boolean;
}

export default function DiscoverPageClient() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [leaderboard, setLeaderboard] = useState<Profile[]>([]);
  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState("");
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (industry) params.set("industry", industry);
    if (skill) params.set("skill", skill);
    fetch(`/api/discover?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setProfiles(d.profiles || []);
        setLeaderboard(d.leaderboard || []);
      })
      .finally(() => setLoading(false));
  }, [q, industry, skill]);

  return (
    <div className="min-h-screen" style={{ background: "var(--app-bg, #f6f4fb)" }}>
      <header className="border-b px-6 py-8" style={{ borderColor: "var(--app-border, #e4deef)", background: "white" }}>
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-app mb-2">Discover Freelancers</h1>
          <p className="text-app-muted">Browse portfolios, filter by skills, and find top talent.</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="input-field !py-2 text-sm" />
            <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Industry" className="input-field !py-2 text-sm" />
            <input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Skill" className="input-field !py-2 text-sm" />
          </div>

          {loading ? (
            <p className="text-app-muted">Loading...</p>
          ) : profiles.length === 0 ? (
            <p className="text-app-muted">No portfolios found.</p>
          ) : (
            profiles.map((p) => (
              <Link key={p.slug} href={`/portfolio/${p.slug}`} className="card p-4 flex gap-4 hover:shadow-md transition-shadow">
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt={p.name} className="h-16 w-16 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="h-16 w-16 rounded-xl shrink-0 flex items-center justify-center font-bold" style={{ background: "var(--app-primary-muted)", color: "var(--app-primary)" }}>
                    {p.name[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-app">{p.name}</h2>
                    {p.featured && <AppIcon name="trophy" size={14} style={{ color: "var(--app-primary)" }} />}
                  </div>
                  <p className="text-sm text-app-muted">{p.position}{p.location ? ` · ${p.location}` : ""}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.skills.slice(0, 4).map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--app-primary-muted)", color: "var(--app-primary)" }}>{s}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <aside>
          <div className="card p-5">
            <h2 className="font-semibold text-app flex items-center gap-2 mb-4">
              <AppIcon name="trophy" size={18} style={{ color: "var(--app-primary)" }} />
              Leaderboard
            </h2>
            <ol className="space-y-3">
              {leaderboard.map((p, i) => (
                <li key={p.slug} className="flex items-center gap-3">
                  <span className="text-lg font-bold w-6" style={{ color: "var(--app-primary)" }}>{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <Link href={`/portfolio/${p.slug}`} className="text-sm font-medium text-app hover:underline">{p.name}</Link>
                    <p className="text-xs text-app-muted">{p.visitors} visitors</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </main>
    </div>
  );
}
