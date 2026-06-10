"use client";

import { useEffect, useState } from "react";
import type { PersonalInfo } from "@/lib/types";
import type { ProfileI18n } from "@/lib/portfolio-theme";
import ImageUpload from "@/components/ImageUpload";
import CvUpload from "@/components/CvUpload";

export default function ProfileEditor() {
  const [form, setForm] = useState<Partial<PersonalInfo>>({});
  const [profileI18n, setProfileI18n] = useState<{ ar?: ProfileI18n }>({});
  const [resumeFilename, setResumeFilename] = useState("");
  const [langTab, setLangTab] = useState<"en" | "ar">("en");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/dashboard"), fetch("/api/dashboard/theme")])
      .then(([dashRes, themeRes]) => Promise.all([dashRes.json(), themeRes.json()]))
      .then(([dash, themeData]) => {
        if (dash.personalInfo) {
          const info = dash.personalInfo;
          const resumeUrl = info.resumeUrl || info.resume?.[0]?.url;
          setForm({
            ...info,
            photoUrl: info.photoUrl || info.profilePhoto?.[0]?.url,
            resumeUrl,
          });
          if (info.resume?.[0]?.filename) setResumeFilename(info.resume[0].filename);
          if (themeData.theme?.profileI18n) setProfileI18n(themeData.theme.profileI18n);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function update(field: keyof PersonalInfo, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateAr(field: keyof ProfileI18n, value: string) {
    setProfileI18n((prev) => ({
      ...prev,
      ar: { ...prev.ar, [field]: value },
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/dashboard/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, profileI18n }),
    });

    if (res.ok) {
      setMessage("Profile saved successfully!");
    } else {
      setMessage("Failed to save. Please try again.");
    }
    setSaving(false);
  }

  if (loading) {
    return <p className="text-app-muted">Loading profile...</p>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      <ImageUpload
        label="Profile photo"
        currentUrl={form.photoUrl}
        onUpload={(url) => update("photoUrl", url)}
        type="profile"
      />

      <CvUpload
        currentUrl={form.resumeUrl}
        currentFilename={resumeFilename}
        onUpload={(url, filename) => {
          update("resumeUrl", url);
          setResumeFilename(filename);
        }}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" value={form.name || ""} onChange={(v) => update("name", v)} />
        <Field label="Email" value={form.email || ""} onChange={(v) => update("email", v)} type="email" />
        <Field label="Phone" value={form.phone || ""} onChange={(v) => update("phone", v)} />
        <Field label="Current Position" value={form.currentPosition || ""} onChange={(v) => update("currentPosition", v)} />
        <Field label="Industry" value={form.industry || ""} onChange={(v) => update("industry", v)} />
        <Field label="Location" value={form.preferredLocation || ""} onChange={(v) => update("preferredLocation", v)} />
        <Field label="LinkedIn" value={form.linkedin || ""} onChange={(v) => update("linkedin", v)} type="url" />
        <Field label="Website" value={form.personalWebsite || ""} onChange={(v) => update("personalWebsite", v)} type="url" />
      </div>

      <div className="tab-group">
        <button type="button" onClick={() => setLangTab("en")} className={`tab-btn ${langTab === "en" ? "tab-btn-active" : ""}`}>English</button>
        <button type="button" onClick={() => setLangTab("ar")} className={`tab-btn ${langTab === "ar" ? "tab-btn-active" : ""}`}>العربية</button>
      </div>

      {langTab === "en" ? (
        <>
          <TextArea label="Professional Summary" value={form.professionalSummary || ""} onChange={(v) => update("professionalSummary", v)} />
          <TextArea label="Bio" value={form.bio || ""} onChange={(v) => update("bio", v)} />
          <TextArea label="Skills Overview" value={form.skillsOverview || ""} onChange={(v) => update("skillsOverview", v)} />
        </>
      ) : (
        <div dir="rtl">
          <TextArea label="الملخص المهني (Arabic)" value={profileI18n.ar?.professionalSummary || ""} onChange={(v) => updateAr("professionalSummary", v)} />
          <TextArea label="نبذة (Arabic)" value={profileI18n.ar?.bio || ""} onChange={(v) => updateAr("bio", v)} />
          <TextArea label="نظرة عامة على المهارات (Arabic)" value={profileI18n.ar?.skillsOverview || ""} onChange={(v) => updateAr("skillsOverview", v)} />
          <Field label="المسمى الوظيفي (Arabic)" value={profileI18n.ar?.currentPosition || ""} onChange={(v) => updateAr("currentPosition", v)} />
        </div>
      )}

      {message && (
        <p className={`text-sm ${message.includes("success") ? "text-emerald-400" : "text-red-400"}`}>
          {message}
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="label-text">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="input-field" />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="label-text">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="input-field resize-y"
      />
    </div>
  );
}
