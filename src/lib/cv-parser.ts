import type { EducationItem, ExperienceItem } from "./portfolio-theme";
import { getData } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import {
  finalizeParsedCv,
  parseProjectsFromLines,
  parseSkillsFromLines,
  preprocessCvText,
} from "./cv-normalize";

export interface ParsedCvProject {
  projectName: string;
  description: string;
  technologiesUsed?: string;
  roleResponsibility?: string;
}

export interface ParsedCv {
  email?: string;
  phone?: string;
  linkedin?: string;
  currentPosition?: string;
  professionalSummary?: string;
  bio?: string;
  skills: string[];
  projects: ParsedCvProject[];
  experience: ExperienceItem[];
  education: EducationItem[];
}

const YEAR_RANGE =
  /\d{4}\s*[-–—]\s*(?:\d{4}|present|current|now)|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?(?:\d{4}|present|current|now)/i;

let pdfWorkerReady = false;

function ensurePdfWorker() {
  if (pdfWorkerReady) return;
  PDFParse.setWorker(getData());
  pdfWorkerReady = true;
}

export async function extractTextFromCv(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  if (ext === "pdf") {
    ensurePdfWorker();
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return preprocessCvText(result.text || "");
  }

  if (ext === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return preprocessCvText(result.value || "");
  }

  if (ext === "doc") {
    throw new Error("Legacy .doc files are not supported. Please save as PDF or DOCX.");
  }

  throw new Error("Unsupported file type.");
}

function normalizeLines(text: string): string[] {
  return text
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function extractEmail(text: string): string | undefined {
  const match = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/i);
  return match?.[0];
}

function extractPhone(text: string): string | undefined {
  const match = text.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/);
  return match?.[0]?.trim();
}

function extractLinkedIn(text: string): string | undefined {
  const match = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i);
  return match?.[0]?.startsWith("http") ? match[0] : match ? `https://${match[0]}` : undefined;
}

type SectionKey = "header" | "skills" | "experience" | "projects" | "education" | "summary";

function matchSectionHeader(line: string): SectionKey | null {
  const raw = line.replace(/^[\s#*_\-\u2013\u2014]+|[\s:*_\-\u2013\u2014]+$/g, "").trim();
  if (!raw || raw.length > 70) return null;

  const lower = raw.toLowerCase();
  const compact = lower.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const looksLikeHeader =
    raw.length <= 45 ||
    /^[A-Z0-9\s&/\-–—]+$/.test(raw) ||
    lower.endsWith(":") ||
    /^(section|chapter)\s/i.test(raw);

  if (!looksLikeHeader) return null;

  if (/^(skills?|technical skills?|core competencies|technologies|tech stack|tools|competencies|key skills|programming languages|technical proficiencies)/.test(compact)) {
    return "skills";
  }
  if (
    /^(experience|work experience|employment|professional experience|work history|career history|employment history|relevant experience|positions held|professional background|career experience)/.test(
      compact
    )
  ) {
    return "experience";
  }
  if (
    /^(projects?|selected projects|personal projects|key projects|portfolio projects?|notable projects|project experience|side projects|academic projects)/.test(
      compact
    )
  ) {
    return "projects";
  }
  if (/^(education|academic background|qualifications|degrees|academic|education background|academic qualifications)/.test(compact)) {
    return "education";
  }
  if (
    /^(summary|professional summary|profile|about me|about|objective|career objective|personal statement|executive summary)/.test(
      compact
    )
  ) {
    return "summary";
  }

  return null;
}

function splitSections(lines: string[]): Record<SectionKey, string[]> {
  const sections: Record<SectionKey, string[]> = {
    header: [],
    skills: [],
    experience: [],
    projects: [],
    education: [],
    summary: [],
  };
  let current: SectionKey = "header";

  for (const line of lines) {
    const section = matchSectionHeader(line);
    if (section) {
      current = section;
      continue;
    }
    sections[current].push(line);
  }

  return sections;
}

function parseSkills(lines: string[]): string[] {
  return parseSkillsFromLines(lines);
}

function extractPeriod(line: string): string {
  const monthRange = line.match(
    /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?(?:\d{4}|present|current|now))/i
  );
  if (monthRange) return monthRange[1];

  const yearRange = line.match(/(\d{4}\s*[-–—]\s*(?:\d{4}|present|current|now))/i);
  return yearRange?.[1] || "";
}

function parseRoleCompany(line: string, period: string): { role: string; company: string } {
  const withoutPeriod = line.replace(period, "").replace(/\s*[|•·]\s*/g, " · ").trim();

  const atMatch = withoutPeriod.match(/^(.+?)\s+at\s+(.+)$/i);
  if (atMatch) {
    return { role: atMatch[1].trim(), company: atMatch[2].trim() };
  }

  const dashParts = withoutPeriod.split(/\s*[–—\-]\s+/).map((p) => p.trim()).filter(Boolean);
  if (dashParts.length >= 2) {
    return {
      role: dashParts[0],
      company: dashParts.slice(1).join(" — ").replace(/\s*[–—\-]\s*$/, "").trim(),
    };
  }

  const pipeParts = withoutPeriod.split(/\s*\|\s*/).map((p) => p.trim()).filter(Boolean);
  if (pipeParts.length >= 2) {
    return { role: pipeParts[0], company: pipeParts.slice(1).join(" | ") };
  }

  const commaParts = withoutPeriod.split(",").map((p) => p.trim()).filter(Boolean);
  if (commaParts.length >= 2 && commaParts[0].length < 60) {
    return { role: commaParts[0], company: commaParts.slice(1).join(", ") };
  }

  return { role: withoutPeriod, company: "" };
}

function isPeriodOnlyLine(line: string): boolean {
  const cleaned = line.replace(/^[-•*]\s*/, "").trim();
  const period = extractPeriod(cleaned);
  if (!period) return false;
  const remainder = cleaned.replace(period, "").replace(/[(),]/g, "").trim();
  return remainder.length === 0;
}

function looksLikeExperienceHeader(line: string): boolean {
  if (isPeriodOnlyLine(line)) return false;
  if (YEAR_RANGE.test(line)) return true;
  if (/\s+at\s+.+/i.test(line) && line.length < 120) return true;
  if (line.includes("|") && line.length < 120) return true;
  return false;
}

function looksLikeCompanyLine(line: string): boolean {
  if (isPeriodOnlyLine(line)) return false;
  if (/·|\||\bat\b/i.test(line)) return true;
  return YEAR_RANGE.test(line) && line.replace(extractPeriod(line), "").trim().length > 2;
}

function parseExperience(lines: string[]): ExperienceItem[] {
  const items: ExperienceItem[] = [];
  let current: ExperienceItem | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    if (isPeriodOnlyLine(line)) {
      if (current && !current.period) {
        current.period = extractPeriod(line);
        continue;
      }
    }

    const period = extractPeriod(line);
    const hasDateInLine = Boolean(period);
    const isHeader = looksLikeExperienceHeader(line);
    const isRoleOnly =
      !current &&
      !/\s+at\s+/i.test(line) &&
      line.length < 70 &&
      !line.startsWith("•") &&
      !line.startsWith("-") &&
      nextLine &&
      looksLikeCompanyLine(nextLine);

    if (isHeader || isRoleOnly) {
      if (current) items.push(current);

      if (isRoleOnly && nextLine) {
        const nextPeriod = extractPeriod(nextLine);
        const parsed = parseRoleCompany(nextLine, nextPeriod);
        current = {
          id: `exp-${items.length + 1}`,
          role: line.trim(),
          company: parsed.role === line.trim() ? parsed.company || parsed.role : parsed.company,
          period: nextPeriod,
          description: "",
        };
        i += 1;
        continue;
      }

      const parsed = parseRoleCompany(line, period);
      current = {
        id: `exp-${items.length + 1}`,
        role: parsed.role,
        company: parsed.company,
        period,
        description: "",
      };
    } else if (current) {
      const cleaned = line.replace(/^[-•*]\s*/, "").trim();
      if (!cleaned) continue;
      const isBullet = /^[-•*]\s+/.test(line);
      const isAchievement =
        /^(built|developed|created|designed|implemented|led|managed|maintained|improved|reduced|increased)\b/i.test(
          cleaned
        );

      if (
        !current.company &&
        !hasDateInLine &&
        !isBullet &&
        !isAchievement &&
        cleaned.length < 60 &&
        !cleaned.includes(":")
      ) {
        current.company = cleaned;
      } else {
        current.description += (current.description ? "\n" : "") + cleaned;
      }
    } else if (line.length < 80 && !line.startsWith("•") && !line.startsWith("-")) {
      current = {
        id: `exp-${items.length + 1}`,
        role: line.trim(),
        company: "",
        period: "",
        description: "",
      };
    }
  }

  if (current) items.push(current);

  return items
    .filter((item) => {
      if (!item.role.trim() && !item.company.trim() && !item.description.trim()) return false;
      if (/^\d{4}\s*[-–—]/.test(item.role.trim())) return false;
      return true;
    })
    .slice(0, 10);
}

function parseEducation(lines: string[]): EducationItem[] {
  const items: EducationItem[] = [];

  for (const line of lines) {
    if (line.length < 4) continue;
    const period = extractPeriod(line);
    const withoutPeriod = line.replace(period, "").trim();
    const parts = withoutPeriod.split(/\s*[|,–—\-]\s+/).map((p) => p.trim()).filter(Boolean);

    let degree = withoutPeriod;
    let school = "";

    if (parts.length >= 2) {
      const schoolLike = parts.find((p) => /university|college|institute|school|academy/i.test(p));
      if (schoolLike) {
        school = schoolLike;
        degree = parts.filter((p) => p !== schoolLike).join(" — ");
      } else {
        degree = parts[0];
        school = parts.slice(1).join(", ");
      }
    }

    items.push({
      id: `edu-${items.length + 1}`,
      degree,
      school,
      period,
      description: "",
    });
  }

  return items.slice(0, 6);
}

function parseProjects(lines: string[]): ParsedCvProject[] {
  return parseProjectsFromLines(lines);
}

function firstSection(...candidates: string[][]): string[] {
  for (const lines of candidates) {
    if (lines.length) return lines;
  }
  return [];
}

export function parseCvText(text: string): ParsedCv {
  const cleanedText = preprocessCvText(text);
  const lines = normalizeLines(cleanedText);
  const sections = splitSections(lines);
  const headerLines = sections.header.length ? sections.header : lines.slice(0, 8);

  const skills = parseSkills(sections.skills);
  const experience = parseExperience(sections.experience);
  const education = parseEducation(sections.education);
  const projects = parseProjects(sections.projects);

  const summaryLines = firstSection(sections.summary, headerLines.slice(1, 5));
  const professionalSummary = summaryLines.join(" ").slice(0, 500);

  const titleLine = headerLines.find(
    (line) =>
      /developer|engineer|designer|manager|specialist|architect|student/i.test(line) &&
      line.length < 90 &&
      !line.includes("@")
  );

  return finalizeParsedCv(
    {
      email: extractEmail(cleanedText),
      phone: extractPhone(cleanedText),
      linkedin: extractLinkedIn(cleanedText),
      currentPosition: experience[0]?.role || titleLine?.trim(),
      professionalSummary,
      bio: undefined,
      skills,
      projects,
      experience,
      education,
    },
    cleanedText
  );
}

/** Parse CV text with Gemini when configured, otherwise use rule-based parser. */
export async function parseCvFromText(text: string): Promise<{ parsed: ParsedCv; source: "gemini" | "rules" }> {
  const cleanedText = preprocessCvText(text);
  const { isGeminiConfigured, parseCvWithGemini } = await import("./cv-ai-parser");

  if (isGeminiConfigured()) {
    try {
      const parsed = finalizeParsedCv(await parseCvWithGemini(cleanedText), cleanedText);
      return { parsed, source: "gemini" };
    } catch (error) {
      console.warn("Gemini CV parse failed, falling back to rules:", error);
    }
  }

  return { parsed: parseCvText(cleanedText), source: "rules" };
}
