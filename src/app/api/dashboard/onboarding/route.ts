import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPlatformData, savePlatformData } from "@/lib/airtable";
import { parsePlatformData } from "@/lib/platform-data";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const platform = await getPlatformData(session.personalInfoId);
  return NextResponse.json({ onboarding: platform.onboarding });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const current = await getPlatformData(session.personalInfoId);
    const onboarding = {
      ...current.onboarding,
      ...body,
      ...(body.complete ? { completedAt: new Date().toISOString() } : {}),
    };
    const platform = parsePlatformData({ ...current, onboarding });
    await savePlatformData(session.personalInfoId, platform);
    return NextResponse.json({ onboarding: platform.onboarding });
  } catch (error) {
    console.error("Onboarding update error:", error);
    return NextResponse.json({ error: "Failed to update onboarding." }, { status: 500 });
  }
}
