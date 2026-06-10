import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  uploadAttachmentToAirtable,
  patchRecordField,
} from "@/lib/airtable-upload";
import { validateImageFile, validateDocumentFile } from "@/lib/upload";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.personalInfoId?.startsWith("rec")) {
    return NextResponse.json({ error: "Invalid profile record." }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "profile";
    const recordId = (formData.get("recordId") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (type === "gallery") {
      const validationError = validateImageFile(file);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const contentType = file.type || "image/jpeg";
      const attachment = await uploadAttachmentToAirtable(
        session.personalInfoId,
        "heroBackground",
        buffer,
        file.name,
        contentType
      );

      return NextResponse.json({
        url: attachment.url,
        relativePath: attachment.url,
        filename: file.name,
      });
    }

    if (type === "cv") {
      const validationError = validateDocumentFile(file);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
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

      return NextResponse.json({
        url: attachment.url,
        relativePath: attachment.url,
        filename: file.name,
      });
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || "image/jpeg";

    if (type === "project") {
      if (!recordId?.startsWith("rec")) {
        return NextResponse.json(
          { error: "Save the project first, then upload a photo." },
          { status: 400 }
        );
      }

      const attachment = await uploadAttachmentToAirtable(
        recordId,
        "projectImages",
        buffer,
        file.name,
        contentType
      );

      await patchRecordField("Projects", recordId, {
        "Image URL": attachment.url,
      });

      return NextResponse.json({ url: attachment.url, relativePath: attachment.url });
    }

    if (type === "hero") {
      const attachment = await uploadAttachmentToAirtable(
        session.personalInfoId,
        "heroBackground",
        buffer,
        file.name,
        contentType
      );

      return NextResponse.json({ url: attachment.url, relativePath: attachment.url });
    }

    const attachment = await uploadAttachmentToAirtable(
      session.personalInfoId,
      "profilePhoto",
      buffer,
      file.name,
      contentType
    );

    await patchRecordField("Personal Info", session.personalInfoId, {
      "Photo URL": attachment.url,
    });

    return NextResponse.json({ url: attachment.url, relativePath: attachment.url });
  } catch (error) {
    console.error("Upload error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload file.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
