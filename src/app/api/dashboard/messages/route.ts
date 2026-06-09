import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getMessagesForPersonalInfo, markMessageRead } from "@/lib/airtable";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await getMessagesForPersonalInfo(session.personalInfoId);
  return NextResponse.json({ messages });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Message ID required." }, { status: 400 });
  }

  await markMessageRead(id);
  return NextResponse.json({ success: true });
}
