"use client";

import { useRef, useState } from "react";
import { AppIcon } from "@/components/icons/AppIcons";

interface ImageUploadProps {
  label: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  type?: "profile" | "project";
  recordId?: string;
  disabled?: boolean;
  disabledHint?: string;
}

export default function ImageUpload({
  label,
  currentUrl,
  onUpload,
  type = "profile",
  recordId,
  disabled = false,
  disabledHint,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (disabled) return;

    setError("");
    setUploading(true);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      if (recordId) formData.append("recordId", recordId);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        setPreview(currentUrl || null);
        return;
      }

      setPreview(data.url);
      onUpload(data.url);
    } catch {
      setError("Upload failed. Please try again.");
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      <div className="flex items-start gap-4">
        <div
          className={`relative shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 ${
            type === "profile" ? "h-24 w-24" : "h-28 w-40"
          }`}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ color: "var(--app-text-muted)" }}
            >
              <AppIcon name={type === "profile" ? "user" : "image"} size={28} />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-white">
              Uploading...
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-violet-500 file:cursor-pointer disabled:opacity-50"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            JPEG, PNG, WebP or GIF. Max 5MB. Stored on Airtable CDN.
          </p>
          {disabled && disabledHint && (
            <p className="mt-1 text-xs text-amber-500">{disabledHint}</p>
          )}
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
