import ProjectsEditor from "@/components/ProjectsEditor";

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-2">Projects</h1>
      <p className="text-slate-400 text-sm mb-8">
        Showcase your best work. Each project appears on your portfolio.
      </p>
      <ProjectsEditor />
    </div>
  );
}
