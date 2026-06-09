"use client";

import { useEffect, useState, FormEvent } from "react";
import { useLocale } from "@/context/LocaleContext";

interface AccountData {
  email: string;
  createdTime: string;
}

export default function AccountPageClient() {
  const { t, dir } = useLocale();
  const [account, setAccount] = useState<AccountData | null>(null);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/account")
      .then((r) => r.json())
      .then((d) => {
        if (d.account) {
          setAccount(d.account);
          setEmail(d.account.email);
        }
      });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const body: Record<string, string> = {};
    if (email !== account?.email) body.email = email;
    if (newPassword) {
      body.currentPassword = currentPassword;
      body.newPassword = newPassword;
    }

    if (!body.email && !body.newPassword) {
      setError(t("acc.noChanges"));
      setSaving(false);
      return;
    }

    const res = await fetch("/api/dashboard/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (res.ok) {
      setMessage(t("acc.updated"));
      setAccount((prev) => (prev ? { ...prev, email } : prev));
      setCurrentPassword("");
      setNewPassword("");
    } else {
      setError(data.error || t("acc.error"));
    }
    setSaving(false);
  }

  if (!account) {
    return <p style={{ color: "var(--app-text-muted)" }}>{t("acc.loading")}</p>;
  }

  const createdDate = new Date(account.createdTime).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div dir={dir} className="max-w-lg">
      <h1 className="font-display text-2xl font-bold mb-1" style={{ color: "var(--app-text)" }}>
        {t("acc.title")}
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--app-text-muted)" }}>
        {t("acc.subtitle")}
      </p>

      <div className="card mb-6">
        <p className="text-sm mb-1" style={{ color: "var(--app-text-muted)" }}>
          {t("acc.createdAt")}
        </p>
        <p className="font-medium" style={{ color: "var(--app-text)" }}>
          {createdDate}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="block text-sm mb-1.5" style={{ color: "var(--app-text-muted)" }}>
            {t("acc.email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <hr style={{ borderColor: "var(--app-border)" }} />

        <p className="text-sm font-medium" style={{ color: "var(--app-text)" }}>
          {t("acc.changePassword")}
        </p>

        <div>
          <label className="block text-sm mb-1.5" style={{ color: "var(--app-text-muted)" }}>
            {t("acc.currentPassword")}
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input-field"
            autoComplete="current-password"
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5" style={{ color: "var(--app-text-muted)" }}>
            {t("acc.newPassword")}
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field"
            autoComplete="new-password"
            minLength={6}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {message && <p className="text-sm text-emerald-500">{message}</p>}

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? t("acc.saving") : t("acc.save")}
        </button>
      </form>
    </div>
  );
}
