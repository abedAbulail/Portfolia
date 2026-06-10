import type { ReactNode } from "react";
import type { PortfolioTheme, SectionStyle } from "@/lib/portfolio-theme";
import {
  getAlignClass,
  getSectionPaddingClass,
  getRadiusClass,
  getShadowStyle,
  getSectionMaxWidthClass,
  getSectionMinHeightClass,
  resolveSectionColors,
  resolveSectionBackgroundStyle,
} from "@/lib/portfolio-theme";
import InViewReveal from "@/components/portfolio/animations/InViewReveal";

interface SectionShellProps {
  id: string;
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
  const radius = getRadiusClass(style.borderRadius || theme.layout.borderRadius);
  const align = getAlignClass(style.alignment);
  const padding = getSectionPaddingClass(style.padding);
  const minH = getSectionMinHeightClass(style.minHeight);
  const maxW = getSectionMaxWidthClass(style.maxWidth);
  const colors = resolveSectionColors(style, theme);
  const bgStyle = resolveSectionBackgroundStyle(style, theme);
  const shadow = getShadowStyle(style.shadow);

  const sectionStyle: Record<string, string> = {
    ...bgStyle,
    color: colors.text,
    ...(style.backgroundImage
      ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${style.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {}),
    ...(shadow ? { boxShadow: shadow } : {}),
    ...(colors.border && style.background !== "transparent" ? { border: `1px solid ${colors.border}` } : {}),
  };

  return (
    <InViewReveal>
      <section className={`${minH} ${maxW ? `mx-auto ${maxW}` : ""}`}>
        <div
          className={`${padding} ${style.background !== "transparent" || style.backgroundImage ? radius : ""} ${align} ${minH}`}
          style={sectionStyle}
        >
          {style.showDivider && (
            <div
              className="w-12 h-0.5 mb-4"
              style={{
                backgroundColor: colors.title,
                marginLeft: style.alignment === "center" ? "auto" : style.alignment === "right" ? "auto" : undefined,
                marginRight: style.alignment === "center" ? "auto" : style.alignment === "right" ? 0 : undefined,
              }}
            />
          )}
          <h2 className={`${headingFont} text-2xl font-semibold mb-5`} style={{ color: colors.title }}>
            {title}
          </h2>
          <div className="w-full min-w-0" style={{ color: colors.text }}>{children}</div>
        </div>
      </section>
    </InViewReveal>
  );
}

export function ThemedButton({
  href,
  theme,
  radius,
  children,
  variant = "primary",
  className = "",
  colorPrimary,
  colorBg,
}: {
  href: string;
  theme: PortfolioTheme;
  radius: string;
  children: ReactNode;
  variant?: "primary" | "outline";
  className?: string;
  colorPrimary?: string;
  colorBg?: string;
}) {
  const primary = colorPrimary || theme.colors.primary;
  const bg = colorBg || theme.colors.background;
  const isPrimary = variant === "primary";
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium ${radius} transition-all duration-200 hover:opacity-90 ${className}`}
      style={
        isPrimary
          ? { backgroundColor: primary, color: bg }
          : {
              border: `1px solid ${primary}50`,
              color: primary,
              backgroundColor: "transparent",
            }
      }
    >
      {children}
    </a>
  );
}
