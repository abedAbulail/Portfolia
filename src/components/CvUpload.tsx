"use client";

import { useRef, useState } from "react";
import { AppIcon } from "@/components/icons/AppIcons";

interface CvUploadProps {
  currentUrl?: string;
  currentFilename?: string;
  onUpload: (url: string, filename: string) => void;
}

export default function CvUpload({ currentUrl, currentFilename, onUpload }: CvUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [filename, setFilename] = useState(currentFilename || "");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "cv");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }

      setFilename(data.filename || file.name);
      onUpload(data.url, data.filename || file.name);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="label-text">Resume / CV</label>
      <div className="card !p-4">
        {currentUrl ? (
          <div className="flex items-center gap-3 mb-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: "var(--app-primary-muted)", color: "var(--app-primary)" }}
            >
              <AppIcon name="file" size={20} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-app truncate">{filename || "Your resume"}</p>
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs inline-flex items-center gap-1"
                style={{ color: "var(--app-primary)" }}
              >
                View current file
                <AppIcon name="external-link" size={12} />
              </a>
            </div>
          </div>
        ) : (
          <p className="text-sm text-app-muted mb-3">No resume uploaded yet.</p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          className="input-field block w-full"
        />
        <p className="mt-1.5 text-xs text-app-muted">PDF, DOC or DOCX. Max 10MB.</p>
        {uploading && <p className="mt-2 text-xs" style={{ color: "var(--app-primary)" }}>Uploading...</p>}
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
