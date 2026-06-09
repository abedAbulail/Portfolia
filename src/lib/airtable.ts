import { AIRTABLE_BASE_ID, AIRTABLE_TOKEN } from "./config";
import { getSampleProjects } from "./sample-data";
import { isUnreachableMediaUrl, resolveMediaUrl } from "./media-url";
import {
  parseAnalytics,
  incrementVisitors,
  incrementCvDownloads,
} from "./analytics";
import { parseThemeSettings, sortByOrder, mergeTheme } from "./portfolio-theme";
import type { PortfolioTheme } from "./portfolio-theme";
import type { PortfolioAnalytics } from "./analytics";
import type {
  PersonalInfo,
  PortfolioData,
  Project,
  Skill,
  User,
  AirtableAttachment,
  ContactMessage,
} from "./types";

interface AirtableRecord<T = Record<string, unknown>> {
  id: string;
  fields: T;
  createdTime?: string;
}

interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}

async function airtableFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

function escapeFormula(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function mapPersonalInfo(record: AirtableRecord): PersonalInfo {
  const f = record.fields;
  return {
    id: record.id,
    name: (f["Name"] as string) || "",
    email: (f["Email"] as string) || "",
    phone: f["Phone"] as string | undefined,
    bio: f["Bio"] as string | undefined,
    professionalSummary: f["Professional Summary"] as string | undefined,
    skillsOverview: f["Skills Overview"] as string | undefined,
    preferredLocation: f["Preferred Location"] as string | undefined,
    currentPosition: f["Current Position"] as string | undefined,
    industry: f["Industry"] as string | undefined,
    personalWebsite: f["Personal Website"] as string | undefined,
    linkedin: f["LinkedIn"] as string | undefined,
    socialLinks: f["Social Links"] as string | undefined,
    photoUrl: resolveMediaUrl(
      f["Photo URL"] as string | undefined,
      f["Profile Photo"] as AirtableAttachment[] | undefined
    ),
    profilePhoto: f["Profile Photo"] as AirtableAttachment[] | undefined,
    heroBackground: f["Hero Background"] as AirtableAttachment[] | undefined,
    resume: f["Resume"] as AirtableAttachment[] | undefined,
    resumeUrl: resolveMediaUrl(
      f["Resume URL"] as string | undefined,
      f["Resume"] as AirtableAttachment[] | undefined
    ),
    themeSettingsRaw: f["Theme Settings"] as string | undefined,
    analyticsRaw: f["Analytics"] as string | undefined,
  };
}

function mapProject(record: AirtableRecord): Project {
  const f = record.fields;
  return {
    id: record.id,
    projectName: (f["Project Name"] as string) || "",
    description: f["Description"] as string | undefined,
    startDate: f["Start Date"] as string | undefined,
    endDate: f["End Date"] as string | undefined,
    client: f["Client"] as string | undefined,
    technologiesUsed: f["Technologies Used"] as string | undefined,
    outcomes: f["Outcomes"] as string | undefined,
    githubRepository: f["GitHub Repository"] as string | undefined,
    projectType: f["Project Type"] as string | undefined,
    projectStatus: f["Project Status"] as string | undefined,
    roleResponsibility: f["Role/Responsibility"] as string | undefined,
    projectHighlights: f["Project Highlights"] as string | undefined,
    imageUrl: resolveMediaUrl(
      f["Image URL"] as string | undefined,
      f["Project Images"] as AirtableAttachment[] | undefined
    ),
    projectImages: f["Project Images"] as AirtableAttachment[] | undefined,
  };
}

function mapSkill(record: AirtableRecord): Skill {
  const f = record.fields;
  return {
    id: record.id,
    skillName: (f["Skill Name"] as string) || "",
    category: f["Category"] as string | undefined,
    proficiencyLevel: f["Proficiency Level"] as string | undefined,
    certificationName: f["Certification Name"] as string | undefined,
    certificationDate: f["Certification Date"] as string | undefined,
    expirationDate: f["Expiration Date"] as string | undefined,
    certificationBody: f["Certification Body"] as string | undefined,
    skillDescription: f["Skill Description"] as string | undefined,
    relevantKeywords: f["Relevant Keywords"] as string | undefined,
  };
}

function mapUser(record: AirtableRecord): User {
  const f = record.fields;
  const personalInfoLinks = f["Personal Info"] as string[] | undefined;
  return {
    id: record.id,
    email: (f["Email"] as string) || "",
    slug: (f["Slug"] as string) || "",
    personalInfoId: personalInfoLinks?.[0] || "",
  };
}

export async function getUserById(
  userId: string
): Promise<{ user: User; createdTime: string } | null> {
  try {
    const data = await airtableFetch<AirtableRecord>(`Users/${userId}`);
    return {
      user: mapUser(data),
      createdTime: data.createdTime || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function updateUserEmail(userId: string, email: string): Promise<void> {
  await airtableFetch(`Users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ fields: { Email: email.toLowerCase() } }),
  });
}

export async function updateUserPasswordHash(
  userId: string,
  passwordHash: string
): Promise<void> {
  await airtableFetch(`Users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ fields: { PasswordHash: passwordHash } }),
  });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const formula = `{Email}="${escapeFormula(email.toLowerCase())}"`;
  const data = await airtableFetch<AirtableListResponse>(
    `Users?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`
  );
  if (!data.records.length) return null;
  return mapUser(data.records[0]);
}

export async function findUserBySlug(slug: string): Promise<User | null> {
  const formula = `{Slug}="${escapeFormula(slug)}"`;
  const data = await airtableFetch<AirtableListResponse>(
    `Users?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`
  );
  if (!data.records.length) return null;
  return mapUser(data.records[0]);
}

export async function getUserPasswordHash(userId: string): Promise<string | null> {
  const data = await airtableFetch<AirtableRecord>(`Users/${userId}`);
  return (data.fields["PasswordHash"] as string) || null;
}

export async function createUserAccount(
  email: string,
  passwordHash: string,
  name: string,
  slug: string
): Promise<User> {
  const personalInfo = await airtableFetch<{ records: AirtableRecord[] }>("Personal Info", {
    method: "POST",
    body: JSON.stringify({
      records: [{ fields: { Name: name, Email: email.toLowerCase() } }],
    }),
  });

  const personalRecord = personalInfo.records[0];

  await createSampleProjects(personalRecord.id, name);

  const userData = await airtableFetch<{ records: AirtableRecord[] }>("Users", {
    method: "POST",
    body: JSON.stringify({
      records: [
        {
          fields: {
            Email: email.toLowerCase(),
            PasswordHash: passwordHash,
            Slug: slug,
            "Personal Info": [personalRecord.id],
          },
        },
      ],
    }),
  });

  return mapUser(userData.records[0]);
}

export async function getPersonalInfo(id: string): Promise<PersonalInfo | null> {
  try {
    const data = await airtableFetch<AirtableRecord>(`Personal Info/${id}`);
    return mapPersonalInfo(data);
  } catch {
    return null;
  }
}

export async function updatePersonalInfo(
  id: string,
  fields: Partial<Omit<PersonalInfo, "id">>
): Promise<PersonalInfo> {
  const airtableFields: Record<string, unknown> = {};
  if (fields.name !== undefined) airtableFields["Name"] = fields.name;
  if (fields.email !== undefined) airtableFields["Email"] = fields.email;
  if (fields.phone !== undefined) airtableFields["Phone"] = fields.phone;
  if (fields.bio !== undefined) airtableFields["Bio"] = fields.bio;
  if (fields.professionalSummary !== undefined)
    airtableFields["Professional Summary"] = fields.professionalSummary;
  if (fields.skillsOverview !== undefined)
    airtableFields["Skills Overview"] = fields.skillsOverview;
  if (fields.preferredLocation !== undefined)
    airtableFields["Preferred Location"] = fields.preferredLocation;
  if (fields.currentPosition !== undefined)
    airtableFields["Current Position"] = fields.currentPosition;
  if (fields.industry !== undefined) airtableFields["Industry"] = fields.industry;
  if (fields.personalWebsite !== undefined)
    airtableFields["Personal Website"] = fields.personalWebsite;
  if (fields.linkedin !== undefined) airtableFields["LinkedIn"] = fields.linkedin;
  if (fields.socialLinks !== undefined) airtableFields["Social Links"] = fields.socialLinks;
  if (fields.photoUrl !== undefined) {
    airtableFields["Photo URL"] = fields.photoUrl;
    if (fields.photoUrl && !isUnreachableMediaUrl(fields.photoUrl)) {
      airtableFields["Profile Photo"] = [{ url: fields.photoUrl }];
    }
  }
  if (fields.resumeUrl !== undefined) {
    airtableFields["Resume URL"] = fields.resumeUrl;
    if (fields.resumeUrl && !isUnreachableMediaUrl(fields.resumeUrl)) {
      airtableFields["Resume"] = [{ url: fields.resumeUrl }];
    }
  }

  const data = await airtableFetch<AirtableRecord>(`Personal Info/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ fields: airtableFields }),
  });
  return mapPersonalInfo(data);
}

export async function getProjectsForPersonalInfo(
  personalInfoId: string
): Promise<Project[]> {
  const personal = await airtableFetch<AirtableRecord>(`Personal Info/${personalInfoId}`);
  const projectIds = personal.fields["Projects"] as string[] | undefined;
  if (!projectIds?.length) return [];

  const formula = `OR(${projectIds.map((id) => `RECORD_ID()="${id}"`).join(",")})`;
  const data = await airtableFetch<AirtableListResponse>(
    `Projects?filterByFormula=${encodeURIComponent(formula)}`
  );
  return data.records.map(mapProject);
}

export async function createProject(
  personalInfoId: string,
  fields: Omit<Project, "id">
): Promise<Project> {
  const airtableFields: Record<string, unknown> = {
    "Project Name": fields.projectName,
    Description: fields.description || "",
    "Start Date": fields.startDate || undefined,
    "End Date": fields.endDate || undefined,
    Client: fields.client || "",
    "Technologies Used": fields.technologiesUsed || "",
    Outcomes: fields.outcomes || "",
    "GitHub Repository": fields.githubRepository || "",
    "Project Type": fields.projectType || undefined,
    "Project Status": fields.projectStatus || undefined,
    "Role/Responsibility": fields.roleResponsibility || "",
    "Project Highlights": fields.projectHighlights || "",
    "Personal Info Link": [personalInfoId],
  };

  if (fields.imageUrl && !isUnreachableMediaUrl(fields.imageUrl)) {
    airtableFields["Image URL"] = fields.imageUrl;
    airtableFields["Project Images"] = [{ url: fields.imageUrl }];
  } else if (fields.imageUrl) {
    airtableFields["Image URL"] = fields.imageUrl;
  }

  const data = await airtableFetch<{ records: AirtableRecord[] }>("Projects", {
    method: "POST",
    body: JSON.stringify({ records: [{ fields: airtableFields }] }),
  });
  return mapProject(data.records[0]);
}

export async function updateProject(
  id: string,
  fields: Partial<Omit<Project, "id">>
): Promise<Project> {
  const airtableFields: Record<string, unknown> = {};
  if (fields.projectName !== undefined) airtableFields["Project Name"] = fields.projectName;
  if (fields.description !== undefined) airtableFields["Description"] = fields.description;
  if (fields.startDate !== undefined) airtableFields["Start Date"] = fields.startDate;
  if (fields.endDate !== undefined) airtableFields["End Date"] = fields.endDate;
  if (fields.client !== undefined) airtableFields["Client"] = fields.client;
  if (fields.technologiesUsed !== undefined)
    airtableFields["Technologies Used"] = fields.technologiesUsed;
  if (fields.outcomes !== undefined) airtableFields["Outcomes"] = fields.outcomes;
  if (fields.githubRepository !== undefined)
    airtableFields["GitHub Repository"] = fields.githubRepository;
  if (fields.projectType !== undefined) airtableFields["Project Type"] = fields.projectType;
  if (fields.projectStatus !== undefined)
    airtableFields["Project Status"] = fields.projectStatus;
  if (fields.roleResponsibility !== undefined)
    airtableFields["Role/Responsibility"] = fields.roleResponsibility;
  if (fields.projectHighlights !== undefined)
    airtableFields["Project Highlights"] = fields.projectHighlights;
  if (fields.imageUrl !== undefined) {
    airtableFields["Image URL"] = fields.imageUrl;
    if (fields.imageUrl && !isUnreachableMediaUrl(fields.imageUrl)) {
      airtableFields["Project Images"] = [{ url: fields.imageUrl }];
    }
  }

  const data = await airtableFetch<AirtableRecord>(`Projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ fields: airtableFields }),
  });
  return mapProject(data);
}

export async function deleteProject(id: string): Promise<void> {
  await airtableFetch(`Projects/${id}`, { method: "DELETE" });
}

export async function getSkillsForPersonalInfo(
  personalInfoId: string
): Promise<Skill[]> {
  const personal = await airtableFetch<AirtableRecord>(`Personal Info/${personalInfoId}`);
  const skillIds = personal.fields["Skills & Certifications"] as string[] | undefined;
  if (!skillIds?.length) return [];

  const formula = `OR(${skillIds.map((id) => `RECORD_ID()="${id}"`).join(",")})`;
  const data = await airtableFetch<AirtableListResponse>(
    `Skills & Certifications?filterByFormula=${encodeURIComponent(formula)}`
  );
  return data.records.map(mapSkill);
}

export async function createSkill(
  personalInfoId: string,
  fields: Omit<Skill, "id">
): Promise<Skill> {
  const data = await airtableFetch<{ records: AirtableRecord[] }>(
    "Skills & Certifications",
    {
      method: "POST",
      body: JSON.stringify({
        records: [
          {
            fields: {
              "Skill Name": fields.skillName,
              Category: fields.category || undefined,
              "Proficiency Level": fields.proficiencyLevel || undefined,
              "Certification Name": fields.certificationName || "",
              "Certification Date": fields.certificationDate || undefined,
              "Expiration Date": fields.expirationDate || undefined,
              "Certification Body": fields.certificationBody || "",
              "Skill Description": fields.skillDescription || "",
              "Relevant Keywords": fields.relevantKeywords || "",
              "Personal Info Link": [personalInfoId],
            },
          },
        ],
      }),
    }
  );
  return mapSkill(data.records[0]);
}

export async function updateSkill(
  id: string,
  fields: Partial<Omit<Skill, "id">>
): Promise<Skill> {
  const airtableFields: Record<string, unknown> = {};
  if (fields.skillName !== undefined) airtableFields["Skill Name"] = fields.skillName;
  if (fields.category !== undefined) airtableFields["Category"] = fields.category;
  if (fields.proficiencyLevel !== undefined)
    airtableFields["Proficiency Level"] = fields.proficiencyLevel;
  if (fields.certificationName !== undefined)
    airtableFields["Certification Name"] = fields.certificationName;
  if (fields.certificationDate !== undefined)
    airtableFields["Certification Date"] = fields.certificationDate;
  if (fields.expirationDate !== undefined)
    airtableFields["Expiration Date"] = fields.expirationDate;
  if (fields.certificationBody !== undefined)
    airtableFields["Certification Body"] = fields.certificationBody;
  if (fields.skillDescription !== undefined)
    airtableFields["Skill Description"] = fields.skillDescription;
  if (fields.relevantKeywords !== undefined)
    airtableFields["Relevant Keywords"] = fields.relevantKeywords;

  const data = await airtableFetch<AirtableRecord>(`Skills & Certifications/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ fields: airtableFields }),
  });
  return mapSkill(data);
}

export async function deleteSkill(id: string): Promise<void> {
  await airtableFetch(`Skills & Certifications/${id}`, { method: "DELETE" });
}

export async function getAnalytics(personalInfoId: string): Promise<PortfolioAnalytics> {
  const personalInfo = await getPersonalInfo(personalInfoId);
  return parseAnalytics(personalInfo?.analyticsRaw);
}

async function saveAnalytics(
  personalInfoId: string,
  analytics: PortfolioAnalytics
): Promise<void> {
  await airtableFetch(`Personal Info/${personalInfoId}`, {
    method: "PATCH",
    body: JSON.stringify({
      fields: { Analytics: JSON.stringify(analytics) },
    }),
  });
}

export async function recordPortfolioVisit(slug: string): Promise<void> {
  const personalInfoId = await getPersonalInfoIdBySlug(slug);
  if (!personalInfoId) return;
  const analytics = await getAnalytics(personalInfoId);
  await saveAnalytics(personalInfoId, incrementVisitors(analytics));
}

export async function recordCvDownload(slug: string): Promise<string | null> {
  const user = await findUserBySlug(slug);
  if (!user?.personalInfoId) return null;
  const personalInfo = await getPersonalInfo(user.personalInfoId);
  const resumeUrl = personalInfo?.resumeUrl || personalInfo?.resume?.[0]?.url;
  if (!resumeUrl) return null;
  const analytics = await getAnalytics(user.personalInfoId);
  await saveAnalytics(user.personalInfoId, incrementCvDownloads(analytics));
  return resumeUrl;
}

function applyHeroFromPersonalInfo(
  theme: PortfolioTheme,
  personalInfo: PersonalInfo
): PortfolioTheme {
  const heroFromAirtable = personalInfo.heroBackground?.[0]?.url;
  if (heroFromAirtable) {
    return mergeTheme(theme, {
      hero: { ...theme.hero, backgroundImage: heroFromAirtable },
    });
  }
  if (theme.hero?.backgroundImage && isUnreachableMediaUrl(theme.hero.backgroundImage)) {
    return mergeTheme(theme, {
      hero: { ...theme.hero, backgroundImage: "" },
    });
  }
  return theme;
}

export async function getPortfolioBySlug(slug: string): Promise<PortfolioData | null> {
  const user = await findUserBySlug(slug);
  if (!user?.personalInfoId) return null;

  const personalInfo = await getPersonalInfo(user.personalInfoId);
  if (!personalInfo) return null;

  const [projects, skills] = await Promise.all([
    getProjectsForPersonalInfo(user.personalInfoId),
    getSkillsForPersonalInfo(user.personalInfoId),
  ]);

  const baseTheme = parseThemeSettings(personalInfo.themeSettingsRaw);
  const theme = applyHeroFromPersonalInfo(baseTheme, personalInfo);

  const orderedProjects = sortByOrder(projects, theme.projectOrder);
  const orderedSkills = sortByOrder(skills, theme.skillOrder);

  return { personalInfo, projects: orderedProjects, skills: orderedSkills, theme };
}

export async function getThemeSettings(personalInfoId: string): Promise<PortfolioTheme> {
  const personalInfo = await getPersonalInfo(personalInfoId);
  if (!personalInfo) return parseThemeSettings(null);
  const baseTheme = parseThemeSettings(personalInfo.themeSettingsRaw);
  return applyHeroFromPersonalInfo(baseTheme, personalInfo);
}

export async function saveThemeSettings(
  personalInfoId: string,
  theme: PortfolioTheme
): Promise<PortfolioTheme> {
  await airtableFetch<AirtableRecord>(`Personal Info/${personalInfoId}`, {
    method: "PATCH",
    body: JSON.stringify({
      fields: { "Theme Settings": JSON.stringify(theme) },
    }),
  });
  return theme;
}

function mapMessage(record: AirtableRecord): ContactMessage {
  const f = record.fields;
  return {
    id: record.id,
    name: (f["Name"] as string) || "",
    email: (f["Email"] as string) || "",
    subject: (f["Subject"] as string) || "",
    message: (f["Message"] as string) || "",
    read: !!(f["Read"] as boolean),
    createdTime: record.createdTime,
  };
}

export async function createContactMessage(
  personalInfoId: string,
  data: { name: string; email: string; subject: string; message: string }
): Promise<ContactMessage> {
  const res = await airtableFetch<{ records: AirtableRecord[] }>("Messages", {
    method: "POST",
    body: JSON.stringify({
      records: [
        {
          fields: {
            Name: data.name,
            Email: data.email,
            Subject: data.subject,
            Message: data.message,
            Read: false,
            "Personal Info": [personalInfoId],
          },
        },
      ],
    }),
  });
  return mapMessage(res.records[0]);
}

export async function getMessagesForPersonalInfo(
  personalInfoId: string
): Promise<ContactMessage[]> {
  const personal = await airtableFetch<AirtableRecord>(`Personal Info/${personalInfoId}`);
  const messageIds = personal.fields["Messages"] as string[] | undefined;
  if (!messageIds?.length) return [];

  const formula = `OR(${messageIds.map((id) => `RECORD_ID()="${id}"`).join(",")})`;
  const data = await airtableFetch<AirtableListResponse>(
    `Messages?filterByFormula=${encodeURIComponent(formula)}&sort%5B0%5D%5Bfield%5D=Name&sort%5B0%5D%5Bdirection%5D=desc`
  );
  return data.records
    .map(mapMessage)
    .sort((a, b) => (b.createdTime || "").localeCompare(a.createdTime || ""));
}

export async function markMessageRead(messageId: string): Promise<void> {
  await airtableFetch(`Messages/${messageId}`, {
    method: "PATCH",
    body: JSON.stringify({ fields: { Read: true } }),
  });
}

export async function getPersonalInfoIdBySlug(slug: string): Promise<string | null> {
  const user = await findUserBySlug(slug);
  return user?.personalInfoId || null;
}

export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

async function createSampleProjects(personalInfoId: string, name: string): Promise<void> {
  const samples = getSampleProjects(name);

  await airtableFetch<{ records: AirtableRecord[] }>("Projects", {
    method: "POST",
    body: JSON.stringify({
      records: samples.map((project) => ({
        fields: {
          "Project Name": project.projectName,
          Description: project.description || "",
          Client: project.client || "",
          "Technologies Used": project.technologiesUsed || "",
          Outcomes: project.outcomes || "",
          "GitHub Repository": project.githubRepository || "",
          "Project Type": project.projectType || undefined,
          "Project Status": project.projectStatus || undefined,
          "Role/Responsibility": project.roleResponsibility || "",
          "Project Highlights": project.projectHighlights || "",
          "Image URL": project.imageUrl || "",
          "Project Images": project.imageUrl ? [{ url: project.imageUrl }] : [],
          "Personal Info Link": [personalInfoId],
        },
      })),
    }),
  });
}
