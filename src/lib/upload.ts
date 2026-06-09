import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, WebP, and GIF images are allowed.";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Image must be smaller than 5MB.";
  }
  return null;
}

export function validateDocumentFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const allowedExt = ["pdf", "doc", "docx"];
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type) && !allowedExt.includes(ext || "")) {
    return "Only PDF, DOC, and DOCX files are allowed.";
  }
  if (file.size > MAX_DOCUMENT_SIZE) {
    return "File must be smaller than 10MB.";
  }
  return null;
}

async function saveUploadedFile(
  file: File,
  ownerId: string,
  prefix: string,
  allowedExts: string[],
  defaultExt: string
): Promise<{ url: string; relativePath: string; filename: string }> {
  const ext = file.name.split(".").pop()?.toLowerCase() || defaultExt;
  const safeExt = allowedExts.includes(ext) ? ext : defaultExt;
  const filename = `${prefix}-${Date.now()}.${safeExt}`;
  const relativePath = `uploads/${ownerId}/${filename}`;
  const absoluteDir = path.join(process.cwd(), "public", "uploads", ownerId);
  const absolutePath = path.join(absoluteDir, filename);

  await mkdir(absoluteDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  const baseUrl = getAppBaseUrl().replace(/\/$/, "");
  return {
    url: `${baseUrl}/${relativePath}`,
    relativePath: `/${relativePath}`,
    filename: file.name,
  };
}

export async function saveUploadedImage(
  file: File,
  ownerId: string,
  prefix: string
): Promise<{ url: string; relativePath: string }> {
  const result = await saveUploadedFile(file, ownerId, prefix, ["jpg", "jpeg", "png", "webp", "gif"], "jpg");
  return { url: result.url, relativePath: result.relativePath };
}

export async function saveUploadedDocument(
  file: File,
  ownerId: string,
  prefix: string
): Promise<{ url: string; relativePath: string; filename: string }> {
  return saveUploadedFile(file, ownerId, prefix, ["pdf", "doc", "docx"], "pdf");
}
