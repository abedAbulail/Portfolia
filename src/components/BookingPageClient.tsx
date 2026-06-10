"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import type { BookingSettings } from "@/lib/platform-data";

export default function BookingPageClient() {
  const { t, dir } = useLocale();
  const [booking, setBooking] = useState<BookingSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/platform")
      .then((r) => r.json())
      .then((d) => setBooking(d.platform?.booking || null));
  }, []);

  async function save(next: BookingSettings) {
    setSaving(true);
    await fetch("/api/dashboard/platform", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking: next }),
    });
    setBooking(next);
    setSaving(false);
  }

  if (!booking) return <p className="text-app-muted">{t("booking.loading")}</p>;

  return (
    <div dir={dir} className="max-w-2xl">
      <h1 className="page-title">{t("booking.title")}</h1>
      <p className="page-subtitle">{t("booking.subtitle")}</p>

      <div className="card p-5 space-y-4 mb-6">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={booking.enabled} onChange={(e) => save({ ...booking, enabled: e.target.checked })} />
          <span className="text-sm text-app">{t("booking.enable")}</span>
        </label>
        <div>
          <label className="text-xs text-app-muted">{t("booking.duration")}</label>
          <input type="number" value={booking.durationMinutes} onChange={(e) => save({ ...booking, durationMinutes: Number(e.target.value) })} className="input-field !py-2 text-sm w-32 mt-1" />
        </div>
      </div>

      {booking.requests.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-app">{t("booking.requests")}</h2>
          {booking.requests.map((req) => (
            <div key={req.id} className="card p-4">
              <p className="font-medium text-app">{req.name}</p>
              <p className="text-sm text-app-muted">{req.email}</p>
              <p className="text-sm text-app-muted">{req.date} at {req.time}</p>
              {req.message && <p className="text-sm mt-2">{req.message}</p>}
              <span className="text-xs px-2 py-0.5 rounded-full mt-2 inline-block" style={{ background: "var(--app-primary-muted)", color: "var(--app-primary)" }}>{req.status}</span>
            </div>
          ))}
        </div>
      )}
      {saving && <p className="text-xs text-app-muted mt-4">{t("booking.saving")}</p>}
    </div>
  );
}
