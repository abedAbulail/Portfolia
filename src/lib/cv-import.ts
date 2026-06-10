import {
  getProjectsForPersonalInfo,
  getSkillsForPersonalInfo,
  getThemeSettings,
  updatePersonalInfo,
  createProject,
  createSkill,
  deleteProject,
  deleteSkill,
  saveThemeSettings,
} from "./airtable";
import { mergeTheme, createSectionInstance } from "./portfolio-theme";
import type { SectionInstance } from "./portfolio-theme";
import type { ParsedCv } from "./cv-parser";

function buildSectionOrder(parsed: ParsedCv): SectionInstance[] {
  const order: SectionInstance[] = [{ id: "about", type: "about" }];
  if (parsed.skills.length) order.push(createSectionInstance("skills", order));
  if (parsed.experience.length) order.push(createSectionInstance("experience", order));
  if (parsed.projects.length) order.push(createSectionInstance("projects", order));
  order.push(createSectionInstance("contact", order));
  return order;
}

export async function applyParsedCv(
  personalInfoId: string,
  parsed: ParsedCv,
  resumeUrl: string
): Promise<{ projects: Awaited<ReturnType<typeof getProjectsForPersonalInfo>>; skills: Awaited<ReturnType<typeof getSkillsForPersonalInfo>> }> {
  await updatePersonalInfo(personalInfoId, {
    email: parsed.email,
    phone: parsed.phone,
    linkedin: parsed.linkedin,
    currentPosition: parsed.currentPosition,
    professionalSummary: parsed.professionalSummary,
    bio: parsed.bio,
    resumeUrl,
  });

  const existingProjects = await getProjectsForPersonalInfo(personalInfoId);
  for (const p of existingProjects) {
    await deleteProject(p.id);
  }

  for (const proj of parsed.projects) {
    if (!proj.projectName.trim()) continue;
    await createProject(personalInfoId, {
      projectName: proj.projectName,
      description: proj.description,
      technologiesUsed: proj.technologiesUsed,
      roleResponsibility: proj.roleResponsibility,
      projectStatus: "Completed",
    });
  }

  const existingSkills = await getSkillsForPersonalInfo(personalInfoId);
  for (const s of existingSkills) {
    await deleteSkill(s.id);
  }

  for (const skillName of parsed.skills) {
    if (!skillName.trim()) continue;
    await createSkill(personalInfoId, {
      skillName: skillName.trim(),
      proficiencyLevel: "Advanced",
    });
  }

  const theme = await getThemeSettings(personalInfoId);
  const updated = mergeTheme(theme, {
    content: {
      experience: parsed.experience,
      education: parsed.education,
      aboutSummary: parsed.professionalSummary,
      aboutBio: parsed.bio,
      skillsOverview: parsed.skills.length
        ? `Proficient in ${parsed.skills.slice(0, 6).join(", ")}${parsed.skills.length > 6 ? ", and more." : "."}`
        : undefined,
    },
    sections: {
      order: buildSectionOrder(parsed),
      titles: theme.sections.titles,
    },
  });
  await saveThemeSettings(personalInfoId, updated);

  const [projects, skills] = await Promise.all([
    getProjectsForPersonalInfo(personalInfoId),
    getSkillsForPersonalInfo(personalInfoId),
  ]);

  return { projects, skills };
}
