import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPortfolioBySlug } from "@/lib/airtable";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await getPortfolioBySlug(session.slug);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { personalInfo, projects, skills, theme } = data;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${personalInfo.name} - CV</title>
<style>
  body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 0 24px; color: #1a1523; line-height: 1.6; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  h2 { font-size: 16px; color: #6d28d9; border-bottom: 2px solid #e4deef; padding-bottom: 4px; margin-top: 28px; }
  .meta { color: #6b6478; font-size: 14px; }
  .item { margin-bottom: 16px; }
  .item h3 { font-size: 15px; margin: 0 0 4px; }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag { background: #f3eeff; color: #6d28d9; padding: 2px 10px; border-radius: 999px; font-size: 12px; }
</style>
</head>
<body>
  <h1>${personalInfo.name}</h1>
  <p class="meta">${personalInfo.currentPosition || ""}${personalInfo.preferredLocation ? " · " + personalInfo.preferredLocation : ""}</p>
  <p>${personalInfo.email}${personalInfo.phone ? " · " + personalInfo.phone : ""}</p>
  ${personalInfo.professionalSummary ? `<p>${personalInfo.professionalSummary}</p>` : ""}
  ${personalInfo.bio ? `<p>${personalInfo.bio}</p>` : ""}
  ${skills.length ? `<h2>Skills</h2><div class="tags">${skills.map((s) => `<span class="tag">${s.skillName}${s.proficiencyLevel ? " · " + s.proficiencyLevel : ""}</span>`).join("")}</div>` : ""}
  ${projects.length ? `<h2>Projects</h2>${projects.map((p) => `<div class="item"><h3>${p.projectName}</h3><p>${p.description || ""}</p>${p.technologiesUsed ? `<p><em>${p.technologiesUsed}</em></p>` : ""}</div>`).join("")}` : ""}
  ${theme.content.experience.length ? `<h2>Experience</h2>${theme.content.experience.map((e) => `<div class="item"><h3>${e.role} — ${e.company}</h3><p class="meta">${e.period}</p><p>${e.description}</p></div>`).join("")}` : ""}
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${session.slug}-cv.html"`,
    },
  });
}
