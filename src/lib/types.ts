export interface User {
  id: string;
  email: string;
  slug: string;
  personalInfoId: string;
}

export interface PersonalInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  professionalSummary?: string;
  skillsOverview?: string;
  preferredLocation?: string;
  currentPosition?: string;
  industry?: string;
  personalWebsite?: string;
  linkedin?: string;
  socialLinks?: string;
  photoUrl?: string;
  profilePhoto?: AirtableAttachment[];
  heroBackground?: AirtableAttachment[];
  resume?: AirtableAttachment[];
  resumeUrl?: string;
  themeSettingsRaw?: string;
  analyticsRaw?: string;
}

export interface Project {
  id: string;
  projectName: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  client?: string;
  technologiesUsed?: string;
  outcomes?: string;
  githubRepository?: string;
  projectType?: string;
  projectStatus?: string;
  roleResponsibility?: string;
  projectHighlights?: string;
  imageUrl?: string;
  projectImages?: AirtableAttachment[];
}

export interface Skill {
  id: string;
  skillName: string;
  category?: string;
  proficiencyLevel?: string;
  certificationName?: string;
  certificationDate?: string;
  expirationDate?: string;
  certificationBody?: string;
  skillDescription?: string;
  relevantKeywords?: string;
}

export interface AirtableAttachment {
  id: string;
  url: string;
  filename?: string;
  type?: string;
}

import type { PortfolioTheme } from "./portfolio-theme";

export interface PortfolioData {
  personalInfo: PersonalInfo;
  projects: Project[];
  skills: Skill[];
  theme: PortfolioTheme;
}

export interface SessionPayload {
  userId: string;
  email: string;
  slug: string;
  personalInfoId: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdTime?: string;
}
