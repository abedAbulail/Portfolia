import type { AirtableAttachment } from "./types";

/** Returns true if the URL is only reachable on the dev machine (localhost / private). */
export function isUnreachableMediaUrl(url?: string | null): boolean {
  if (!url?.trim()) return true;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.") ||
      host.endsWith(".local")
    );
  } catch {
    return true;
  }
}

/**
 * Prefer a fresh Airtable attachment CDN URL over a stale text-field URL
 * (e.g. localhost links saved before Airtable uploads were enabled).
 */
export function resolveMediaUrl(
  storedUrl?: string | null,
  attachments?: AirtableAttachment[] | null
): string | undefined {
  const attachmentUrl = attachments?.[0]?.url;
  if (attachmentUrl) return attachmentUrl;
  if (storedUrl && !isUnreachableMediaUrl(storedUrl)) return storedUrl;
  return undefined;
}
