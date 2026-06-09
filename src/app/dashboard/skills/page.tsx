import SkillsEditor from "@/components/SkillsEditor";

export default function SkillsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-2">Skills & Certifications</h1>
      <p className="text-slate-400 text-sm mb-8">
        Add your skills, proficiency levels, and any certifications.
      </p>
      <SkillsEditor />
    </div>
  );
}
