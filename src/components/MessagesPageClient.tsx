"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { AppIcon } from "@/components/icons/AppIcons";
import type { ContactMessage } from "@/lib/types";

export default function MessagesPageClient() {
  const { t, dir } = useLocale();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/messages")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id: string) {
    await fetch("/api/dashboard/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    if (selected?.id === id) setSelected({ ...selected, read: true });
  }

  if (loading) return <p className="text-slate-400">{t("msg.title")}...</p>;

  return (
    <div dir={dir}>
      <h1 className="font-display text-2xl font-bold text-white mb-1">{t("msg.title")}</h1>
      <p className="text-slate-400 text-sm mb-8">{t("msg.subtitle")}</p>

      {messages.length === 0 ? (
        <div className="card text-center py-12">
          <div
            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ background: "var(--app-primary-muted)", color: "var(--app-primary)" }}
          >
            <AppIcon name="mail" size={28} />
          </div>
          <p style={{ color: "var(--app-text-muted)" }}>{t("msg.empty")}</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            {messages.map((msg) => (
              <button
                key={msg.id}
                type="button"
                onClick={() => {
                  setSelected(msg);
                  if (!msg.read) markRead(msg.id);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  selected?.id === msg.id
                    ? "border-violet-500/40 bg-violet-500/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{msg.name}</p>
                    <p className="text-xs text-slate-500 truncate">{msg.email}</p>
                  </div>
                  {!msg.read && (
                    <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-violet-600 text-white">
                      {t("msg.unread")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 mt-2 truncate">{msg.subject}</p>
              </button>
            ))}
          </div>

          <div className="card min-h-[300px]">
            {selected ? (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500">{t("msg.from")}</p>
                    <p className="font-semibold text-white">{selected.name}</p>
                    <a href={`mailto:${selected.email}`} className="text-sm text-violet-400">
                      {selected.email}
                    </a>
                  </div>
                  <span className="text-xs text-slate-600">
                    {selected.read ? t("msg.read") : t("msg.unread")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-1">{t("msg.subject")}</p>
                <p className="font-medium text-white mb-4">{selected.subject}</p>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{selected.message}</p>
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-12">Select a message to read</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
