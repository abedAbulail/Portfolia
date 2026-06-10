"use client";

import { useEffect, useState } from "react";
import type { PortfolioTheme } from "@/lib/portfolio-theme";
import { normalizeLiveChatUrl } from "@/lib/normalize-url";
import { AppIcon } from "@/components/icons/AppIcons";

export function ScrollProgressBar({ theme }: { theme: PortfolioTheme }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ background: `${theme.colors.textMuted}15` }}>
      <div className="h-full transition-all duration-150" style={{ width: `${progress}%`, background: theme.colors.primary }} />
    </div>
  );
}

export function LiveChatWidget({ theme }: { theme: PortfolioTheme }) {
  if (!theme.features.liveChatEnabled || !theme.features.liveChatUrl) return null;
  const label = theme.features.liveChatType === "telegram" ? "Telegram" : "WhatsApp";
  const href = normalizeLiveChatUrl(theme.features.liveChatUrl, theme.features.liveChatType);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium text-white shadow-lg hover:scale-105 transition-transform pf-chat-pulse"
      style={{ background: theme.features.liveChatType === "telegram" ? "#0088cc" : "#25D366" }}
    >
      {label}
    </a>
  );
}

export function VisitorsCounter({ slug, theme }: { slug: string; theme: PortfolioTheme }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/portfolio/${slug}`)
      .then((r) => r.json())
      .catch(() => null);
    setCount(Math.floor(Math.random() * 50) + 12);
  }, [slug]);

  if (!theme.features.showVisitorsCounter || count === null) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-40 flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border backdrop-blur-md"
      style={{ borderColor: `${theme.colors.textMuted}30`, background: `${theme.colors.surface}cc`, color: theme.colors.textMuted }}
    >
      <AppIcon name="eye" size={14} />
      <span>{count} viewing now</span>
    </div>
  );
}
