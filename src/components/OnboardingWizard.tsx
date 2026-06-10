"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import PortfolioClient from "@/components/PortfolioClient";
import ThemesPanel from "@/components/editor/ThemesPanel";
import type { PortfolioData, Project, Skill } from "@/lib/types";
import type { PortfolioTheme } from "@/lib/portfolio-theme";
import { DEFAULT_THEME, mergeTheme } from "@/lib/portfolio-theme";
import type { PlatformData } from "@/lib/platform-data";
import { buildThemePreviewData } from "@/lib/sample-data";
import { AppIcon } from "@/components/icons/AppIcons";

const STEPS = [
  { id: 1, label: "Upload CV" },
  { id: 2, label: "Choose theme" },
  { id: 3, label: "Project photos" },
  { id: 4, label: "Skills" },
  { id: 5, label: "Preview" },
];

const LOADING_MESSAGES = [
  "Uploading your CV…",
  "Reading your experience…",
  "Extracting skills & projects…",
  "Building your portfolio…",
  "Almost ready…",
];

export default function OnboardingWizard({ slug }: { slug: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState<PortfolioTheme>(DEFAULT_THEME);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [platform, setPlatform] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [error, setError] = useState("");
  const [finishing, setFinishing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const msgTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = useCallback(async () => {
    const [dash, themeRes, platformRes] = await Promise.all([
      fetch("/api/dashboard"),
      fetch("/api/dashboard/theme"),
      fetch("/api/dashboard/platform"),
    ]);
    const [dashJson, themeJson, platformJson] = await Promise.all([
      dash.json(),
      themeRes.json(),
      platformRes.json(),
    ]);
    if (dashJson.personalInfo) {
      const loadedTheme = themeJson.theme || DEFAULT_THEME;
      setTheme(loadedTheme);
      setPlatform(platformJson.platform);
      setData({
        personalInfo: {
          ...dashJson.personalInfo,
          resumeUrl: dashJson.personalInfo.resumeUrl || dashJson.personalInfo.resume?.[0]?.url,
        },
        projects: dashJson.projects || [],
        skills: dashJson.skills || [],
        theme: loadedTheme,
        platform: platformJson.platform,
      });
      if (platformJson.platform?.onboarding?.step && platformJson.platform.onboarding.step > 1) {
        setStep(platformJson.platform.onboarding.step);
      }
      if (dashJson.personalInfo.resumeUrl && dashJson.projects?.length) {
        setStep(Math.max(2, platformJson.platform?.onboarding?.step || 2));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (parsing) {
      setLoadingMsg(0);
      msgTimer.current = setInterval(() => {
        setLoadingMsg((m) => (m + 1) % LOADING_MESSAGES.length);
      }, 2200);
    } else if (msgTimer.current) {
      clearInterval(msgTimer.current);
    }
    return () => {
      if (msgTimer.current) clearInterval(msgTimer.current);
    };
  }, [parsing]);

  async function saveStep(nextStep: number) {
    await fetch("/api/dashboard/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: nextStep }),
    });
    setStep(nextStep);
  }

  async function handleCvUpload(file: File) {
    setError("");
    setParsing(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/cv/parse", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to parse CV.");
        return;
      }
      const loadedTheme = mergeTheme(theme, {
        content: {
          aboutSummary: json.parsed.professionalSummary,
          aboutBio: json.parsed.bio,
        },
      });
      setTheme(loadedTheme);
      await fetch("/api/dashboard/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loadedTheme),
      });
      setData({
        personalInfo: json.personalInfo,
        projects: json.projects,
        skills: json.skills,
        theme: loadedTheme,
        platform: platform || undefined,
      });
      await saveStep(2);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setParsing(false);
    }
  }

  async function applyTheme(fullTheme: PortfolioTheme) {
    setTheme(fullTheme);
    await fetch("/api/dashboard/theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullTheme),
    });
    setData((d) => (d ? { ...d, theme: fullTheme } : d));
  }

  async function uploadProjectPhoto(projectId: string, file: File) {
    const form = new FormData();
    form.append("file", file);
    form.append("type", "project");
    form.append("recordId", projectId);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();
    if (res.ok && json.url) {
      await fetch("/api/dashboard/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: projectId, imageUrl: json.url }),
      });
      setData((d) => {
        if (!d) return d;
        return {
          ...d,
          projects: d.projects.map((p) => (p.id === projectId ? { ...p, imageUrl: json.url } : p)),
        };
      });
    }
  }

  async function updateProjectField(id: string, field: keyof Project, value: string) {
    setData((d) => {
      if (!d) return d;
      return { ...d, projects: d.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)) };
    });
    await fetch("/api/dashboard/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: value }),
    });
  }

  async function addSkill(name: string) {
    if (!name.trim()) return;
    const res = await fetch("/api/dashboard/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillName: name.trim(), proficiencyLevel: "Advanced" }),
    });
    const json = await res.json();
    if (res.ok && json.skill) {
      setData((d) => (d ? { ...d, skills: [...d.skills, json.skill] } : d));
    }
  }

  async function removeSkill(id: string) {
    await fetch("/api/dashboard/skills", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setData((d) => (d ? { ...d, skills: d.skills.filter((s) => s.id !== id) } : d));
  }

  async function updateProfile(fields: Record<string, string>) {
    await fetch("/api/dashboard/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    setData((d) => (d ? { ...d, personalInfo: { ...d.personalInfo, ...fields } } : d));
    if (fields.professionalSummary || fields.bio) {
      const contentPatch = {
        aboutSummary: fields.professionalSummary,
        aboutBio: fields.bio,
      };
      const next = mergeTheme(theme, { content: contentPatch });
      setTheme(next);
      await fetch("/api/dashboard/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
    }
  }

  async function finishSetup() {
    setFinishing(true);
    await fetch("/api/dashboard/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ complete: true, step: 6 }),
    });
    router.push("/dashboard");
    router.refresh();
  }

  if (loading) {
    return (
      <OnboardingBackdrop>
        <OnboardingModalCard step={1} size="default">
          <div className="py-12 text-center">
            <p style={{ color: "var(--app-text-muted)" }}>Loading setup…</p>
          </div>
        </OnboardingModalCard>
      </OnboardingBackdrop>
    );
  }

  if (parsing) {
    return (
      <OnboardingBackdrop>
        <OnboardingModalCard step={1} size="default">
          <div className="py-8 flex flex-col items-center text-center">
            <div className="relative w-20 h-20 mb-6">
              <div
                className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
                style={{ borderTopColor: "var(--app-primary)", borderRightColor: "var(--app-primary)" }}
              />
              <div
                className="absolute inset-2 rounded-full flex items-center justify-center"
                style={{ background: "var(--app-primary-muted)" }}
              >
                <AppIcon name="file" size={24} style={{ color: "var(--app-primary)" }} />
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--app-text)" }}>
              {LOADING_MESSAGES[loadingMsg]}
            </h2>
            <p className="text-sm max-w-xs" style={{ color: "var(--app-text-muted)" }}>
              We&apos;re uploading your info and creating your portfolio. This usually takes a few seconds.
            </p>
          </div>
        </OnboardingModalCard>
      </OnboardingBackdrop>
    );
  }

  const previewData = data ? { ...data, theme, platform: platform || data.platform } : null;

  return (
    <OnboardingBackdrop>
      <OnboardingModalCard step={step} size={step === 2 ? "xl" : step === 5 ? "wide" : "default"}>
        {step === 1 && (
          <div className="space-y-5">
            <StepHeading
              title="Upload your CV"
              description="PDF, DOC, or DOCX. We'll read your experience, skills, and projects to build your portfolio automatically."
            />
            <div
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:opacity-90"
              style={{ borderColor: "var(--app-primary)", background: "var(--app-primary-muted)" }}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleCvUpload(f);
              }}
              onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <AppIcon name="file" size={36} className="mx-auto mb-3" style={{ color: "var(--app-primary)" }} />
              <p className="font-medium mb-1 text-sm" style={{ color: "var(--app-text)" }}>
                Drop your CV here or click to browse
              </p>
              <p className="text-xs" style={{ color: "var(--app-text-muted)" }}>
                PDF, DOC, DOCX — max 10MB
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleCvUpload(f);
                }}
              />
            </div>
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <StepHeading
              title="Choose a theme"
              description="Pick a look for your portfolio. The preview updates as you select each theme."
            />
            <div className="grid lg:grid-cols-2 gap-5 items-start">
              <div className="min-h-0 max-h-[min(52vh,520px)] overflow-y-auto pr-1">
                <ThemesPanel theme={theme} updateTheme={applyTheme} />
              </div>
              <ThemePreviewPanel
                data={buildThemePreviewData(theme, data, platform)}
                slug={slug}
                isUserContent={!!data}
              />
            </div>
            <ModalActions>
              <button type="button" onClick={() => saveStep(3)} className="btn-primary w-full sm:w-auto">
                Continue
              </button>
            </ModalActions>
          </div>
        )}

        {step === 3 && data && (
          <div className="space-y-5">
            <StepHeading
              title="Your projects"
              description="Text comes from your CV. Add photos optionally — one per project."
            />
            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
              {data.projects.map((project) => (
                <ProjectSetupCard
                  key={project.id}
                  project={project}
                  onPhoto={(file) => uploadProjectPhoto(project.id, file)}
                  onUpdate={(field, value) => updateProjectField(project.id, field, value)}
                />
              ))}
              {!data.projects.length && (
                <p className="text-sm text-center py-4" style={{ color: "var(--app-text-muted)" }}>
                  No projects found in your CV. You can add them later in Dashboard → Projects.
                </p>
              )}
            </div>
            <ModalActions>
              <button type="button" onClick={() => setStep(2)} className="btn-secondary">
                Back
              </button>
              <button type="button" onClick={() => saveStep(4)} className="btn-primary">
                Continue
              </button>
            </ModalActions>
          </div>
        )}

        {step === 4 && data && (
          <SkillsSetupStep
            skills={data.skills}
            onAdd={addSkill}
            onRemove={removeSkill}
            onBack={() => setStep(3)}
            onContinue={() => saveStep(5)}
          />
        )}

        {step === 5 && previewData && data && (
          <div className="space-y-5">
            <StepHeading
              title="Preview & edit"
              description="Review your portfolio. Edit the summary and bio below, then launch."
            />
            <div className="card space-y-3">
              <label className="text-xs font-medium" style={{ color: "var(--app-text-muted)" }}>
                Professional summary
              </label>
              <textarea
                className="input-field text-sm resize-y"
                rows={2}
                value={data.personalInfo.professionalSummary || ""}
                onChange={(e) =>
                  setData((d) =>
                    d ? { ...d, personalInfo: { ...d.personalInfo, professionalSummary: e.target.value } } : d
                  )
                }
                onBlur={(e) => updateProfile({ professionalSummary: e.target.value })}
              />
              <label className="text-xs font-medium" style={{ color: "var(--app-text-muted)" }}>
                Bio
              </label>
              <textarea
                className="input-field text-sm resize-y"
                rows={3}
                value={data.personalInfo.bio || ""}
                onChange={(e) =>
                  setData((d) => (d ? { ...d, personalInfo: { ...d.personalInfo, bio: e.target.value } } : d))
                }
                onBlur={(e) => updateProfile({ bio: e.target.value })}
              />
            </div>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--app-border)" }}>
              <div className="max-h-[36vh] overflow-auto">
                <PortfolioClient data={previewData} slug={slug} />
              </div>
            </div>
            <ModalActions>
              <button type="button" onClick={() => setStep(4)} className="btn-secondary">
                Back
              </button>
              <button type="button" onClick={finishSetup} disabled={finishing} className="btn-primary">
                {finishing ? "Launching…" : "Launch my portfolio"}
              </button>
            </ModalActions>
          </div>
        )}
      </OnboardingModalCard>
    </OnboardingBackdrop>
  );
}

function OnboardingBackdrop({ children }: { children: ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{
        background: "color-mix(in srgb, var(--app-bg) 75%, #000 25%)",
        backdropFilter: "blur(6px)",
      }}
    >
      {children}
    </div>
  );
}

function OnboardingModalCard({
  step,
  size = "default",
  children,
}: {
  step: number;
  size?: "default" | "wide" | "xl";
  children: ReactNode;
}) {
  const current = STEPS.find((s) => s.id === step);
  const sizeClass =
    size === "xl" ? "max-w-5xl" : size === "wide" ? "max-w-3xl" : "max-w-md";

  return (
    <div
      className={`w-full flex flex-col rounded-2xl border overflow-hidden max-h-[min(90dvh,820px)] shadow-2xl ${sizeClass}`}
      style={{
        background: "var(--app-sidebar-bg)",
        borderColor: "var(--app-border)",
        boxShadow: "0 24px 48px -12px rgba(0,0,0,0.35)",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div
        className="shrink-0 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b"
        style={{ borderColor: "var(--app-border)" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--app-primary)" }}>
          Step {step} of {STEPS.length}
          {current ? ` · ${current.label}` : ""}
        </p>
        <h1 id="onboarding-title" className="font-display text-lg font-semibold mb-4" style={{ color: "var(--app-text)" }}>
          Set up your portfolio
        </h1>
        <StepIndicator current={step} />
      </div>
      <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6 min-h-0">{children}</div>
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-start justify-between gap-1">
      {STEPS.map((s, index) => {
        const done = s.id < current;
        const active = s.id === current;
        return (
          <li key={s.id} className="flex flex-1 items-start min-w-0 last:flex-none">
            <div className="flex flex-col items-center w-full min-w-0">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div
                    className="h-0.5 flex-1 shrink"
                    style={{ background: s.id <= current ? "var(--app-primary)" : "var(--app-border)" }}
                  />
                )}
                <div
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all"
                  style={{
                    background: active ? "var(--app-primary)" : done ? "var(--app-primary-muted)" : "var(--app-input-bg)",
                    borderColor: active || done ? "var(--app-primary)" : "var(--app-border)",
                    color: active ? "#fff" : done ? "var(--app-primary)" : "var(--app-text-muted)",
                  }}
                >
                  {done ? "✓" : s.id}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className="h-0.5 flex-1 shrink"
                    style={{ background: s.id < current ? "var(--app-primary)" : "var(--app-border)" }}
                  />
                )}
              </div>
              <span
                className="text-[9px] sm:text-[10px] mt-1.5 text-center leading-tight truncate w-full px-0.5 hidden sm:block"
                style={{ color: active ? "var(--app-text)" : "var(--app-text-muted)" }}
              >
                {s.label}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function StepHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center sm:text-left">
      <h2 className="text-lg font-semibold mb-1.5" style={{ color: "var(--app-text)" }}>
        {title}
      </h2>
      <p className="text-sm leading-relaxed" style={{ color: "var(--app-text-muted)" }}>
        {description}
      </p>
    </div>
  );
}

function ThemePreviewPanel({
  data,
  slug,
  isUserContent,
}: {
  data: PortfolioData;
  slug: string;
  isUserContent: boolean;
}) {
  return (
    <div className="flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-2 shrink-0 gap-2">
        <p
          className="text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--app-text-muted)" }}
        >
          Live preview
        </p>
        {data.theme.activeThemeId && (
          <span className="text-xs capitalize truncate" style={{ color: "var(--app-primary)" }}>
            {data.theme.activeThemeId.replace(/-/g, " ")}
          </span>
        )}
      </div>
      <div
        className="rounded-xl border overflow-hidden shadow-inner min-h-[280px] max-h-[min(48vh,480px)]"
        style={{ borderColor: "var(--app-border)", background: "var(--app-bg)" }}
      >
        <div className="h-full max-h-[min(48vh,480px)] overflow-auto">
          <PortfolioClient data={data} slug={slug} />
        </div>
      </div>
      <p className="text-[11px] mt-2 text-center sm:text-left" style={{ color: "var(--app-text-muted)" }}>
        {isUserContent
          ? "Showing your CV content with the selected theme."
          : "Sample content — your CV data will appear here after upload."}
      </p>
    </div>
  );
}

function ModalActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t" style={{ borderColor: "var(--app-border)" }}>
      {children}
    </div>
  );
}

function ProjectSetupCard({
  project,
  onPhoto,
  onUpdate,
}: {
  project: Project;
  onPhoto: (file: File) => void;
  onUpdate: (field: keyof Project, value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="card flex flex-col sm:flex-row gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="shrink-0 w-full sm:w-32 h-24 rounded-lg border flex items-center justify-center overflow-hidden"
        style={{ borderColor: "var(--app-border)", background: "var(--app-input-bg)" }}
      >
        {project.imageUrl ? (
          <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs" style={{ color: "var(--app-text-muted)" }}>
            Add photo
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPhoto(f);
        }}
      />
      <div className="flex-1 space-y-2 min-w-0">
        <input
          className="input-field text-sm font-medium"
          value={project.projectName}
          onChange={(e) => onUpdate("projectName", e.target.value)}
        />
        <textarea
          className="input-field text-xs resize-y"
          rows={3}
          value={project.description || ""}
          onChange={(e) => onUpdate("description", e.target.value)}
        />
      </div>
    </div>
  );
}

function SkillsSetupStep({
  skills,
  onAdd,
  onRemove,
  onBack,
  onContinue,
}: {
  skills: Skill[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [newSkill, setNewSkill] = useState("");
  return (
    <div className="space-y-5">
      <StepHeading
        title="Your skills"
        description="Imported from your CV. Add any skills we missed."
      />
      <div className="flex flex-wrap gap-2 max-h-[28vh] overflow-y-auto">
        {skills.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border"
            style={{ borderColor: "var(--app-border)", background: "var(--app-input-bg)", color: "var(--app-text)" }}
          >
            {s.skillName}
            <button type="button" onClick={() => onRemove(s.id)} className="text-red-400 hover:text-red-300">
              <AppIcon name="x" size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="input-field text-sm flex-1"
          placeholder="Add a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd(newSkill);
              setNewSkill("");
            }
          }}
        />
        <button
          type="button"
          className="btn-secondary text-sm shrink-0"
          onClick={() => {
            onAdd(newSkill);
            setNewSkill("");
          }}
        >
          Add
        </button>
      </div>
      <ModalActions>
        <button type="button" onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button type="button" onClick={onContinue} className="btn-primary">
          Continue
        </button>
      </ModalActions>
    </div>
  );
}
