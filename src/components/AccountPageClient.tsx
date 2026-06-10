"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import CvUpload from "@/components/CvUpload";

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
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFilename, setResumeFilename] = useState("");
  const [reimporting, setReimporting] = useState(false);
  const [cvMessage, setCvMessage] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/dashboard/account"), fetch("/api/dashboard")]).then(([accRes, dashRes]) =>
      Promise.all([accRes.json(), dashRes.json()]).then(([acc, dash]) => {
        if (acc.account) {
          setAccount(acc.account);
          setEmail(acc.account.email);
        }
        if (dash.personalInfo) {
          const url = dash.personalInfo.resumeUrl || dash.personalInfo.resume?.[0]?.url;
          setResumeUrl(url || "");
          if (dash.personalInfo.resume?.[0]?.filename) {
            setResumeFilename(dash.personalInfo.resume[0].filename);
          }
        }
      })
    );
  }, []);

  async function handleReimportCv(file: File) {
    setReimporting(true);
    setCvMessage("");
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/cv/parse", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to import CV.");
        return;
      }
      setResumeUrl(json.resumeUrl);
      setCvMessage("Portfolio updated from your new CV.");
    } catch {
      setError("Import failed. Please try again.");
    } finally {
      setReimporting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
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
      <h1 className="page-title">{t("acc.title")}</h1>
      <p className="page-subtitle">{t("acc.subtitle")}</p>

      <div className="card mb-6 flex flex-wrap gap-3 items-center justify-between">
        <div>
          <p className="text-sm mb-1" style={{ color: "var(--app-text-muted)" }}>
            {t("acc.createdAt")}
          </p>
          <p className="font-medium" style={{ color: "var(--app-text)" }}>
            {createdDate}
          </p>
        </div>
        <a href="/api/cv/generate" className="btn-secondary text-sm">
          Generate CV
        </a>
      </div>

      <div className="card mb-6 space-y-4">
        <h2 className="text-sm font-semibold" style={{ color: "var(--app-text)" }}>
          Resume / CV
        </h2>
        <CvUpload
          currentUrl={resumeUrl}
          currentFilename={resumeFilename}
          onUpload={(url, filename) => {
            setResumeUrl(url);
            setResumeFilename(filename);
          }}
        />
        <div>
          <p className="text-xs mb-2" style={{ color: "var(--app-text-muted)" }}>
            Upload a new CV to re-import your profile, projects, and skills.
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={reimporting}
            className="input-field text-sm block w-full"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleReimportCv(f);
            }}
          />
          {reimporting && (
            <p className="text-xs mt-2" style={{ color: "var(--app-primary)" }}>
              Uploading and updating your portfolio…
            </p>
          )}
          {cvMessage && <p className="text-xs mt-2 text-emerald-500">{cvMessage}</p>}
        </div>
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
