import SkillsEditor from "@/components/SkillsEditor";

export default function SkillsPage() {
  return (
    <div>
      <h1 className="page-title">Skills & Certifications</h1>
      <p className="page-subtitle">
        Add your skills, proficiency levels, and any certifications.
      </p>
      <SkillsEditor />
    </div>
  );
}
