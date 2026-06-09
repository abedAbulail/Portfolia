import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getPersonalInfo,
  getProjectsForPersonalInfo,
  getSkillsForPersonalInfo,
  getMessagesForPersonalInfo,
  getAnalytics,
} from "@/lib/airtable";

function buildDailyMessages(messages: { createdTime?: string }[]) {
  const map = new Map<string, number>();
  for (const msg of messages) {
    if (!msg.createdTime) continue;
    const date = msg.createdTime.slice(0, 10);
    map.set(date, (map.get(date) || 0) + 1);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, count]) => ({ date, count }));
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [personalInfo, projects, skills, messages, analytics] = await Promise.all([
    getPersonalInfo(session.personalInfoId),
    getProjectsForPersonalInfo(session.personalInfoId),
    getSkillsForPersonalInfo(session.personalInfoId),
    getMessagesForPersonalInfo(session.personalInfoId),
    getAnalytics(session.personalInfoId),
  ]);

  const completionSteps = [
    !!(personalInfo?.name && personalInfo?.bio),
    !!personalInfo?.professionalSummary,
    projects.length > 0,
    skills.length > 0,
    !!(personalInfo?.photoUrl || personalInfo?.profilePhoto?.length),
    !!(personalInfo?.resumeUrl || personalInfo?.resume?.length),
  ];
  const completion = Math.round(
    (completionSteps.filter(Boolean).length / completionSteps.length) * 100
  );

  return NextResponse.json({
    stats: {
      projects: projects.length,
      skills: skills.length,
      messages: messages.length,
      unreadMessages: messages.filter((m) => !m.read).length,
      completion,
      visitors: analytics.visitors,
      cvDownloads: analytics.cvDownloads,
      dailyVisitors: analytics.dailyVisitors,
      dailyDownloads: analytics.dailyDownloads,
      dailyMessages: buildDailyMessages(messages),
      slug: session.slug,
    },
  });
}
