import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  saveUploadedImage,
  saveUploadedDocument,
  validateImageFile,
  validateDocumentFile,
} from "@/lib/upload";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "profile";

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (type === "cv") {
      const validationError = validateDocumentFile(file);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
      const result = await saveUploadedDocument(file, session.personalInfoId, "cv");
      return NextResponse.json(result);
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const prefix =
      type === "project" ? "project" : type === "hero" ? "hero" : "profile";
    const { url, relativePath } = await saveUploadedImage(
      file,
      session.personalInfoId,
      prefix
    );

    return NextResponse.json({ url, relativePath });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}
