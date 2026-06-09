"use client";

import type { ReactNode } from "react";
import { AppIcon, type AppIconName } from "@/components/icons/AppIcons";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: AppIconName;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div
      className="rounded-2xl border p-5 transition-shadow hover:shadow-md"
      style={{
        borderColor: "var(--app-border)",
        background: "var(--app-card-bg)",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "var(--app-primary-muted)",
              color: "var(--app-primary)",
            }}
          >
            <AppIcon name={icon} size={22} />
          </div>
          <p
            className="text-sm font-medium leading-snug"
            style={{ color: "var(--app-text-muted)" }}
          >
            {label}
          </p>
        </div>
        <p
          className="text-4xl font-bold tabular-nums shrink-0"
          style={{ color: "var(--app-primary)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export function StatCardCentered({
  label,
  value,
  icon,
}: StatCardProps) {
  return (
    <div
      className="rounded-2xl border p-6 text-center transition-shadow hover:shadow-md"
      style={{
        borderColor: "var(--app-border)",
        background: "var(--app-card-bg)",
      }}
    >
      <div
        className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{
          background: "var(--app-primary-muted)",
          color: "var(--app-primary)",
        }}
      >
        <AppIcon name={icon} size={24} />
      </div>
      <p
        className="text-5xl font-bold tabular-nums mb-2"
        style={{ color: "var(--app-primary)" }}
      >
        {value}
      </p>
      <p className="text-sm font-medium" style={{ color: "var(--app-text-muted)" }}>
        {label}
      </p>
    </div>
  );
}

export function IconBadge({
  name,
  children,
}: {
  name: AppIconName;
  children?: ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-xl"
      style={{
        background: "var(--app-primary-muted)",
        color: "var(--app-primary)",
      }}
    >
      <AppIcon name={name} size={20} />
      {children}
    </span>
  );
}
