import { NextResponse } from "next/server";
import { getPersonalInfoIdBySlug, getPlatformData, savePlatformData } from "@/lib/airtable";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const personalInfoId = await getPersonalInfoIdBySlug(slug);
  if (!personalInfoId) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const platform = await getPlatformData(personalInfoId);
  return NextResponse.json({
    enabled: platform.booking.enabled,
    durationMinutes: platform.booking.durationMinutes,
    slots: platform.booking.slots.filter((s) => s.enabled),
  });
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const personalInfoId = await getPersonalInfoIdBySlug(slug);
  if (!personalInfoId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const platform = await getPlatformData(personalInfoId);
  if (!platform.booking.enabled) {
    return NextResponse.json({ error: "Booking disabled" }, { status: 403 });
  }

  const booking = {
    id: `bk-${Date.now()}`,
    name: body.name,
    email: body.email,
    date: body.date,
    time: body.time,
    message: body.message || "",
    status: "pending" as const,
    createdAt: new Date().toISOString(),
  };
  platform.booking.requests.push(booking);
  platform.notifications.unshift({
    id: `notif-${Date.now()}`,
    type: "booking",
    title: "New booking request",
    body: `${body.name} requested ${body.date} at ${body.time}`,
    read: false,
    createdAt: new Date().toISOString(),
    href: "/dashboard/booking",
  });
  await savePlatformData(personalInfoId, platform);
  return NextResponse.json({ ok: true });
}
