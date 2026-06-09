import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getPersonalInfo,
  getProjectsForPersonalInfo,
  getSkillsForPersonalInfo,
} from "@/lib/airtable";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [personalInfo, projects, skills] = await Promise.all([
    getPersonalInfo(session.personalInfoId),
    getProjectsForPersonalInfo(session.personalInfoId),
    getSkillsForPersonalInfo(session.personalInfoId),
  ]);

  return NextResponse.json({
    user: {
      email: session.email,
      slug: session.slug,
      personalInfoId: session.personalInfoId,
    },
    personalInfo,
    projects,
    skills,
  });
}
