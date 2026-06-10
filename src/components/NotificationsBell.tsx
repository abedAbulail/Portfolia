"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppIcon } from "@/components/icons/AppIcons";
import type { Notification } from "@/lib/platform-data";

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications || []));
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  async function markAllRead() {
    await fetch("/api/dashboard/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markAllRead" }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border"
        style={{ borderColor: "var(--app-border)", color: "var(--app-text-muted)" }}
        aria-label="Notifications"
      >
        <AppIcon name="bell" size={18} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ background: "var(--app-primary)" }}>
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-lg z-50 overflow-hidden" style={{ borderColor: "var(--app-border)", background: "var(--app-card-bg)" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--app-border)" }}>
            <span className="text-sm font-semibold text-app">Notifications</span>
            {unread > 0 && (
              <button type="button" onClick={markAllRead} className="text-xs" style={{ color: "var(--app-primary)" }}>Mark all read</button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-app-muted p-4 text-center">No notifications</p>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <Link
                  key={n.id}
                  href={n.href || "#"}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 border-b text-left hover:bg-black/5"
                  style={{ borderColor: "var(--app-border)", opacity: n.read ? 0.6 : 1 }}
                >
                  <p className="text-sm font-medium text-app">{n.title}</p>
                  <p className="text-xs text-app-muted">{n.body}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
