"use client";

import type { PortfolioTheme } from "@/lib/portfolio-theme";
import type { PersonalInfo } from "@/lib/types";
import { getThemeAnimationConfig } from "@/lib/theme-animation-config";
import { inferHeroBackgroundMode } from "@/lib/background-utils";
import { SurfaceBackground } from "@/components/portfolio/SurfaceBackground";
import { AppIcon } from "@/components/icons/AppIcons";
import { ThemedButton } from "@/components/portfolio/SectionShell";
import { HeroParticles, HeroWaves, HeroAurora, TypewriterName, HeroCard3D, HeroGlow } from "./HeroEffects";

interface HeroProps {
  theme: PortfolioTheme;
  personalInfo: PersonalInfo;
  photo?: string | false;
  radius: string;
  headingFont: string;
  cvDownloadUrl?: string;
  resumeUrl?: string;
  linkedInShare: string;
  t: (key: string) => string;
  skillBadges?: string[];
}

export default function PortfolioHero(props: HeroProps) {
  const { theme, personalInfo, photo, radius, headingFont, cvDownloadUrl, resumeUrl, linkedInShare, t, skillBadges } = props;
  const hero = theme.hero ?? {};
  const anim = getThemeAnimationConfig(theme.activeThemeId);
  const gradientFrom = hero.gradientFrom || theme.colors.primary;
  const gradientTo = hero.gradientTo || theme.colors.accent;
  const overlayOpacity = hero.overlayOpacity ?? 0.55;
  const style = theme.layout.heroStyle;
  const isSplit = style === "split" || style === "card3d";
  const particleCount = anim.level === "high" ? 60 : 40;

  const heroAlign =
    theme.layout.heroAlignment === "left" ? "text-left items-start"
      : theme.layout.heroAlignment === "right" ? "text-right items-end"
      : "text-center items-center";

  const bgMode = inferHeroBackgroundMode(hero);
  const heroBaseColor = hero.backgroundColor || theme.colors.background;

  const maxW = theme.layout.contentWidth === "narrow" ? "max-w-2xl" : theme.layout.contentWidth === "wide" ? "max-w-6xl" : "max-w-4xl";

  const wrapperClass = [
    anim.neonText ? "pf-neon-text" : "",
    anim.glitchName ? "pf-glitch" : "",
    anim.gradientText ? "pf-gradient-text" : "",
  ].filter(Boolean).join(" ");

  const nameContent =
    style === "animated" || theme.activeThemeId === "midnight-glass" ? (
      <TypewriterName name={personalInfo.name} theme={theme} />
    ) : (
      personalInfo.name
    );

  const titleContent = anim.typewriterTitle && personalInfo.currentPosition ? (
    <TypewriterName name={personalInfo.currentPosition} theme={theme} />
  ) : (
    personalInfo.currentPosition
  );

  const textBlock = (
    <div className={anim.splitEnter ? "pf-hero-split-text" : ""}>
      {theme.features.showAvailabilityBadge && theme.features.availableForWork && (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-4 pf-badge-pulse`}
          style={{ background: `${theme.colors.primary}25`, color: theme.colors.primary }}
        >
          Available for work
        </span>
      )}
      {anim.typewriterTitle && <span className="pf-online-dot" aria-hidden />}
      <h1 className={`pf-hero-name ${headingFont} font-bold mb-3 ${style === "minimal" ? "text-3xl" : "text-4xl sm:text-5xl"}`}>
        {nameContent}
      </h1>
      {anim.heroLine === "gold" && <div className="pf-gold-line" />}
      {personalInfo.currentPosition && (
        <p className="pf-hero-subtitle text-xl mb-2" style={{ color: theme.colors.primary }}>{titleContent}</p>
      )}
      <div className="pf-hero-meta flex flex-wrap gap-3 text-sm" style={{ color: theme.colors.textMuted, justifyContent: theme.layout.heroAlignment === "center" ? "center" : theme.layout.heroAlignment === "right" ? "flex-end" : "flex-start" }}>
        {personalInfo.preferredLocation && (
          <span className="inline-flex items-center gap-1">
            <AppIcon name="map-pin" size={14} style={{ color: theme.colors.primary }} />
            {personalInfo.preferredLocation}
          </span>
        )}
        {personalInfo.industry && <span>· {personalInfo.industry}</span>}
      </div>
      <div className="pf-hero-actions mt-6 flex flex-wrap gap-3" style={{ justifyContent: theme.layout.heroAlignment === "center" ? "center" : theme.layout.heroAlignment === "right" ? "flex-end" : "flex-start" }}>
        {theme.features.showSocialLinks && personalInfo.linkedin && (
          <SocialLink href={personalInfo.linkedin} theme={theme} radius={radius}>LinkedIn</SocialLink>
        )}
        {theme.features.showResumeInHero && resumeUrl && cvDownloadUrl && (
          <ThemedButton href={cvDownloadUrl} theme={theme} radius={radius} className="pf-btn-lift">
            <span className="inline-flex items-center gap-2"><AppIcon name="download" size={16} />{t("pf.downloadCv")}</span>
          </ThemedButton>
        )}
        <ThemedButton href={linkedInShare} theme={theme} radius={radius} className={anim.ctaPulse ? "pf-cta-pulse" : "pf-btn-lift"}>
          <span className="inline-flex items-center gap-2"><AppIcon name="external-link" size={16} />Share</span>
        </ThemedButton>
      </div>
      {skillBadges && skillBadges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {skillBadges.map((badge) => (
            <span key={badge} className={`pf-skill-tag px-3 py-1 text-xs font-medium border ${radius}`} style={{ borderColor: `${theme.colors.primary}40`, color: theme.colors.primary, backgroundColor: `${theme.colors.primary}15` }}>
              {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const photoEl = photo && (
    <div className={`shrink-0 ${anim.splitEnter ? "pf-hero-split-photo" : ""} ${anim.heroLine === "blue" ? "flex gap-4 items-start" : ""}`}>
      {anim.heroLine === "blue" && <div className="pf-blue-line hidden md:block" />}
      <img
        src={photo}
        alt={personalInfo.name}
        className={`object-cover ${anim.photoShimmer ? "pf-shimmer-photo" : ""} ${style === "split" || style === "card3d" ? `h-48 w-48 md:h-56 md:w-56 ${radius}` : "h-28 w-28 rounded-full mx-auto mb-6"}`}
        style={{ boxShadow: `0 0 0 4px ${theme.colors.primary}40`, border: theme.activeThemeId === "light-clean" ? `2px solid ${theme.colors.textMuted}30` : undefined }}
      />
    </div>
  );

  const layoutClass = isSplit
    ? "flex flex-col md:flex-row gap-10 items-center md:items-start py-16"
    : `flex flex-col ${heroAlign} ${style === "minimal" ? "py-10" : "py-20"}`;

  return (
    <section className={`relative overflow-hidden border-b ${wrapperClass}`} style={{ borderColor: `${theme.colors.textMuted}20` }}>
      {anim.heroGlow && <HeroGlow type={anim.heroGlow} />}
      {hero.videoBackgroundUrl && style === "video" && (
        <>
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" src={hero.videoBackgroundUrl} />
          <div className="absolute inset-0" style={{ backgroundColor: heroBaseColor, opacity: overlayOpacity }} />
        </>
      )}
      {!(hero.videoBackgroundUrl && style === "video") && (
        <SurfaceBackground
          mode={bgMode}
          baseColor={heroBaseColor}
          gradientFrom={gradientFrom}
          gradientTo={gradientTo}
          backgroundImage={hero.backgroundImage}
          pattern={hero.backgroundPattern || "dots"}
          patternColor={gradientFrom}
          overlayOpacity={overlayOpacity}
          showGradientOverlay={theme.features.showGradient || bgMode === "gradient"}
        />
      )}
      {(hero.particles || style === "animated") && <HeroParticles theme={theme} count={particleCount} />}
      {(hero.waves || theme.activeThemeId === "deep-ocean") && !hero.videoBackgroundUrl && <HeroWaves theme={theme} />}
      {(hero.aurora || hero.glassEffect || theme.activeThemeId === "aurora-dark") && (
        <HeroAurora theme={theme} multi={theme.activeThemeId === "aurora-dark"} />
      )}
      {hero.glassEffect && <div className="absolute inset-0 backdrop-blur-sm" style={{ background: `${theme.colors.surface}15` }} />}

      <div className={`relative mx-auto px-6 ${maxW} ${layoutClass}`}>
        {style === "card3d" ? (
          <div className="w-full flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">{textBlock}</div>
            {photo && (
              <HeroCard3D theme={theme} radius={radius}>
                <img src={photo} alt={personalInfo.name} className={`w-full max-w-xs object-cover ${radius}`} />
              </HeroCard3D>
            )}
          </div>
        ) : isSplit ? (
          <>
            {theme.layout.heroAlignment !== "right" && photoEl}
            <div className="flex-1 w-full">{textBlock}</div>
            {theme.layout.heroAlignment === "right" && photoEl}
          </>
        ) : (
          <>
            {photoEl}
            <div className="w-full">{textBlock}</div>
          </>
        )}
      </div>
    </section>
  );
}

function SocialLink({ href, theme, radius, children }: { href: string; theme: PortfolioTheme; radius: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex px-4 py-1.5 text-sm border pf-btn-lift ${radius}`} style={{ borderColor: `${theme.colors.textMuted}30`, backgroundColor: `${theme.colors.surface}80`, color: theme.colors.textMuted }}>
      {children}
    </a>
  );
}
