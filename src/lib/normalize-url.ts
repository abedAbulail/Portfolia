import type { LiveChatType } from "@/lib/portfolio-theme";

/** Ensure external chat links open correctly instead of as relative paths. */
export function normalizeLiveChatUrl(url: string, type: LiveChatType): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  if (/^(wa\.me|api\.whatsapp\.com)\//i.test(trimmed)) {
    return `https://${trimmed.replace(/^\/+/, "")}`;
  }

  if (/^(t\.me|telegram\.me)\//i.test(trimmed)) {
    return `https://${trimmed.replace(/^\/+/, "")}`;
  }

  if (type === "whatsapp") {
    const digits = trimmed.replace(/\D/g, "");
    if (digits) return `https://wa.me/${digits}`;
  }

  if (type === "telegram") {
    const username = trimmed.replace(/^@/, "").replace(/^(?:https?:\/\/)?(?:t\.me|telegram\.me)\//i, "");
    if (username) return `https://t.me/${username}`;
  }

  return `https://${trimmed.replace(/^\/+/, "")}`;
}

/** Normalize bare external URLs in custom HTML anchors. */
export function normalizeExternalUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^(https?:|mailto:|tel:|#|\/)/i.test(trimmed)) return trimmed;
  if (/^(wa\.me|api\.whatsapp\.com|t\.me|telegram\.me)/i.test(trimmed)) {
    return `https://${trimmed.replace(/^\/+/, "")}`;
  }
  return `https://${trimmed.replace(/^\/+/, "")}`;
}
