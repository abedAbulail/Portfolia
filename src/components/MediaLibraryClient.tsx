"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { AppIcon } from "@/components/icons/AppIcons";
import { compressImage } from "@/lib/image-compress";
import type { MediaItem, Testimonial } from "@/lib/platform-data";

export default function MediaLibraryClient() {
  const { t, dir } = useLocale();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [unsplash, setUnsplash] = useState<Array<{ id: string; url: string; thumb: string; alt: string }>>([]);
  const [search, setSearch] = useState("workspace");
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"library" | "testimonials" | "unsplash">("library");

  const load = useCallback(() => {
    fetch("/api/dashboard/platform")
      .then((r) => r.json())
      .then((d) => {
        setMedia(d.platform?.mediaLibrary || []);
        setTestimonials(d.platform?.testimonials || []);
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  async function savePlatform(patch: Record<string, unknown>) {
    await fetch("/api/dashboard/platform", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    load();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const compressed = await compressImage(file);
    const fd = new FormData();
    fd.append("file", compressed);
    fd.append("type", "profile");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) {
      const item: MediaItem = {
        id: `media-${Date.now()}`,
        url: data.url,
        filename: compressed.name,
        type: file.type.startsWith("video/") ? "video" : "image",
        size: compressed.size,
        createdAt: new Date().toISOString(),
      };
      await savePlatform({ mediaLibrary: [...media, item] });
    }
    setUploading(false);
  }

  async function searchUnsplash() {
    const res = await fetch(`/api/unsplash?q=${encodeURIComponent(search)}`);
    const data = await res.json();
    setUnsplash(data.photos || []);
  }

  async function addFromUnsplash(photo: { id: string; url: string; alt: string }) {
    const item: MediaItem = {
      id: `unsplash-${photo.id}`,
      url: photo.url,
      filename: photo.alt || "unsplash.jpg",
      type: "image",
      createdAt: new Date().toISOString(),
    };
    await savePlatform({ mediaLibrary: [...media, item] });
  }

  function addTestimonial() {
    const item: Testimonial = {
      id: `t-${Date.now()}`,
      name: "Client Name",
      role: "CEO",
      company: "Company",
      quote: "Great work!",
      rating: 5,
    };
    savePlatform({ testimonials: [...testimonials, item] });
  }

  return (
    <div dir={dir} className="max-w-5xl">
      <h1 className="page-title">{t("media.title")}</h1>
      <p className="page-subtitle">{t("media.subtitle")}</p>

      <div className="flex gap-2 mb-6">
        {(["library", "testimonials", "unsplash"] as const).map((tabId) => (
          <button key={tabId} type="button" onClick={() => setTab(tabId)} className="px-3 py-1.5 text-sm rounded-lg" style={tab === tabId ? { background: "var(--app-primary)", color: "#fff" } : { color: "var(--app-text-muted)" }}>
            {t(`media.tab.${tabId}`)}
          </button>
        ))}
      </div>

      {tab === "library" && (
        <>
          <label className="btn-primary text-sm inline-flex items-center gap-2 cursor-pointer mb-6">
            <AppIcon name="image" size={16} />
            {uploading ? t("media.uploading") : t("media.upload")}
            <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
          </label>
          <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.id} className="card overflow-hidden">
                {item.type === "video" ? (
                  <video src={item.url} className="w-full h-32 object-cover" controls />
                ) : (
                  <img src={item.url} alt={item.filename} className="w-full h-32 object-cover" />
                )}
                <div className="p-2 flex items-center justify-between">
                  <p className="text-xs text-app-muted truncate">{item.filename}</p>
                  <button type="button" onClick={() => savePlatform({ mediaLibrary: media.filter((m) => m.id !== item.id) })} className="text-red-400 text-xs">×</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "testimonials" && (
        <>
          <button type="button" onClick={addTestimonial} className="btn-primary text-sm mb-4">+ {t("media.addTestimonial")}</button>
          <div className="space-y-3">
            {testimonials.map((item) => (
              <div key={item.id} className="card p-4 space-y-2">
                <input value={item.name} onChange={(e) => setTestimonials(testimonials.map((t) => t.id === item.id ? { ...t, name: e.target.value } : t))} className="input-field !py-2 text-sm" placeholder="Name" />
                <input value={item.quote} onChange={(e) => setTestimonials(testimonials.map((t) => t.id === item.id ? { ...t, quote: e.target.value } : t))} className="input-field !py-2 text-sm" placeholder="Quote" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => savePlatform({ testimonials })} className="btn-secondary text-xs">{t("media.save")}</button>
                  <button type="button" onClick={() => savePlatform({ testimonials: testimonials.filter((t) => t.id !== item.id) })} className="text-red-400 text-xs">{t("media.delete")}</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "unsplash" && (
        <>
          <div className="flex gap-2 mb-4">
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field flex-1 !py-2 text-sm" placeholder={t("media.unsplashSearch")} />
            <button type="button" onClick={searchUnsplash} className="btn-primary text-sm">{t("media.search")}</button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {unsplash.map((photo) => (
              <button key={photo.id} type="button" onClick={() => addFromUnsplash(photo)} className="card overflow-hidden text-left">
                <img src={photo.thumb} alt={photo.alt} className="w-full h-32 object-cover" />
                <p className="p-2 text-xs text-app-muted truncate">{photo.alt || "Photo"}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
