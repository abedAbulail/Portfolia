import { GoogleGenerativeAI } from "@google/generative-ai";
import type { EducationItem, ExperienceItem } from "./portfolio-theme";
import type { ParsedCv, ParsedCvProject } from "./cv-parser";
import { finalizeParsedCv } from "./cv-normalize";

const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.0-flash-lite"];

function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.GIMINI_API_KEY || process.env.GOOGLE_API_KEY;
}

function str(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function normalizeExperience(items: unknown): ExperienceItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const role = str(row.role) || "";
      const company = str(row.company) || "";
      const period = str(row.period) || "";
      const description = str(row.description) || "";
      if (!role && !company && !description) return null;
      return {
        id: `exp-${index + 1}`,
        role,
        company,
        period,
        description,
      };
    })
    .filter((item): item is ExperienceItem => item !== null)
    .slice(0, 12);
}

function normalizeEducation(items: unknown): EducationItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const degree = str(row.degree) || "";
      const school = str(row.school) || "";
      const period = str(row.period) || "";
      const description = str(row.description) || "";
      if (!degree && !school) return null;
      return {
        id: `edu-${index + 1}`,
        degree,
        school,
        period,
        description,
      };
    })
    .filter((item): item is EducationItem => item !== null)
    .slice(0, 8);
}

function normalizeProjects(items: unknown): ParsedCvProject[] {
  if (!Array.isArray(items)) return [];
  const out: ParsedCvProject[] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const projectName = str(row.projectName) || str(row.name) || str(row.title) || "";
    const description = str(row.description) || "";
    if (!projectName && !description) continue;
    out.push({
      projectName: projectName || description.slice(0, 80),
      description,
      technologiesUsed: str(row.technologiesUsed) || str(row.technologies),
      roleResponsibility: str(row.roleResponsibility) || str(row.role),
    });
  }
  return out.slice(0, 10);
}

function normalizeSkills(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return [...new Set(items.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean))].slice(
    0,
    30
  );
}

function normalizeAiParsed(raw: unknown): ParsedCv {
  const data = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const experience = normalizeExperience(data.experience);
  const projects = normalizeProjects(data.projects);
  const skills = normalizeSkills(data.skills);
  const education = normalizeEducation(data.education);
  const professionalSummary = str(data.professionalSummary) || str(data.summary);

  return finalizeParsedCv({
    email: str(data.email),
    phone: str(data.phone),
    linkedin: str(data.linkedin),
    currentPosition: str(data.currentPosition) || experience[0]?.role,
    professionalSummary,
    bio: str(data.bio),
    skills,
    projects,
    experience,
    education,
  });
}

function buildPrompt(cvText: string): string {
  return `You are an expert CV/resume parser. Extract structured portfolio data from the CV text below.

CRITICAL RULES:
1. "experience" = paid jobs / employment only (role, company, period, description).
2. "projects" = portfolio or product projects with a clear NAME and bullet-point DESCRIPTION grouped together.
   - Each project must be ONE object with projectName + description (all bullets joined with newlines).
   - NEVER create a separate project for each bullet point.
   - NEVER put job experience into projects.
3. "skills" = individual technology/skill names only (e.g. "FastAPI", "Python", "React") — NOT category headers like "Databases" or "Backend & AI Systems".
4. "education" = degrees and schools.
5. "professionalSummary" = the About/Summary paragraph only (once, no duplication).
6. "bio" = leave null (do not duplicate the summary).
7. Return ONLY valid JSON.

Example projects format:
"projects": [
  {
    "projectName": "AI Voice Call Center System",
    "description": "• Implemented conversational AI...\\n• Extracts structured data...\\n• Generates automated summaries...",
    "technologiesUsed": "FastAPI, LLM",
    "roleResponsibility": null
  }
]

JSON shape:
{
  "email": string | null,
  "phone": string | null,
  "linkedin": string | null,
  "currentPosition": string | null,
  "professionalSummary": string | null,
  "bio": null,
  "skills": string[],
  "projects": [
    { "projectName": string, "description": string, "technologiesUsed": string | null, "roleResponsibility": string | null }
  ],
  "experience": [
    { "role": string, "company": string, "period": string, "description": string }
  ],
  "education": [
    { "degree": string, "school": string, "period": string, "description": string | null }
  ]
}

CV TEXT:
${cvText.slice(0, 28000)}`;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) return JSON.parse(fenced[1].trim());

    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Gemini returned invalid JSON.");
  }
}

function hasUsableData(parsed: ParsedCv): boolean {
  return Boolean(
    parsed.experience.length ||
      parsed.projects.length ||
      parsed.skills.length ||
      parsed.education.length ||
      parsed.professionalSummary
  );
}

async function callGeminiModel(modelName: string, apiKey: string, prompt: string): Promise<string> {
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text.trim()) {
    throw new Error("Gemini returned an empty response.");
  }
  return text;
}

export function isGeminiConfigured(): boolean {
  return Boolean(getGeminiApiKey());
}

export async function parseCvWithGemini(cvText: string): Promise<ParsedCv> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Set GEMINI_API_KEY in .env.local");
  }

  const prompt = buildPrompt(cvText);
  let lastError: Error | null = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      const rawText = await callGeminiModel(modelName, apiKey, prompt);
      const parsed = normalizeAiParsed(extractJson(rawText));
      if (hasUsableData(parsed)) {
        return parsed;
      }
      lastError = new Error(`Gemini model ${modelName} returned no usable CV data.`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError || new Error("Gemini CV parsing failed.");
}
