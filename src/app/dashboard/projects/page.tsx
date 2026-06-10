import ProjectsEditor from "@/components/ProjectsEditor";

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="page-title">Projects</h1>
      <p className="page-subtitle">
        Showcase your best work. Each project appears on your portfolio.
      </p>
      <ProjectsEditor />
    </div>
  );
}
