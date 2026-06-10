"use client";

import { useEffect, useState } from "react";
import type { PortfolioTheme } from "@/lib/portfolio-theme";
import { getRadiusClass } from "@/lib/portfolio-theme";

export default function BookingWidget({
  slug,
  theme,
}: {
  slug: string;
  theme: PortfolioTheme;
}) {
  const [enabled, setEnabled] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", date: "", time: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    fetch(`/api/booking/${slug}`)
      .then((r) => r.json())
      .then((d) => setEnabled(!!d.enabled))
      .catch(() => setEnabled(false));
  }, [slug]);

  const radius = getRadiusClass(theme.layout.borderRadius);

  if (!enabled) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch(`/api/booking/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "done" : "error");
  }

  return (
    <form onSubmit={submit} className={`border p-6 space-y-4 max-w-md mx-auto ${radius}`} style={{ borderColor: `${theme.colors.textMuted}20`, backgroundColor: `${theme.colors.surface}80` }}>
      <h3 className="font-semibold text-lg">Book a meeting</h3>
      <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: `${theme.colors.textMuted}30`, background: theme.colors.background, color: theme.colors.text }} />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: `${theme.colors.textMuted}30`, background: theme.colors.background, color: theme.colors.text }} />
      <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: `${theme.colors.textMuted}30`, background: theme.colors.background, color: theme.colors.text }} />
      <input required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: `${theme.colors.textMuted}30`, background: theme.colors.background, color: theme.colors.text }} />
      <textarea placeholder="Message (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: `${theme.colors.textMuted}30`, background: theme.colors.background, color: theme.colors.text }} />
      <button type="submit" disabled={status === "loading"} className="w-full py-2.5 rounded-lg text-sm font-medium text-white" style={{ background: theme.colors.primary }}>
        {status === "loading" ? "Sending..." : status === "done" ? "Request sent!" : "Request booking"}
      </button>
    </form>
  );
}
