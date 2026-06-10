import { NextResponse } from "next/server";
import { getPersonalInfoIdBySlug, getPlatformData, savePlatformData } from "@/lib/airtable";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const personalInfoId = await getPersonalInfoIdBySlug(slug);
  if (!personalInfoId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const platform = await getPlatformData(personalInfoId);

  const review = {
    id: `rev-${Date.now()}`,
    authorName: body.authorName,
    authorEmail: body.authorEmail,
    rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
    comment: body.comment,
    createdAt: new Date().toISOString(),
  };
  platform.reviews.push(review);
  platform.notifications.unshift({
    id: `notif-${Date.now()}`,
    type: "review",
    title: "New review",
    body: `${review.authorName} left a ${review.rating}-star review`,
    read: false,
    createdAt: new Date().toISOString(),
    href: "/dashboard/profile",
  });
  await savePlatformData(personalInfoId, platform);
  return NextResponse.json({ ok: true });
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const personalInfoId = await getPersonalInfoIdBySlug(slug);
  if (!personalInfoId) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const platform = await getPlatformData(personalInfoId);
  return NextResponse.json({ reviews: platform.reviews });
}
