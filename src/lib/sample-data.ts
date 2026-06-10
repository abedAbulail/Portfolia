import type { Project, PortfolioData } from "./types";
import type { PortfolioTheme } from "./portfolio-theme";
import type { PlatformData } from "./platform-data";

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
];

export function getSampleProjects(name: string): Omit<Project, "id">[] {
  const firstName = name.split(" ")[0];

  return [
    {
      projectName: "Personal Portfolio Website",
      description:
        "A modern, responsive portfolio website showcasing professional work. Built with performance and accessibility in mind.",
      technologiesUsed: "Next.js, React, Tailwind CSS, TypeScript",
      projectType: "Web",
      projectStatus: "Completed",
      projectHighlights:
        "• Fully responsive design\n• Dark mode support\n• SEO optimized\n• Lighthouse score 95+",
      outcomes: "Increased online visibility and received positive feedback from recruiters.",
      githubRepository: "https://github.com",
      imageUrl: SAMPLE_IMAGES[0],
    },
    {
      projectName: "Task Management App",
      description:
        "A collaborative task management application with real-time updates, drag-and-drop boards, and team workspaces.",
      technologiesUsed: "React, Node.js, PostgreSQL, Socket.io",
      projectType: "SaaS",
      projectStatus: "Completed",
      projectHighlights:
        "• Real-time collaboration\n• Drag-and-drop kanban boards\n• Team permissions\n• Activity notifications",
      outcomes: "Used by 50+ beta testers with 4.8/5 average satisfaction rating.",
      githubRepository: "https://github.com",
      imageUrl: SAMPLE_IMAGES[1],
    },
    {
      projectName: "Analytics Dashboard",
      description:
        "An interactive data visualization dashboard for tracking business metrics, user engagement, and revenue trends.",
      technologiesUsed: "React, D3.js, Python, FastAPI",
      projectType: "Data Science",
      projectStatus: "In Progress",
      projectHighlights:
        "• Interactive charts and graphs\n• Custom date range filtering\n• Export to PDF/CSV\n• Role-based access",
      outcomes: "Helped stakeholders make data-driven decisions 3x faster.",
      githubRepository: "https://github.com",
      imageUrl: SAMPLE_IMAGES[2],
    },
  ].map((p) => ({
    ...p,
    client: `${firstName}'s Demo Project`,
    roleResponsibility: "Lead Developer — designed architecture, built frontend and API integration.",
  }));
}

export function buildThemePreviewData(
  theme: PortfolioTheme,
  data: PortfolioData | null,
  platform: PlatformData | null
): PortfolioData {
  if (data) {
    return { ...data, theme, platform: platform || data.platform };
  }

  const name = "Alex Morgan";
  const samples = getSampleProjects(name);

  return {
    personalInfo: {
      id: "preview",
      name,
      email: "alex@example.com",
      currentPosition: "Senior Product Designer",
      professionalSummary:
        "Designer and developer crafting thoughtful digital experiences with a focus on clarity and performance.",
      bio: "I help teams ship polished products — from research and UX to frontend implementation.",
    },
    projects: samples.map((p, i) => ({ ...p, id: `preview-proj-${i + 1}` })),
    skills: [
      { id: "preview-s1", skillName: "React", proficiencyLevel: "Expert" },
      { id: "preview-s2", skillName: "TypeScript", proficiencyLevel: "Advanced" },
      { id: "preview-s3", skillName: "Figma", proficiencyLevel: "Advanced" },
      { id: "preview-s4", skillName: "Node.js", proficiencyLevel: "Intermediate" },
    ],
    theme,
    platform: platform || undefined,
  };
}
