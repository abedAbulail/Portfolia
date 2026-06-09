import type { ReactNode } from "react";
import type { PortfolioTheme, SectionId, SectionStyle } from "@/lib/portfolio-theme";
import {
  getAlignClass,
  getSectionPaddingClass,
  getSectionBackgroundStyle,
  getRadiusClass,
  getHeadingFontClass,
} from "@/lib/portfolio-theme";

interface SectionShellProps {
  id: SectionId;
  theme: PortfolioTheme;
  style: SectionStyle;
  headingFont: string;
  title: string;
  children: ReactNode;
}

export function SectionShell({
  theme,
  style,
  headingFont,
  title,
  children,
}: SectionShellProps) {
  const radius = getRadiusClass(theme.layout.borderRadius);
  const align = getAlignClass(style.alignment);
  const padding = getSectionPaddingClass(style.padding);
  const bgStyle = getSectionBackgroundStyle(style.background, theme);

  return (
    <section
      className={`${padding} ${style.background !== "transparent" ? radius : ""} ${align}`}
      style={bgStyle}
    >
      {style.showDivider && (
        <div
          className="w-12 h-0.5 mb-4"
          style={{
            backgroundColor: theme.colors.primary,
            marginLeft: style.alignment === "center" ? "auto" : style.alignment === "right" ? "auto" : undefined,
            marginRight: style.alignment === "center" ? "auto" : style.alignment === "right" ? 0 : undefined,
          }}
        />
      )}
      <h2
        className={`${headingFont} text-2xl font-semibold mb-5`}
        style={{ color: theme.colors.primary }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ThemedButton({
  href,
  theme,
  radius,
  children,
  variant = "primary",
}: {
  href: string;
  theme: PortfolioTheme;
  radius: string;
  children: ReactNode;
  variant?: "primary" | "outline";
}) {
  const isPrimary = variant === "primary";
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium ${radius} transition-opacity hover:opacity-90`}
      style={
        isPrimary
          ? { backgroundColor: theme.colors.primary, color: theme.colors.background }
          : {
              border: `1px solid ${theme.colors.primary}50`,
              color: theme.colors.primary,
              backgroundColor: "transparent",
            }
      }
    >
      {children}
    </a>
  );
}
