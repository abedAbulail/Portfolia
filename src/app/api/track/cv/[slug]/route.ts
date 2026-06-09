import { NextResponse } from "next/server";
import { recordCvDownload } from "@/lib/airtable";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const resumeUrl = await recordCvDownload(slug);

  if (!resumeUrl) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  return NextResponse.redirect(resumeUrl);
}
