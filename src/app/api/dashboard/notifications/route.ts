import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPlatformData, savePlatformData } from "@/lib/airtable";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const platform = await getPlatformData(session.personalInfoId);
  return NextResponse.json({ notifications: platform.notifications });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const platform = await getPlatformData(session.personalInfoId);

  if (body.action === "markRead" && body.id) {
    platform.notifications = platform.notifications.map((n) =>
      n.id === body.id ? { ...n, read: true } : n
    );
  }
  if (body.action === "markAllRead") {
    platform.notifications = platform.notifications.map((n) => ({ ...n, read: true }));
  }

  await savePlatformData(session.personalInfoId, platform);
  return NextResponse.json({ notifications: platform.notifications });
}
