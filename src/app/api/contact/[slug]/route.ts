import { NextResponse } from "next/server";
import { createContactMessage, getPersonalInfoIdBySlug, getPlatformData, savePlatformData } from "@/lib/airtable";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const personalInfoId = await getPersonalInfoIdBySlug(slug);
    if (!personalInfoId) {
      return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
    }

    const { name, email, subject, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    await createContactMessage(personalInfoId, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || "Portfolio inquiry",
      message: message.trim(),
    });

    const platform = await getPlatformData(personalInfoId);
    platform.notifications.unshift({
      id: `notif-${Date.now()}`,
      type: "message",
      title: "New message",
      body: `${name.trim()} sent: ${subject?.trim() || "Portfolio inquiry"}`,
      read: false,
      createdAt: new Date().toISOString(),
      href: "/dashboard/messages",
    });
    await savePlatformData(personalInfoId, platform);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
