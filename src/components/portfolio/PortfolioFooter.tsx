import type { ReactNode } from "react";
import type { PortfolioTheme } from "@/lib/portfolio-theme";
import type { PersonalInfo } from "@/lib/types";
import { AppIcon, type AppIconName } from "@/components/icons/AppIcons";
import { ThemedButton } from "@/components/portfolio/SectionShell";
import {
  getRadiusClass,
  resolveFooterColors,
  getFooterPaddingClass,
  getFooterAlignClass,
} from "@/lib/portfolio-theme";
import { SurfaceBackground } from "@/components/portfolio/SurfaceBackground";
import { inferFooterBackgroundMode, resolveMapEmbedUrl } from "@/lib/background-utils";

export default function PortfolioFooter({
  theme,
  personalInfo,
  t,
  contentWidthClass,
}: {
  theme: PortfolioTheme;
  personalInfo: PersonalInfo;
  t: (key: string) => string;
  contentWidthClass: string;
}) {
  if (!theme.features.showFooter) return null;
  const radius = getRadiusClass(theme.layout.borderRadius);
  const style = theme.features.footerStyle || "default";
  const colors = resolveFooterColors(theme);
  const footer = theme.footer ?? {};

  if (style === "minimal") {
    return (
      <FooterShell theme={theme} contentWidthClass={contentWidthClass} colors={colors}>
        <div className={`flex flex-wrap gap-4 ${getFooterAlignClass(theme.footer?.alignment).includes("center") ? "justify-center" : theme.footer?.alignment === "right" ? "justify-end" : "justify-start"}`}>
          <span style={{ color: colors.textMuted }}>© {new Date().getFullYear()} {personalInfo.name}</span>
          {personalInfo.preferredLocation && (
            <span className="inline-flex items-center gap-1.5" style={{ color: colors.textMuted }}>
              <AppIcon name="map-pin" size={14} style={{ color: colors.accent }} />
              {personalInfo.preferredLocation}
            </span>
          )}
          {personalInfo.linkedin && <FooterLink href={personalInfo.linkedin} icon="briefcase" color={colors.accent} />}
          {personalInfo.email && <FooterLink href={`mailto:${personalInfo.email}`} icon="mail" color={colors.accent} />}
        </div>
      </FooterShell>
    );
  }

  if (style === "cta") {
    return (
      <FooterShell theme={theme} contentWidthClass={contentWidthClass} colors={colors}>
        <div className={`flex flex-col gap-3 ${getFooterAlignClass(theme.footer?.alignment)}`}>
          <h3 className="text-2xl font-bold" style={{ color: colors.text }}>{theme.content.cta.headline}</h3>
          <p style={{ color: colors.textMuted }}>{theme.content.cta.subtext}</p>
          <ThemedButton
            href={theme.content.cta.buttonUrl || `mailto:${personalInfo.email}`}
            theme={theme}
            radius={radius}
            colorPrimary={colors.accent}
            colorBg={colors.background}
          >
            {theme.content.cta.buttonText}
          </ThemedButton>
        </div>
      </FooterShell>
    );
  }

  if (style === "rich") {
    return (
      <FooterShell theme={theme} contentWidthClass={contentWidthClass} colors={colors}>
        <div className="grid sm:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="font-semibold mb-2" style={{ color: colors.text }}>{personalInfo.name}</p>
            <p style={{ color: colors.textMuted }}>{personalInfo.bio?.slice(0, 120) || personalInfo.professionalSummary?.slice(0, 120)}</p>
          </div>
          <div>
            <p className="font-semibold mb-2" style={{ color: colors.text }}>Contact</p>
            {personalInfo.email && <p style={{ color: colors.textMuted }}>{personalInfo.email}</p>}
            {personalInfo.phone && <p style={{ color: colors.textMuted }}>{personalInfo.phone}</p>}
            {personalInfo.preferredLocation && (
              <p className="flex items-center gap-1.5 mt-1" style={{ color: colors.textMuted }}>
                <AppIcon name="map-pin" size={12} style={{ color: colors.accent }} />
                {personalInfo.preferredLocation}
              </p>
            )}
          </div>
          <div>
            <p className="font-semibold mb-2" style={{ color: colors.text }}>Links</p>
            {personalInfo.linkedin && <a href={personalInfo.linkedin} className="block hover:underline" style={{ color: colors.accent }}>LinkedIn</a>}
            {personalInfo.personalWebsite && <a href={personalInfo.personalWebsite} className="block hover:underline" style={{ color: colors.accent }}>Website</a>}
          </div>
        </div>
        <p className="text-center text-xs mt-8" style={{ color: colors.textMuted }}>
          © {new Date().getFullYear()} · {t("pf.builtWith")} <a href="/" style={{ color: colors.accent }}>Portfolia</a>
        </p>
      </FooterShell>
    );
  }

  if (style === "map") {
    const mapLocation = footer.mapLocation || personalInfo.preferredLocation || "";
    const mapUrl = resolveMapEmbedUrl(
      footer.mapEmbedUrl || theme.content.locationMapUrl,
      mapLocation,
      footer.mapZoom ?? 14
    );
    return (
      <FooterShell theme={theme} contentWidthClass={contentWidthClass} colors={colors}>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="font-semibold text-lg mb-3" style={{ color: colors.text }}>{personalInfo.name}</p>
            {mapLocation && (
              <p className="flex items-center gap-2 text-sm mb-2" style={{ color: colors.textMuted }}>
                <AppIcon name="map-pin" size={14} style={{ color: colors.accent }} />
                {mapLocation}
              </p>
            )}
            {personalInfo.email && <p className="text-sm" style={{ color: colors.accent }}>{personalInfo.email}</p>}
          </div>
          <div className={`min-h-[12rem] overflow-hidden ${radius}`} style={{ background: `${colors.accent}12` }}>
            {mapUrl ? (
              <iframe
                title="Location map"
                src={mapUrl}
                className="w-full h-full min-h-[12rem] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[12rem] gap-2 px-4 text-center">
                <AppIcon name="map-pin" size={48} style={{ color: colors.accent, opacity: 0.4 }} />
                <p className="text-xs" style={{ color: colors.textMuted }}>Add a location in Layout → Footer → Map location</p>
              </div>
            )}
          </div>
        </div>
      </FooterShell>
    );
  }

  return (
    <FooterShell theme={theme} contentWidthClass={contentWidthClass} colors={colors}>
      <div className={`flex flex-col gap-2 ${getFooterAlignClass(theme.footer?.alignment)}`}>
        {personalInfo.preferredLocation && (
          <p className="inline-flex items-center gap-1.5" style={{ color: colors.textMuted }}>
            <AppIcon name="map-pin" size={14} style={{ color: colors.accent }} />
            {personalInfo.preferredLocation}
          </p>
        )}
        <p style={{ color: colors.textMuted }}>
          {t("pf.builtWith")}{" "}
          <a href="/" style={{ color: colors.accent }}>Portfolia</a>
        </p>
      </div>
    </FooterShell>
  );
}

function FooterShell({
  theme,
  contentWidthClass,
  colors,
  children,
}: {
  theme: PortfolioTheme;
  contentWidthClass: string;
  colors: ReturnType<typeof resolveFooterColors>;
  children: ReactNode;
}) {
  const footer = theme.footer ?? {};
  const overlay = footer.overlayOpacity ?? 0.94;
  const padding = getFooterPaddingClass(footer.padding);
  const bgMode = inferFooterBackgroundMode(footer);
  const baseColor = colors.background;

  return (
    <footer className="relative w-full overflow-hidden border-t" style={{ borderColor: colors.border }}>
      <SurfaceBackground
        mode={bgMode}
        baseColor={baseColor}
        gradientFrom={colors.gradientFrom}
        gradientTo={colors.gradientTo}
        backgroundImage={footer.backgroundImage}
        pattern={footer.backgroundPattern || "dots"}
        patternColor={colors.accent}
        overlayOpacity={overlay}
        showGradientOverlay={footer.showGradient !== false}
      />
      <div className={`relative mx-auto px-6 ${contentWidthClass} ${padding} text-sm`} style={{ color: colors.text }}>
        {children}
      </div>
    </footer>
  );
}

function FooterLink({ href, icon, color }: { href: string; icon: AppIconName; color: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color }}>
      <AppIcon name={icon} size={16} />
    </a>
  );
}
