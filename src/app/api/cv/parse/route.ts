import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { validateDocumentFile } from "@/lib/upload";
import { extractTextFromCv, parseCvFromText } from "@/lib/cv-parser";
import { applyParsedCv } from "@/lib/cv-import";
import {
  uploadAttachmentToAirtable,
  patchRecordField,
} from "@/lib/airtable-upload";
import { getPersonalInfo } from "@/lib/airtable";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.personalInfoId?.startsWith("rec")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const validationError = validateDocumentFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractTextFromCv(buffer, file.name);

    if (!text.trim()) {
      return NextResponse.json(
        { error: "Could not read text from this file. Try a different PDF or DOCX." },
        { status: 422 }
      );
    }

    const { parsed, source } = await parseCvFromText(text);

    const attachment = await uploadAttachmentToAirtable(
      session.personalInfoId,
      "resume",
      buffer,
      file.name,
      file.type || "application/pdf"
    );

    await patchRecordField("Personal Info", session.personalInfoId, {
      "Resume URL": attachment.url,
    });

    const { projects, skills } = await applyParsedCv(
      session.personalInfoId,
      parsed,
      attachment.url
    );

    const personalInfo = await getPersonalInfo(session.personalInfoId);

    return NextResponse.json({
      parsed,
      source,
      personalInfo,
      projects,
      skills,
      resumeUrl: attachment.url,
    });
  } catch (error) {
    console.error("CV parse error:", error);
    const message = error instanceof Error ? error.message : "Failed to parse CV.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
