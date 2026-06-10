import type { ParsedCv, ParsedCvProject } from "./cv-parser";

const BULLET_PREFIX = /^[\s\u2022\u25CF\u25E6\u2043\u2219\uF0B7\u0089\-*•]+/;

const ACTION_VERB =
  /^(implemented|built|designed|developed|enabled|integrated|extracted|generates|created|led|managed|maintained|improved|built for|designed scalable|developed an|built a|built multi)/i;

const CATEGORY_ONLY =
  /^(databases|backend|frontend|tools|languages|frameworks|systems?|technical skills?|core competencies|backend & ai systems?)$/i;

const KNOWN_TECH =
  /\b(fastapi|next\.?js|react|python|mysql|postgresql|mongodb|redis|typescript|javascript|node\.?js|chromadb|docker|kubernetes|aws|gcp|azure|llm|rag|openai|langchain|whatsapp|voice ai|tailwind|graphql|rest|api|saas|firebase|vercel|git)\b/i;

export function preprocessCvText(text: string): string {
  return text
    .replace(/\uF0B7/g, "\n• ")
    .replace(/[\u0089\u2022\u25CF\u25E6\u2043\u2219]/g, "• ")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function isBulletLine(line: string): boolean {
  const trimmed = line.trim();
  if (BULLET_PREFIX.test(trimmed)) return true;
  if (/^[-*]\s+/.test(trimmed)) return true;
  return ACTION_VERB.test(trimmed);
}

export function looksLikeProjectTitle(line: string): boolean {
  const cleaned = line.replace(BULLET_PREFIX, "").replace(/^[-*]\s+/, "").trim();
  if (!cleaned || cleaned.length > 90) return false;
  if (isBulletLine(line)) return false;
  if (ACTION_VERB.test(cleaned)) return false;
  if (/\d{4}\s*[-–—]/.test(cleaned)) return false;

  if (/platform|system|app|catalog|bot|saas|automation|call center|dashboard|website|portfolio|engine/i.test(cleaned)) {
    return true;
  }

  return /^[A-Z][A-Za-z0-9\s/&\-–—]{2,68}$/.test(cleaned);
}

export function cleanSkillName(raw: string): string[] {
  const segment = raw.replace(BULLET_PREFIX, "").trim();
  if (!segment || segment.length > 45) return [];

  if (CATEGORY_ONLY.test(segment)) return [];

  const parts = segment.split(/[•·|,;]/).map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];

  for (const part of parts) {
    if (CATEGORY_ONLY.test(part)) continue;

    if (KNOWN_TECH.test(part)) {
      const matches = part.match(
        /\b(FastAPI|Next\.js|React|Python|MySQL|PostgreSQL|MongoDB|Redis|TypeScript|JavaScript|Node\.js|ChromaDB|Docker|Kubernetes|AWS|GCP|Azure|LLM|RAG|OpenAI|LangChain|WhatsApp|Voice AI|Tailwind|GraphQL|REST|API|SaaS|Firebase|Vercel|Git)\b/gi
      );
      if (matches) {
        out.push(...matches.map((m) => normalizeTechName(m)));
        continue;
      }
    }

    const words = part.split(/\s+/);
    if (words.length >= 2 && CATEGORY_ONLY.test(words[words.length - 1])) {
      out.push(words.slice(0, -1).join(" "));
      continue;
    }

    if (words.length >= 2 && /databases|systems/i.test(part)) {
      const last = words[words.length - 1];
      if (/^[A-Z][a-zA-Z0-9.+#]+$/.test(last) && last.length <= 20) {
        out.push(normalizeTechName(last));
        if (words.length > 2) out.push(words.slice(0, -2).join(" "));
        continue;
      }
    }

    if (part.length >= 2 && part.length <= 35) {
      out.push(normalizeTechName(part));
    }
  }

  return out;
}

function normalizeTechName(name: string): string {
  const lower = name.toLowerCase();
  const map: Record<string, string> = {
    fastapi: "FastAPI",
    "next.js": "Next.js",
    nextjs: "Next.js",
    react: "React",
    python: "Python",
    mysql: "MySQL",
    postgresql: "PostgreSQL",
    mongodb: "MongoDB",
    redis: "Redis",
    typescript: "TypeScript",
    javascript: "JavaScript",
    "node.js": "Node.js",
    nodejs: "Node.js",
    chromadb: "ChromaDB",
    docker: "Docker",
    kubernetes: "Kubernetes",
    aws: "AWS",
    gcp: "GCP",
    azure: "Azure",
    llm: "LLM",
    rag: "RAG",
    openai: "OpenAI",
    langchain: "LangChain",
    whatsapp: "WhatsApp",
    "voice ai": "Voice AI",
    tailwind: "Tailwind CSS",
    graphql: "GraphQL",
    rest: "REST",
    api: "API",
    saas: "SaaS",
    firebase: "Firebase",
    vercel: "Vercel",
    git: "Git",
  };
  return map[lower] || name.trim();
}

export function cleanSkills(skills: string[]): string[] {
  const out: string[] = [];
  for (const skill of skills) {
    out.push(...cleanSkillName(skill));
  }
  return [...new Set(out.map((s) => s.trim()).filter((s) => s.length >= 2 && !CATEGORY_ONLY.test(s)))].slice(0, 30);
}

export function cleanProjects(projects: ParsedCvProject[]): ParsedCvProject[] {
  const out: ParsedCvProject[] = [];

  for (const project of projects) {
    let { projectName, description, technologiesUsed, roleResponsibility } = project;
    const name = projectName.trim();
    const desc = description.trim();

    if (isBulletLine(name) || ACTION_VERB.test(name)) {
      if (out.length) {
        out[out.length - 1].description += (out[out.length - 1].description ? "\n" : "") + name;
        if (desc) out[out.length - 1].description += "\n" + desc;
      }
      continue;
    }

    if (!looksLikeProjectTitle(name) && name.length < 100 && out.length) {
      out[out.length - 1].description += (out[out.length - 1].description ? "\n" : "") + name;
      if (desc) out[out.length - 1].description += "\n" + desc;
      continue;
    }

    if (!name && !desc) continue;

    out.push({
      projectName: name || desc.slice(0, 80),
      description: desc,
      technologiesUsed,
      roleResponsibility,
    });
  }

  return out
    .map((p) => ({
      ...p,
      description: p.description
        .split("\n")
        .map((l) => l.replace(BULLET_PREFIX, "").replace(/^[-*]\s+/, "").trim())
        .filter(Boolean)
        .map((l) => (l.startsWith("•") ? l : `• ${l}`))
        .join("\n"),
    }))
    .filter((p) => p.projectName.length >= 3)
    .slice(0, 10);
}

export function finalizeParsedCv(parsed: ParsedCv, rawText?: string): ParsedCv {
  const professionalSummary = parsed.professionalSummary?.trim();
  const bioRaw = parsed.bio?.trim();
  const bio = bioRaw && bioRaw !== professionalSummary ? bioRaw : undefined;

  let currentPosition = parsed.currentPosition?.trim();
  if (!currentPosition && rawText) {
    const headerLine = preprocessCvText(rawText)
      .split("\n")
      .slice(0, 8)
      .find(
        (line) =>
          /developer|engineer|designer|manager|specialist|architect|student/i.test(line) &&
          line.length < 90 &&
          !line.includes("@")
      );
    currentPosition = headerLine?.trim();
  }

  return {
    ...parsed,
    currentPosition,
    professionalSummary,
    bio,
    skills: cleanSkills(parsed.skills),
    projects: cleanProjects(parsed.projects),
  };
}

export function parseProjectsFromLines(lines: string[]): ParsedCvProject[] {
  const items: ParsedCvProject[] = [];
  let current: ParsedCvProject | null = null;

  for (const line of lines) {
    const cleaned = line.replace(BULLET_PREFIX, "").replace(/^[-*]\s+/, "").trim();
    if (!cleaned) continue;

    if (looksLikeProjectTitle(line)) {
      if (current?.projectName) items.push(current);
      current = {
        projectName: cleaned,
        description: "",
        technologiesUsed: "",
        roleResponsibility: "",
      };
      continue;
    }

    if (current) {
      current.description += (current.description ? "\n" : "") + cleaned;
    }
  }

  if (current?.projectName) items.push(current);
  return cleanProjects(items);
}

export function parseSkillsFromLines(lines: string[]): string[] {
  const raw: string[] = [];
  for (const line of lines) {
    const fromLine = cleanSkillName(line);
    if (fromLine.length) raw.push(...fromLine);
    else if (line.trim()) raw.push(line.trim());
  }
  return cleanSkills(raw);
}
