import { AIRTABLE_BASE_ID, AIRTABLE_TOKEN } from "./config";

export interface AirtableUploadedAttachment {
  id: string;
  url: string;
  filename?: string;
  size?: number;
  type?: string;
}

interface UploadAttachmentResponse {
  id: string;
  fields: Record<string, AirtableUploadedAttachment[]>;
}

/** Upload file bytes directly to an Airtable attachment field (max 5MB). */
export async function uploadAttachmentToAirtable(
  recordId: string,
  fieldName: string,
  file: Buffer,
  filename: string,
  contentType: string
): Promise<AirtableUploadedAttachment> {
  const fieldSegment = encodeURIComponent(fieldName);
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${recordId}/${fieldSegment}/uploadAttachment`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contentType,
        file: file.toString("base64"),
        filename,
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable upload failed ${res.status}: ${body}`);
  }

  const data = (await res.json()) as UploadAttachmentResponse;
  const attachments = Object.values(data.fields).flat();
  const uploaded = attachments[attachments.length - 1];
  if (!uploaded?.url) {
    throw new Error("Airtable upload succeeded but no attachment URL was returned.");
  }
  return uploaded;
}

export const ATTACHMENT_FIELDS = {
  profilePhoto: "Profile Photo",
  projectImages: "Project Images",
  resume: "Resume",
  heroBackground: "Hero Background",
} as const;

export async function patchRecordField(
  tableName: string,
  recordId: string,
  fields: Record<string, unknown>
): Promise<void> {
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}/${recordId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable patch failed ${res.status}: ${body}`);
  }
}
