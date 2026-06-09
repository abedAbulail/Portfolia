"use client";

import { AppIcon } from "@/components/icons/AppIcons";

import { useEffect, useState } from "react";
import type { Skill } from "@/lib/types";

const CATEGORIES = ["Technical", "Creative", "Management", "Communication", "Marketing", "Language", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

const emptySkill = (): Omit<Skill, "id"> => ({
  skillName: "",
  category: "Technical",
  proficiencyLevel: "Intermediate",
  skillDescription: "",
  certificationName: "",
  certificationBody: "",
});

export default function SkillsEditor() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Omit<Skill, "id"> & { id?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    const res = await fetch("/api/dashboard/skills");
    const data = await res.json();
    setSkills(data.skills || []);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    const isNew = !editing.id;
    const res = await fetch("/api/dashboard/skills", {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (res.ok) {
      await loadSkills();
      setEditing(null);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this skill?")) return;
    await fetch("/api/dashboard/skills", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadSkills();
  }

  if (loading) return <p className="text-slate-400">Loading skills...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">{skills.length} skill(s)</p>
        <button
          type="button"
          onClick={() => setEditing(emptySkill())}
          className="btn-primary text-sm"
        >
          + Add skill
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-6 space-y-4">
          <h3 className="font-semibold text-white">
            {editing.id ? "Edit skill" : "New skill"}
          </h3>
          <input
            required
            placeholder="Skill name"
            value={editing.skillName}
            onChange={(e) => setEditing({ ...editing, skillName: e.target.value })}
            className="input-field"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={editing.category || ""}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              className="input-field"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={editing.proficiencyLevel || ""}
              onChange={(e) => setEditing({ ...editing, proficiencyLevel: e.target.value })}
              className="input-field"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Description"
            value={editing.skillDescription || ""}
            onChange={(e) => setEditing({ ...editing, skillDescription: e.target.value })}
            rows={2}
            className="input-field resize-y"
          />
          <input
            placeholder="Certification name (optional)"
            value={editing.certificationName || ""}
            onChange={(e) => setEditing({ ...editing, certificationName: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Certification body (optional)"
            value={editing.certificationBody || ""}
            onChange={(e) => setEditing({ ...editing, certificationBody: e.target.value })}
            className="input-field"
          />
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary text-sm">
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-white">{skill.skillName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {skill.category} · {skill.proficiencyLevel}
                </p>
                {skill.certificationName && (
                  <p className="text-xs text-violet-400 mt-1 inline-flex items-center gap-1">
                    <AppIcon name="trophy" size={12} />
                    {skill.certificationName}
                  </p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditing(skill)}
                  className="text-sm text-slate-400 hover:text-white px-2 py-1"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(skill.id)}
                  className="text-sm text-red-400 hover:text-red-300 px-2 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && !editing && (
        <p className="text-slate-500 text-center py-8">
          No skills yet. Add your skills and certifications.
        </p>
      )}
    </div>
  );
}
