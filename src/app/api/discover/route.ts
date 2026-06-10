import { NextResponse } from "next/server";
import { listDirectoryProfiles } from "@/lib/airtable";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const industry = (searchParams.get("industry") || "").toLowerCase();
  const skill = (searchParams.get("skill") || "").toLowerCase();
  const location = (searchParams.get("location") || "").toLowerCase();

  let profiles = await listDirectoryProfiles();

  if (q) {
    profiles = profiles.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.position?.toLowerCase().includes(q) ||
        p.skills.some((s) => s.toLowerCase().includes(q))
    );
  }
  if (industry) profiles = profiles.filter((p) => p.industry?.toLowerCase().includes(industry));
  if (skill) profiles = profiles.filter((p) => p.skills.some((s) => s.toLowerCase().includes(skill)));
  if (location) profiles = profiles.filter((p) => p.location?.toLowerCase().includes(location));

  return NextResponse.json({ profiles, leaderboard: profiles.slice(0, 10) });
}
