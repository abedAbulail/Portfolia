"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";
import ImageUpload from "@/components/ImageUpload";

const PROJECT_TYPES = ["Web", "Mobile", "Desktop", "Data Science", "SaaS", "AI/ML", "Other"];
const PROJECT_STATUSES = ["Completed", "In Progress", "Planned"];

const emptyProject = (): Omit<Project, "id"> => ({
  projectName: "",
  description: "",
  technologiesUsed: "",
  projectType: "Web",
  projectStatus: "In Progress",
  githubRepository: "",
  projectHighlights: "",
  outcomes: "",
  imageUrl: "",
});

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Omit<Project, "id"> & { id?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const res = await fetch("/api/dashboard/projects");
    const data = await res.json();
    setProjects(data.projects || []);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    const isNew = !editing.id;
    const res = await fetch("/api/dashboard/projects", {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (res.ok) {
      await loadProjects();
      setEditing(null);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch("/api/dashboard/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadProjects();
  }

  if (loading) return <p className="text-slate-400">Loading projects...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">{projects.length} project(s)</p>
        <button
          type="button"
          onClick={() => setEditing(emptyProject())}
          className="btn-primary text-sm"
        >
          + Add project
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-6 space-y-4">
          <h3 className="font-semibold text-white">
            {editing.id ? "Edit project" : "New project"}
          </h3>
          <input
            required
            placeholder="Project name"
            value={editing.projectName}
            onChange={(e) => setEditing({ ...editing, projectName: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Description"
            value={editing.description || ""}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            rows={3}
            className="input-field resize-y"
          />
          <input
            placeholder="Technologies (e.g. React, Node.js)"
            value={editing.technologiesUsed || ""}
            onChange={(e) => setEditing({ ...editing, technologiesUsed: e.target.value })}
            className="input-field"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={editing.projectType || ""}
              onChange={(e) => setEditing({ ...editing, projectType: e.target.value })}
              className="input-field"
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={editing.projectStatus || ""}
              onChange={(e) => setEditing({ ...editing, projectStatus: e.target.value })}
              className="input-field"
            >
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <input
            placeholder="GitHub URL"
            value={editing.githubRepository || ""}
            onChange={(e) => setEditing({ ...editing, githubRepository: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Highlights"
            value={editing.projectHighlights || ""}
            onChange={(e) => setEditing({ ...editing, projectHighlights: e.target.value })}
            rows={2}
            className="input-field resize-y"
          />
          <ImageUpload
            label="Project photo"
            currentUrl={editing.imageUrl}
            onUpload={(url) => setEditing({ ...editing, imageUrl: url })}
            type="project"
            recordId={editing.id}
            disabled={!editing.id}
            disabledHint="Save the project first, then upload a photo."
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

      <div className="space-y-3">
        {projects.map((project) => {
          const thumb = project.imageUrl || project.projectImages?.[0]?.url;
          return (
          <div
            key={project.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-5"
          >
            {thumb && (
              <img
                src={thumb}
                alt={project.projectName}
                className="h-16 w-24 shrink-0 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white">{project.projectName}</h3>
              {project.description && (
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{project.description}</p>
              )}
              <div className="flex gap-2 mt-2">
                {project.projectType && (
                  <span className="text-xs text-violet-300">{project.projectType}</span>
                )}
                {project.projectStatus && (
                  <span className="text-xs text-emerald-300">· {project.projectStatus}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    ...project,
                    imageUrl: project.imageUrl || project.projectImages?.[0]?.url || "",
                  })
                }
                className="text-sm text-slate-400 hover:text-white px-2 py-1"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(project.id)}
                className="text-sm text-red-400 hover:text-red-300 px-2 py-1"
              >
                Delete
              </button>
            </div>
          </div>
        );
        })}

        {projects.length === 0 && !editing && (
          <p className="text-slate-500 text-center py-8">
            No projects yet. Add your first project to showcase your work.
          </p>
        )}
      </div>
    </div>
  );
}
