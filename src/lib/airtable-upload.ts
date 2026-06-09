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

/** Airtable attachment field IDs (stable across renames). */
export const ATTACHMENT_FIELD_IDS = {
  profilePhoto: "fld2jxTokqx1wLtyx",
  projectImages: "fld0S5G1pMqduduzX",
  resume: "fldsE30fhYdNoKGdt",
  heroBackground: "fldkDOVDxuDJal9tU",
} as const;

export const ATTACHMENT_FIELDS = {
  profilePhoto: "Profile Photo",
  projectImages: "Project Images",
  resume: "Resume",
  heroBackground: "Hero Background",
} as const;

export type UploadFieldKey = keyof typeof ATTACHMENT_FIELD_IDS;

/**
 * Upload file bytes to Airtable (max 5MB).
 * Must use content.airtable.com — api.airtable.com returns 404 for this route.
 */
export async function uploadAttachmentToAirtable(
  recordId: string,
  fieldKey: UploadFieldKey,
  file: Buffer,
  filename: string,
  contentType: string
): Promise<AirtableUploadedAttachment> {
  if (!recordId?.startsWith("rec")) {
    throw new Error("Invalid record ID for upload.");
  }

  const fieldId = ATTACHMENT_FIELD_IDS[fieldKey];
  const res = await fetch(
    `https://content.airtable.com/v0/${AIRTABLE_BASE_ID}/${recordId}/${fieldId}/uploadAttachment`,
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
    throw new Error(`Airtable upload failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as UploadAttachmentResponse;
  const attachments = Object.values(data.fields).flat();
  const uploaded = attachments[attachments.length - 1];
  if (!uploaded?.url) {
    throw new Error("Upload succeeded but Airtable returned no attachment URL.");
  }
  return uploaded;
}

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
    throw new Error(`Airtable patch failed (${res.status}): ${body}`);
  }
}
