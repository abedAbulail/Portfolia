import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPlatformData, savePlatformData } from "@/lib/airtable";
import type { JobApplicationStatus } from "@/lib/platform-data";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const platform = await getPlatformData(session.personalInfoId);
  return NextResponse.json({
    favorites: platform.jobFavorites,
    applications: platform.jobApplications,
  });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const platform = await getPlatformData(session.personalInfoId);

  if (body.action === "toggleFavorite" && body.jobId) {
    const favs = new Set(platform.jobFavorites);
    if (favs.has(body.jobId)) favs.delete(body.jobId);
    else favs.add(body.jobId);
    platform.jobFavorites = [...favs];
  }

  if (body.action === "setStatus" && body.jobId && body.status) {
    const status = body.status as JobApplicationStatus;
    const idx = platform.jobApplications.findIndex((a) => a.jobId === body.jobId);
    const entry = {
      jobId: body.jobId,
      status,
      notes: body.notes || "",
      updatedAt: new Date().toISOString(),
    };
    if (idx >= 0) platform.jobApplications[idx] = entry;
    else platform.jobApplications.push(entry);
  }

  await savePlatformData(session.personalInfoId, platform);
  return NextResponse.json({
    favorites: platform.jobFavorites,
    applications: platform.jobApplications,
  });
}
