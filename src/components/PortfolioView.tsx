import type { ReactNode } from "react";
import type { PortfolioData } from "@/lib/types";
import type { PortfolioTheme, SectionId, SectionInstance, ProfileI18n } from "@/lib/portfolio-theme";
import {
  getContentMaxWidth,
  getSpacingClass,
  getRadiusClass,
  getHeadingFontClass,
  themeToCssVars,
  resolveSectionOrder,
  getSectionTitleForInstance,
  getSectionStyleForInstance,
} from "@/lib/portfolio-theme";
import { SectionShell, ThemedButton } from "@/components/portfolio/SectionShell";
import ContactFormSection from "@/components/portfolio/ContactFormSection";
import TestimonialsSection from "@/components/portfolio/TestimonialsSection";
import GallerySection from "@/components/portfolio/GallerySection";
import VideoSection from "@/components/portfolio/VideoSection";
import CustomHtmlSection from "@/components/portfolio/CustomHtmlSection";
import PortfolioNavbar from "@/components/portfolio/PortfolioNavbar";
import BookingWidget from "@/components/portfolio/BookingWidget";
import PortfolioHero from "@/components/portfolio/heroes/PortfolioHero";
import PortfolioFooter from "@/components/portfolio/PortfolioFooter";
import { ScrollProgressBar, LiveChatWidget, VisitorsCounter } from "@/components/portfolio/widgets/PortfolioWidgets";
import { ThemeOverlays } from "@/components/portfolio/animations/ThemeOverlays";
import { getThemeAnimationConfig } from "@/lib/theme-animation-config";
import CountUp from "@/components/portfolio/animations/CountUp";
import {
  TimelineSection,
  TechStackSection,
  CaseStudySection,
  ServicesSection,
  BlogSection,
  OpenSourceSection,
  AwardsSection,
  LanguagesSection,
} from "@/components/portfolio/sections/ExtendedSections";
import { AppIcon, type AppIconName } from "@/components/icons/AppIcons";
import type { PersonalInfo, Project, Skill } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import {
  getInstanceCustomHtml,
  getInstanceGallery,
  getInstanceTestimonials,
  getInstanceVideoUrl,
} from "@/lib/platform-data";
import { resolveMapEmbedUrl } from "@/lib/background-utils";

interface PortfolioViewProps {
  data: PortfolioData;
  slug: string;
  locale: Locale;
  t: (key: string) => string;
  sectionLabel: (locale: Locale, id: string) => string;
  pageSlug?: string;
  sectionOrder?: string[];
}

function getLocalizedProfile(
  personalInfo: PersonalInfo,
  theme: PortfolioTheme,
  locale: Locale
): PersonalInfo {
  const i18n: ProfileI18n | undefined = theme.profileI18n?.[locale];
  if (!i18n || locale === "en") return personalInfo;
  return {
    ...personalInfo,
    bio: i18n.bio || personalInfo.bio,
    professionalSummary: i18n.professionalSummary || personalInfo.professionalSummary,
    skillsOverview: i18n.skillsOverview || personalInfo.skillsOverview,
    currentPosition: i18n.currentPosition || personalInfo.currentPosition,
  };
}

function getSectionTitle(
  instance: SectionInstance,
  theme: PortfolioTheme,
  locale: Locale,
  sectionLabelFn: (locale: Locale, id: string) => string
): string {
  return getSectionTitleForInstance(instance, theme.sections.titles, sectionLabelFn, locale);
}

export default function PortfolioView({ data, slug, locale, t, sectionLabel, pageSlug = "", sectionOrder }: PortfolioViewProps) {
  const { projects, skills, theme, platform } = data;
  const personalInfo = getLocalizedProfile(data.personalInfo, theme, locale);
  const cssVars = themeToCssVars(theme);
  const maxW = getContentMaxWidth(theme.layout.contentWidth);
  const spacing = getSpacingClass(theme.layout.spacing);
  const radius = getRadiusClass(theme.layout.borderRadius);
  const headingFont = getHeadingFontClass(theme.typography.headingFont);
  const photo =
    theme.features.showHeroPhoto &&
    (personalInfo.photoUrl || personalInfo.profilePhoto?.[0]?.url);
  const resumeUrl = personalInfo.resumeUrl || personalInfo.resume?.[0]?.url;
  const cvDownloadUrl = slug ? `/api/track/cv/${slug}` : resumeUrl;
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL || ""}/portfolio/${slug}`)}`;
  const activeSections = resolveSectionOrder(theme.sections.order, sectionOrder);
  const pages = platform?.pages || [];
  const animConfig = getThemeAnimationConfig(theme.activeThemeId);

  return (
    <div
      className="pf-root min-h-screen"
      data-theme={theme.activeThemeId || "violet-pro"}
      style={{ ...cssVars, backgroundColor: theme.colors.background, color: theme.colors.text }}
    >
      <ThemeOverlays config={animConfig} theme={theme} />
      {theme.features.showScrollProgress && <ScrollProgressBar theme={theme} />}
      {pages.length > 1 && (
        <PortfolioNavbar slug={slug} theme={theme} pages={pages} currentPageSlug={pageSlug} />
      )}

      <PortfolioHero
        theme={theme}
        personalInfo={personalInfo}
        photo={photo || undefined}
        radius={radius}
        headingFont={headingFont}
        cvDownloadUrl={cvDownloadUrl}
        resumeUrl={resumeUrl}
        linkedInShare={linkedInShare}
        t={t}
        skillBadges={platform?.skillBadges}
      />

      <div className={`mx-auto px-6 ${maxW} ${spacing}`}>
        {activeSections.map((instance) =>
          renderSection(instance, {
            personalInfo,
            projects,
            skills,
            theme,
            platform,
            headingFont,
            radius,
            resumeUrl,
            cvDownloadUrl,
            slug,
            locale,
            t,
            sectionLabel,
          })
        )}
        {platform?.booking?.enabled && (
          <section className="py-8">
            <BookingWidget slug={slug} theme={theme} />
          </section>
        )}
      </div>

      {theme.features.showFooter && (
        <PortfolioFooter theme={theme} personalInfo={personalInfo} t={t} contentWidthClass={maxW} />
      )}

      <LiveChatWidget theme={theme} />
      <VisitorsCounter slug={slug} theme={theme} />
    </div>
  );
}

function renderSection(
  instance: SectionInstance,
  ctx: {
    personalInfo: PersonalInfo;
    projects: Project[];
    skills: Skill[];
    theme: PortfolioTheme;
    platform?: PortfolioData["platform"];
    headingFont: string;
    radius: string;
    resumeUrl?: string;
    cvDownloadUrl?: string;
    slug: string;
    locale: Locale;
    t: (key: string) => string;
    sectionLabel: (locale: Locale, id: string) => string;
  }
) {
  const { personalInfo, projects, skills, theme, platform, headingFont, radius, resumeUrl, cvDownloadUrl, slug, locale, t, sectionLabel } = ctx;
  const sectionId = instance.type;
  const instanceId = instance.id;

  const style = getSectionStyleForInstance(instance, theme.sectionStyles);
  const title = getSectionTitle(instance, theme, locale, sectionLabel);

  switch (sectionId) {
    case "about": {
      const summary = theme.content.aboutSummary || personalInfo.professionalSummary;
      const bio = theme.content.aboutBio || personalInfo.bio;
      const displayBio = bio && bio.trim() !== (summary || "").trim() ? bio : undefined;
      if (!summary && !displayBio) return null;
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          {summary && <p className="text-lg leading-relaxed mb-4">{summary}</p>}
          {displayBio && (
            <p className="leading-relaxed whitespace-pre-line" style={{ color: theme.colors.textMuted }}>
              {displayBio}
            </p>
          )}
        </SectionShell>
      );
    }

    case "experience":
      if (!theme.content.experience.length) return null;
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <ExperienceBlock items={theme.content.experience} theme={theme} radius={radius} layout={style.layout || "timeline"} />
        </SectionShell>
      );

    case "stats":
      if (!theme.content.stats.length) return null;
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <StatsBlock items={theme.content.stats} theme={theme} radius={radius} layout={style.layout || "row"} />
        </SectionShell>
      );

    case "skills":
      if (!skills.length) return null;
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          {(theme.content.skillsOverview || personalInfo.skillsOverview) && (
            <p className="mb-6" style={{ color: theme.colors.textMuted }}>
              {theme.content.skillsOverview || personalInfo.skillsOverview}
            </p>
          )}
          <SkillsBlock skills={skills} theme={theme} radius={radius} />
        </SectionShell>
      );

    case "projects":
      if (!projects.length) return null;
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <ProjectsBlock projects={projects} theme={theme} radius={radius} />
        </SectionShell>
      );

    case "contact":
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <ContactBlock personalInfo={personalInfo} theme={theme} radius={radius} note={theme.content.contactNote} layout={style.layout || "cards"} />
        </SectionShell>
      );

    case "resume":
      if (!resumeUrl) return null;
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <div className={`flex flex-col gap-4 ${style.alignment === "center" ? "items-center" : style.alignment === "right" ? "items-end" : "items-start"}`}>
            <p style={{ color: theme.colors.textMuted }}>{theme.content.resumeText}</p>
            <ThemedButton href={cvDownloadUrl || resumeUrl!} theme={theme} radius={radius}>
              <span className="inline-flex items-center gap-2">
                <AppIcon name="download" size={16} />
                {t("pf.downloadResume")}
              </span>
            </ThemedButton>
          </div>
        </SectionShell>
      );

    case "contactform":
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <ContactFormSection
            slug={slug}
            theme={theme}
            note={theme.content.contactFormNote}
            t={t}
            radius={radius}
          />
        </SectionShell>
      );

    case "cta":
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <div className={`flex flex-col gap-3 ${style.alignment === "center" ? "items-center text-center" : style.alignment === "right" ? "items-end text-right" : "items-start"}`}>
            <h3 className={`${headingFont} text-xl font-semibold`}>{theme.content.cta.headline}</h3>
            <p style={{ color: theme.colors.textMuted }}>{theme.content.cta.subtext}</p>
            <ThemedButton
              href={theme.content.cta.buttonUrl || `mailto:${personalInfo.email}`}
              theme={theme}
              radius={radius}
            >
              {theme.content.cta.buttonText}
            </ThemedButton>
          </div>
        </SectionShell>
      );

    case "location": {
      const mapLocation = personalInfo.preferredLocation || "";
      const mapUrl = resolveMapEmbedUrl(theme.content.locationMapUrl, mapLocation);
      if (!mapLocation && !mapUrl) return null;
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <LocationBlock
            personalInfo={personalInfo}
            theme={theme}
            note={theme.content.locationNote}
            mapUrl={mapUrl}
            radius={radius}
            layout={style.layout || "map"}
            alignment={style.alignment}
          />
        </SectionShell>
      );
    }

    case "testimonials": {
      const items = platform
        ? getInstanceTestimonials(platform, instanceId, sectionId, theme.sections.order)
        : [];
      if (!items.length) return null;
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <TestimonialsSection items={items} theme={theme} layout={style.layout} />
        </SectionShell>
      );
    }

    case "gallery": {
      const items = platform ? getInstanceGallery(platform, instanceId, sectionId, theme.sections.order) : [];
      if (!items.length) return null;
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <GallerySection items={items} theme={theme} columns={style.columns} mediaHeight={style.mediaHeight} />
        </SectionShell>
      );
    }

    case "video": {
      const legacyUrl = platform ? getInstanceVideoUrl(platform, instanceId, sectionId, theme.sections.order) : "";
      if (!theme.content.videos?.length && !legacyUrl) return null;
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <VideoSection
            videos={theme.content.videos}
            legacyUrl={legacyUrl}
            theme={theme}
            mediaHeight={style.mediaHeight}
          />
        </SectionShell>
      );
    }

    case "customHtml": {
      const html = platform
        ? getInstanceCustomHtml(platform, instanceId, sectionId, theme.sections.order)
        : "";
      if (!html.trim()) return null;
      return (
        <section key={instanceId} id={instanceId} className="w-full min-w-0 overflow-x-hidden">
          <CustomHtmlSection html={html} theme={theme} style={style} />
        </section>
      );
    }

    case "timeline":
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <TimelineSection content={theme.content} theme={theme} />
        </SectionShell>
      );

    case "techStack":
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <TechStackSection content={theme.content} theme={theme} />
        </SectionShell>
      );

    case "caseStudy":
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <CaseStudySection content={theme.content} theme={theme} />
        </SectionShell>
      );

    case "services":
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <ServicesSection content={theme.content} theme={theme} columns={style.columns} />
        </SectionShell>
      );

    case "blog":
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <BlogSection content={theme.content} theme={theme} />
        </SectionShell>
      );

    case "openSource":
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <OpenSourceSection content={theme.content} theme={theme} />
        </SectionShell>
      );

    case "awards":
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <AwardsSection content={theme.content} theme={theme} />
        </SectionShell>
      );

    case "languages":
      return (
        <SectionShell key={instanceId} id={instanceId} theme={theme} style={style} headingFont={headingFont} title={title}>
          <LanguagesSection content={theme.content} theme={theme} />
        </SectionShell>
      );

    default:
      return null;
  }
}

function SocialLink({ href, theme, radius, children }: { href: string; theme: PortfolioTheme; radius: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={`inline-flex px-4 py-1.5 text-sm border ${radius}`}
      style={{
        borderColor: `${theme.colors.textMuted}30`,
        backgroundColor: `${theme.colors.surface}80`,
        color: theme.colors.textMuted,
      }}
    >
      {children}
    </a>
  );
}

function ExperienceBlock({
  items,
  theme,
  radius,
  layout,
}: {
  items: PortfolioTheme["content"]["experience"];
  theme: PortfolioTheme;
  radius: string;
  layout: string;
}) {
  if (layout === "cards") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className={`border p-5 ${radius}`} style={{ borderColor: `${theme.colors.textMuted}20`, backgroundColor: `${theme.colors.surface}60` }}>
            <h3 className="font-semibold">{item.role}</h3>
            <p className="text-sm mt-1" style={{ color: theme.colors.primary }}>{item.company} · {item.period}</p>
            <p className="text-sm mt-2" style={{ color: theme.colors.textMuted }}>{item.description}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {items.map((item, idx) => (
        <div key={item.id} className="flex gap-4 pb-8 last:pb-0">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: theme.colors.primary }} />
            {idx < items.length - 1 && (
              <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: `${theme.colors.primary}40` }} />
            )}
          </div>
          <div className="flex-1 pb-2">
            <h3 className="font-semibold text-lg">{item.role}</h3>
            <p className="text-sm" style={{ color: theme.colors.primary }}>
              {item.company} · {item.period}
            </p>
            <p className="mt-2 leading-relaxed" style={{ color: theme.colors.textMuted }}>
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsBlock({
  items,
  theme,
  radius,
  layout,
}: {
  items: PortfolioTheme["content"]["stats"];
  theme: PortfolioTheme;
  radius: string;
  layout: string;
}) {
  const gridClass = layout === "grid" ? "grid grid-cols-2 sm:grid-cols-4 gap-4" : "flex flex-wrap justify-center gap-6 sm:gap-10";
  return (
    <div className={gridClass}>
      {items.map((stat) => (
        <div key={stat.id} className={`text-center px-4 py-3 ${layout === "grid" ? `border ${radius}` : ""}`} style={layout === "grid" ? { borderColor: `${theme.colors.textMuted}20` } : undefined}>
          <p className="text-3xl font-bold" style={{ color: theme.colors.primary }}>
            <CountUp value={stat.value} glow />
          </p>
          <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function SkillsBlock({ skills, theme, radius }: { skills: Skill[]; theme: PortfolioTheme; radius: string }) {
  const layout = theme.layout.skillsLayout;
  if (layout === "tags") {
    return (
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill.id} className={`pf-skill-tag px-4 py-2 text-sm font-medium border ${radius}`} style={{ backgroundColor: `${theme.colors.primary}20`, color: theme.colors.primary, borderColor: `${theme.colors.primary}30` }}>
            {skill.skillName}
            {theme.features.showSkillLevels && skill.proficiencyLevel && (
              <span className="opacity-60 ml-1">· {skill.proficiencyLevel}</span>
            )}
          </span>
        ))}
      </div>
    );
  }
  if (layout === "list") {
    return (
      <div className="space-y-3">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} theme={theme} radius={radius} compact />
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} theme={theme} radius={radius} />
      ))}
    </div>
  );
}

function skillLevelPercent(level?: string): number {
  const map: Record<string, number> = { beginner: 25, intermediate: 50, advanced: 75, expert: 95 };
  if (!level) return 70;
  return map[level.toLowerCase()] ?? 70;
}

function SkillCard({ skill, theme, radius, compact }: { skill: Skill; theme: PortfolioTheme; radius: string; compact?: boolean }) {
  const pct = skillLevelPercent(skill.proficiencyLevel);
  return (
    <div className={`pf-card-hover border p-5 ${radius}`} style={{ borderColor: `${theme.colors.textMuted}20`, backgroundColor: `${theme.colors.surface}80` }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold">{skill.skillName}</h3>
        {theme.features.showSkillLevels && skill.proficiencyLevel && (
          <span className="shrink-0 px-2.5 py-0.5 text-xs rounded-full" style={{ backgroundColor: `${theme.colors.primary}25`, color: theme.colors.primary }}>
            {skill.proficiencyLevel}
          </span>
        )}
      </div>
      {theme.features.showSkillLevels && !compact && (
        <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: `${theme.colors.textMuted}20`, ["--pf-skill-width" as string]: `${pct}%` }}>
          <div className="pf-skill-fill h-full rounded-full" style={{ background: theme.colors.primary }} />
        </div>
      )}
      {!compact && skill.skillDescription && (
        <p className="text-sm" style={{ color: theme.colors.textMuted }}>{skill.skillDescription}</p>
      )}
    </div>
  );
}

function ProjectsBlock({ projects, theme, radius }: { projects: Project[]; theme: PortfolioTheme; radius: string }) {
  const layout = theme.layout.projectsLayout;
  if (layout === "grid") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} theme={theme} radius={radius} compact />
        ))}
      </div>
    );
  }
  if (layout === "cards") {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} theme={theme} radius={radius} card />
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} theme={theme} radius={radius} />
      ))}
    </div>
  );
}

function ProjectCard({ project, theme, radius, compact, card }: { project: Project; theme: PortfolioTheme; radius: string; compact?: boolean; card?: boolean }) {
  const image = theme.features.showProjectImages && (project.imageUrl || project.projectImages?.[0]?.url);
  return (
    <article className={`pf-card-hover border overflow-hidden ${radius} ${!compact && !card ? "pf-list-hover" : ""}`} style={{ borderColor: `${theme.colors.textMuted}20`, backgroundColor: `${theme.colors.surface}80` }}>
      {image && <img src={image} alt={project.projectName} className={`w-full object-cover ${card ? "h-40" : compact ? "h-36" : "h-48"}`} />}
      <div className={compact || card ? "p-4" : "p-6"}>
        <h3 className={`font-semibold ${card ? "text-base" : "text-xl"}`}>{project.projectName}</h3>
        {project.description && (
          <p className={`mt-2 leading-relaxed ${compact || card ? "text-sm line-clamp-3" : ""}`} style={{ color: theme.colors.textMuted }}>
            {project.description}
          </p>
        )}
        {project.technologiesUsed && !card && (
          <p className="text-sm mt-2" style={{ color: theme.colors.primary }}>{project.technologiesUsed}</p>
        )}
      </div>
    </article>
  );
}

function LocationBlock({
  personalInfo,
  theme,
  note,
  mapUrl,
  radius,
  layout,
  alignment,
}: {
  personalInfo: PersonalInfo;
  theme: PortfolioTheme;
  note: string;
  mapUrl: string;
  radius: string;
  layout: string;
  alignment: string;
}) {
  const mapsLink = personalInfo.preferredLocation
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(personalInfo.preferredLocation)}`
    : undefined;
  const alignClass =
    alignment === "center" ? "items-center text-center" : alignment === "right" ? "items-end text-right" : "items-start";

  if (layout === "minimal") {
    return (
      <div className={`flex flex-col gap-3 ${alignClass}`}>
        {note && <p style={{ color: theme.colors.textMuted }}>{note}</p>}
        {personalInfo.preferredLocation && (
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 border ${radius}`}
            style={{ borderColor: `${theme.colors.textMuted}30`, color: theme.colors.primary }}
          >
            <AppIcon name="map-pin" size={16} />
            {personalInfo.preferredLocation}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {note && <p style={{ color: theme.colors.textMuted }}>{note}</p>}
      <div className={`grid gap-0 overflow-hidden border ${radius} ${layout === "split" ? "md:grid-cols-2" : "grid-cols-1"}`} style={{ borderColor: `${theme.colors.textMuted}20` }}>
        <div className="p-6" style={{ backgroundColor: `${theme.colors.surface}80` }}>
          {personalInfo.preferredLocation ? (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg font-medium hover:underline"
              style={{ color: theme.colors.text }}
            >
              <AppIcon name="map-pin" size={18} style={{ color: theme.colors.primary }} />
              {personalInfo.preferredLocation}
            </a>
          ) : (
            <p style={{ color: theme.colors.textMuted }}>Add your location in Profile settings.</p>
          )}
        </div>
        {(mapUrl || layout === "map") && (
          <div className="min-h-[14rem] flex items-center justify-center" style={{ background: `${theme.colors.primary}08` }}>
            {mapUrl ? (
              <iframe
                title="Location map"
                src={mapUrl}
                className="w-full h-full min-h-[14rem] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <AppIcon name="map-pin" size={40} style={{ color: theme.colors.primary, opacity: 0.35 }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ContactBlock({
  personalInfo,
  theme,
  radius,
  note,
  layout,
}: {
  personalInfo: PersonalInfo;
  theme: PortfolioTheme;
  radius: string;
  note: string;
  layout: string;
}) {
  const items = [
    personalInfo.email && { icon: "mail" as const, label: "Email", value: personalInfo.email, href: `mailto:${personalInfo.email}` },
    personalInfo.phone && { icon: "phone" as const, label: "Phone", value: personalInfo.phone, href: `tel:${personalInfo.phone}` },
    personalInfo.preferredLocation && { icon: "map-pin" as const, label: "Location", value: personalInfo.preferredLocation },
    personalInfo.linkedin && { icon: "briefcase" as const, label: "LinkedIn", value: "View profile", href: personalInfo.linkedin },
  ].filter(Boolean) as { icon: AppIconName; label: string; value: string; href?: string }[];

  if (layout === "inline") {
    return (
      <div>
        {note && <p className="mb-4" style={{ color: theme.colors.textMuted }}>{note}</p>}
        <div className="flex flex-wrap gap-4 justify-center">
          {items.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5 text-sm" style={{ color: theme.colors.textMuted }}>
              <AppIcon name={item.icon} size={14} style={{ color: theme.colors.primary }} />
              {item.href ? <a href={item.href} style={{ color: theme.colors.primary }}>{item.value}</a> : item.value}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {note && <p className="mb-6 text-center" style={{ color: theme.colors.textMuted }}>{note}</p>}
      <div className={`grid gap-4 ${layout === "minimal" ? "grid-cols-1 max-w-md mx-auto" : "sm:grid-cols-2"}`}>
        {items.map((item) => (
          <div key={item.label} className={`border p-4 ${radius}`} style={{ borderColor: `${theme.colors.textMuted}20`, backgroundColor: `${theme.colors.surface}60` }}>
            <p className="text-xs uppercase tracking-wide mb-1 flex items-center gap-1.5" style={{ color: theme.colors.textMuted }}>
              <AppIcon name={item.icon} size={12} style={{ color: theme.colors.primary }} />
              {item.label}
            </p>
            {item.href ? (
              <a href={item.href} className="font-medium hover:underline" style={{ color: theme.colors.primary }}>{item.value}</a>
            ) : (
              <p className="font-medium">{item.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
