"use client";

import { useState } from "react";
import type { PortfolioTheme } from "@/lib/portfolio-theme";

interface ContactFormSectionProps {
  slug: string;
  theme: PortfolioTheme;
  note: string;
  t: (key: string) => string;
  radius: string;
}

export default function ContactFormSection({
  slug,
  theme,
  note,
  t,
  radius,
}: ContactFormSectionProps) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`/api/contact/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-lg mx-auto w-full">
      {note && (
        <p className="text-center mb-6" style={{ color: theme.colors.textMuted }}>
          {note}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder={t("pf.name")}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={`w-full px-4 py-3 text-sm border ${radius}`}
          style={{
            backgroundColor: `${theme.colors.surface}80`,
            borderColor: `${theme.colors.textMuted}30`,
            color: theme.colors.text,
          }}
        />
        <input
          required
          type="email"
          placeholder={t("pf.email")}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`w-full px-4 py-3 text-sm border ${radius}`}
          style={{
            backgroundColor: `${theme.colors.surface}80`,
            borderColor: `${theme.colors.textMuted}30`,
            color: theme.colors.text,
          }}
        />
        <input
          placeholder={t("pf.subject")}
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className={`w-full px-4 py-3 text-sm border ${radius}`}
          style={{
            backgroundColor: `${theme.colors.surface}80`,
            borderColor: `${theme.colors.textMuted}30`,
            color: theme.colors.text,
          }}
        />
        <textarea
          required
          placeholder={t("pf.message")}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={5}
          className={`w-full px-4 py-3 text-sm border resize-y ${radius}`}
          style={{
            backgroundColor: `${theme.colors.surface}80`,
            borderColor: `${theme.colors.textMuted}30`,
            color: theme.colors.text,
          }}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className={`w-full py-3 text-sm font-medium ${radius} disabled:opacity-50`}
          style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}
        >
          {status === "sending" ? t("pf.sending") : t("pf.send")}
        </button>
        {status === "success" && (
          <p className="text-sm text-center" style={{ color: theme.colors.accent }}>
            {t("pf.sent")}
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-center text-red-400">{t("pf.error")}</p>
        )}
      </form>
    </div>
  );
}
