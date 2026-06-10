"use client";

import { useEffect, useRef } from "react";
import type { PortfolioTheme, SectionStyle } from "@/lib/portfolio-theme";
import { getAlignClass } from "@/lib/portfolio-theme";
import { preprocessCustomHtml, SHADOW_HOST_BASE } from "@/lib/custom-html";

export default function CustomHtmlSection({
  html,
  style,
}: {
  html: string;
  theme: PortfolioTheme;
  style: SectionStyle;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const align = getAlignClass(style.alignment);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !html.trim()) return;

    let shadow = host.shadowRoot;
    if (!shadow) {
      shadow = host.attachShadow({ mode: "open" });
    }

    const processed = preprocessCustomHtml(html);
    shadow.innerHTML = SHADOW_HOST_BASE + processed;
  }, [html]);

  if (!html.trim()) return null;

  return (
    <div
      ref={hostRef}
      className={`pf-html-isolated w-full min-w-0 ${align}`}
      aria-label="Custom HTML content"
    />
  );
}
