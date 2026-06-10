"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { AppIcon } from "@/components/icons/AppIcons";
import type { ContactMessage } from "@/lib/types";

type Filter = "all" | "unread" | "read";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

function formatMessageDate(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatDetailDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function MessagesPageClient() {
  const { t, dir } = useLocale();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/messages")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = messages.filter((m) => !m.read).length;

  const filtered = useMemo(() => {
    let list = messages;
    if (filter === "unread") list = list.filter((m) => !m.read);
    if (filter === "read") list = list.filter((m) => m.read);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      );
    }
    return list;
  }, [messages, filter, search]);

  async function markRead(id: string) {
    await fetch("/api/dashboard/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    if (selected?.id === id) setSelected((s) => (s ? { ...s, read: true } : s));
  }

  function selectMessage(msg: ContactMessage) {
    setSelected(msg);
    setMobileShowDetail(true);
    if (!msg.read) markRead(msg.id);
  }

  function backToInbox() {
    setMobileShowDetail(false);
  }

  if (loading) {
    return (
      <div dir={dir} className="space-y-4 animate-pulse">
        <div className="h-8 w-48 rounded-lg" style={{ background: "var(--app-input-bg)" }} />
        <div className="h-4 w-72 rounded-lg" style={{ background: "var(--app-input-bg)" }} />
        <div className="h-[420px] rounded-2xl" style={{ background: "var(--app-input-bg)" }} />
      </div>
    );
  }

  return (
    <div dir={dir} className="max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">{t("msg.title")}</h1>
          <p className="text-sm text-app-muted">{t("msg.subtitle")}</p>
        </div>
        {messages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <StatPill icon="mail" label={t("msg.total")} value={messages.length} />
            <StatPill
              icon="bell"
              label={t("msg.unread")}
              value={unreadCount}
              highlight={unreadCount > 0}
            />
          </div>
        )}
      </div>

      {messages.length === 0 ? (
        <EmptyInbox t={t} />
      ) : (
        <div
          className="rounded-2xl border overflow-hidden flex flex-col lg:flex-row min-h-[520px]"
          style={{
            borderColor: "var(--app-border)",
            background: "var(--app-card-bg)",
            boxShadow: "var(--app-shadow-lg)",
          }}
        >
          {/* Inbox panel */}
          <div
            className={`lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col border-b lg:border-b-0 ${
              dir === "rtl" ? "lg:border-l" : "lg:border-r"
            } ${mobileShowDetail ? "hidden lg:flex" : "flex"}`}
            style={{ borderColor: "var(--app-border)" }}
          >
            <div
              className="p-4 border-b space-y-3"
              style={{ borderColor: "var(--app-border)", background: "var(--app-bg-subtle)" }}
            >
              <div className="relative">
                <AppIcon
                  name="mail"
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 opacity-40"
                  style={{
                    [dir === "rtl" ? "right" : "left"]: "12px",
                    color: "var(--app-text-muted)",
                  }}
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("msg.search")}
                  className="input-field !py-2 !text-sm w-full"
                  style={{
                    paddingLeft: dir === "rtl" ? undefined : "2.25rem",
                    paddingRight: dir === "rtl" ? "2.25rem" : undefined,
                  }}
                />
              </div>

              <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--app-input-bg)" }}>
                {(["all", "unread", "read"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className="flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors"
                    style={
                      filter === f
                        ? { background: "var(--app-primary)", color: "#fff" }
                        : { color: "var(--app-text-muted)" }
                    }
                  >
                    {f === "all" ? t("msg.all") : f === "unread" ? t("msg.unread") : t("msg.read")}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-sm text-app-muted text-center py-12 px-4">{t("msg.noResults")}</p>
              ) : (
                filtered.map((msg) => {
                  const active = selected?.id === msg.id;
                  return (
                    <button
                      key={msg.id}
                      type="button"
                      onClick={() => selectMessage(msg)}
                      className="w-full text-left px-4 py-3.5 border-b transition-colors flex gap-3"
                      style={{
                        borderColor: "var(--app-border)",
                        background: active ? "var(--app-primary-muted)" : "transparent",
                        borderLeft: active && dir !== "rtl" ? "3px solid var(--app-primary)" : undefined,
                        borderRight: active && dir === "rtl" ? "3px solid var(--app-primary)" : undefined,
                      }}
                    >
                      <div
                        className="shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold"
                        style={{
                          background: msg.read ? "var(--app-input-bg)" : "var(--app-primary-muted)",
                          color: msg.read ? "var(--app-text-muted)" : "var(--app-primary)",
                        }}
                      >
                        {getInitials(msg.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span
                            className={`text-sm truncate ${!msg.read ? "font-semibold text-app" : "font-medium text-app-muted"}`}
                          >
                            {msg.name}
                          </span>
                          <span className="text-[10px] text-app-muted shrink-0">
                            {formatMessageDate(msg.createdTime)}
                          </span>
                        </div>
                        <p
                          className={`text-sm truncate mb-0.5 ${!msg.read ? "font-medium text-app" : "text-app-muted"}`}
                        >
                          {msg.subject || "—"}
                        </p>
                        <p className="text-xs text-app-muted truncate">{msg.message}</p>
                      </div>
                      {!msg.read && (
                        <span
                          className="shrink-0 mt-2 h-2 w-2 rounded-full"
                          style={{ background: "var(--app-primary)" }}
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Detail panel */}
          <div
            className={`flex-1 flex flex-col min-w-0 ${mobileShowDetail ? "flex" : "hidden lg:flex"}`}
          >
            {selected ? (
              <>
                <div
                  className="px-4 sm:px-6 py-4 border-b flex items-center gap-3"
                  style={{ borderColor: "var(--app-border)", background: "var(--app-bg-subtle)" }}
                >
                  <button
                    type="button"
                    onClick={backToInbox}
                    className="lg:hidden flex items-center gap-1 text-sm text-app-muted hover:text-app"
                  >
                    <AppIcon name="arrow-left" size={16} />
                    {t("msg.back")}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-app truncate">{selected.subject || "—"}</h2>
                    {selected.createdTime && (
                      <p className="text-xs text-app-muted">{formatDetailDate(selected.createdTime)}</p>
                    )}
                  </div>
                  <span
                    className="shrink-0 text-xs px-2.5 py-1 rounded-full font-medium"
                    style={
                      selected.read
                        ? {
                            background: "var(--app-input-bg)",
                            color: "var(--app-text-muted)",
                          }
                        : {
                            background: "var(--app-primary-muted)",
                            color: "var(--app-primary)",
                          }
                    }
                  >
                    {selected.read ? t("msg.read") : t("msg.unread")}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="flex flex-wrap items-start gap-4 mb-6">
                    <div
                      className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0"
                      style={{
                        background: "var(--app-primary-muted)",
                        color: "var(--app-primary)",
                      }}
                    >
                      {getInitials(selected.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-wide text-app-muted mb-1">
                        {t("msg.from")}
                      </p>
                      <p className="font-semibold text-app text-lg">{selected.name}</p>
                      <a
                        href={`mailto:${selected.email}`}
                        className="text-sm break-all inline-flex items-center gap-1 mt-0.5"
                        style={{ color: "var(--app-primary)" }}
                      >
                        {selected.email}
                        <AppIcon name="external-link" size={12} />
                      </a>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl border p-5 sm:p-6"
                    style={{
                      borderColor: "var(--app-border)",
                      background: "var(--app-bg-subtle)",
                    }}
                  >
                    <p className="text-app leading-relaxed whitespace-pre-line text-[15px]">
                      {selected.message}
                    </p>
                  </div>
                </div>

                <div
                  className="px-4 sm:px-6 py-4 border-t flex flex-wrap gap-3"
                  style={{ borderColor: "var(--app-border)" }}
                >
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "")}`}
                    className="btn-primary text-sm inline-flex items-center gap-2"
                  >
                    <AppIcon name="mail" size={16} />
                    {t("msg.reply")}
                  </a>
                  {!selected.read && (
                    <button
                      type="button"
                      onClick={() => markRead(selected.id)}
                      className="btn-secondary text-sm"
                    >
                      {t("msg.markRead")}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ background: "var(--app-primary-muted)", color: "var(--app-primary)" }}
                >
                  <AppIcon name="mail" size={32} />
                </div>
                <p className="font-medium text-app mb-1">{t("msg.selectMessage")}</p>
                <p className="text-sm text-app-muted max-w-xs">{t("msg.selectHint")}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
  highlight,
}: {
  icon: "mail" | "bell";
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl border px-4 py-2.5"
      style={{
        borderColor: highlight ? "var(--app-primary)" : "var(--app-border)",
        background: highlight ? "var(--app-primary-muted)" : "var(--app-card-bg)",
      }}
    >
      <AppIcon name={icon} size={18} style={{ color: "var(--app-primary)" }} />
      <div>
        <p className="text-lg font-bold tabular-nums leading-none text-app">{value}</p>
        <p className="text-[10px] uppercase tracking-wide text-app-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function EmptyInbox({ t }: { t: (key: string) => string }) {
  return (
    <div
      className="rounded-2xl border text-center px-6 py-16 sm:py-20"
      style={{
        borderColor: "var(--app-border)",
        background: "var(--app-card-bg)",
        boxShadow: "var(--app-shadow)",
      }}
    >
      <div
        className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl"
        style={{ background: "var(--app-primary-muted)", color: "var(--app-primary)" }}
      >
        <AppIcon name="mail" size={36} />
      </div>
      <h2 className="font-display text-xl font-semibold text-app mb-2">{t("msg.inbox")}</h2>
      <p className="text-app-muted text-sm max-w-md mx-auto mb-6">{t("msg.empty")}</p>
      <Link href="/dashboard/editor" className="btn-primary text-sm inline-flex items-center gap-2">
        <AppIcon name="sparkles" size={16} />
        {t("dash.customize")}
      </Link>
    </div>
  );
}
