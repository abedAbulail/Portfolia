import type { ReactNode } from "react";
import type { PortfolioData } from "@/lib/types";
import type { PortfolioTheme, SectionId, ProfileI18n } from "@/lib/portfolio-theme";
import {
  getContentMaxWidth,
  getSpacingClass,
  getRadiusClass,
  getHeadingFontClass,
  themeToCssVars,
} from "@/lib/portfolio-theme";
import { SectionShell, ThemedButton } from "@/components/portfolio/SectionShell";
import ContactFormSection from "@/components/portfolio/ContactFormSection";
import { AppIcon, type AppIconName } from "@/components/icons/AppIcons";
import type { PersonalInfo, Project, Skill } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

interface PortfolioViewProps {
  data: PortfolioData;
  slug: string;
  locale: Locale;
  t: (key: string) => string;
  sectionLabel: (locale: Locale, id: string) => string;
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
  id: SectionId,
  theme: PortfolioTheme,
  locale: Locale,
  sectionLabelFn: (locale: Locale, id: string) => string
): string {
  return theme.sections.titles[id] || sectionLabelFn(locale, id);
}

export default function PortfolioView({ data, slug, locale, t, sectionLabel }: PortfolioViewProps) {
  const { projects, skills, theme } = data;
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

  const hero = theme.hero ?? {};
  const gradientFrom = hero.gradientFrom || theme.colors.primary;
  const gradientTo = hero.gradientTo || theme.colors.accent;
  const overlayOpacity = hero.overlayOpacity ?? 0.55;

  const heroAlign =
    theme.layout.heroAlignment === "left"
      ? "text-left items-start"
      : theme.layout.heroAlignment === "right"
        ? "text-right items-end"
        : "text-center items-center";

  return (
    <div
      className="min-h-screen"
      style={{ ...cssVars, backgroundColor: theme.colors.background, color: theme.colors.text }}
    >
      {/* Hero */}
      <section
        className="relative overflow-hidden border-b"
        style={{ borderColor: `${theme.colors.textMuted}20` }}
      >
        {hero.backgroundImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${hero.backgroundImage})` }}
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: theme.colors.background, opacity: overlayOpacity }}
            />
          </>
        )}
        {(theme.features.showGradient || hero.gradientFrom || hero.gradientTo) && (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${gradientFrom}${hero.backgroundImage ? "cc" : "30"} 0%, transparent 50%, ${gradientTo}${hero.backgroundImage ? "99" : "15"} 100%)`,
            }}
          />
        )}
        <div
          className={`relative mx-auto px-6 ${maxW} ${
            theme.layout.heroStyle === "split"
              ? "flex flex-col md:flex-row gap-10 items-center md:items-start py-16"
              : `flex flex-col ${heroAlign} ${theme.layout.heroStyle === "minimal" ? "py-10" : "py-20"}`
          }`}
        >
          {photo && theme.layout.heroStyle !== "minimal" && (
            <img
              src={photo}
              alt={personalInfo.name}
              className={`object-cover shrink-0 ${
                theme.layout.heroStyle === "split"
                  ? `h-40 w-40 md:h-48 md:w-48 ${radius}`
                  : "h-28 w-28 rounded-full mx-auto mb-6"
              }`}
              style={{ boxShadow: `0 0 0 4px ${theme.colors.primary}40` }}
            />
          )}
          <div className={theme.layout.heroStyle === "split" ? "flex-1" : "w-full"}>
            <h1
              className={`${headingFont} font-bold mb-3 ${
                theme.layout.heroStyle === "minimal" ? "text-3xl" : "text-4xl sm:text-5xl"
              }`}
            >
              {personalInfo.name}
            </h1>
            {personalInfo.currentPosition && (
              <p className="text-xl mb-2" style={{ color: theme.colors.primary }}>
                {personalInfo.currentPosition}
              </p>
            )}
            <div
              className="flex flex-wrap gap-3 text-sm"
              style={{
                color: theme.colors.textMuted,
                justifyContent:
                  theme.layout.heroAlignment === "center"
                    ? "center"
                    : theme.layout.heroAlignment === "right"
                      ? "flex-end"
                      : "flex-start",
              }}
            >
              {personalInfo.preferredLocation && (
                <span className="inline-flex items-center gap-1">
                  <AppIcon name="map-pin" size={14} style={{ color: theme.colors.primary }} />
                  {personalInfo.preferredLocation}
                </span>
              )}
              {personalInfo.industry && <span>· {personalInfo.industry}</span>}
            </div>
            <div
              className="mt-6 flex flex-wrap gap-3"
              style={{
                justifyContent:
                  theme.layout.heroAlignment === "center"
                    ? "center"
                    : theme.layout.heroAlignment === "right"
                      ? "flex-end"
                      : "flex-start",
              }}
            >
              {theme.features.showSocialLinks && personalInfo.linkedin && (
                <SocialLink href={personalInfo.linkedin} theme={theme} radius={radius}>
                  LinkedIn
                </SocialLink>
              )}
              {theme.features.showSocialLinks && personalInfo.personalWebsite && (
                <SocialLink href={personalInfo.personalWebsite} theme={theme} radius={radius}>
                  Website
                </SocialLink>
              )}
              {theme.features.showSocialLinks && personalInfo.email && (
                <SocialLink href={`mailto:${personalInfo.email}`} theme={theme} radius={radius}>
                  Email
                </SocialLink>
              )}
              {theme.features.showResumeInHero && resumeUrl && cvDownloadUrl && (
                <ThemedButton href={cvDownloadUrl} theme={theme} radius={radius}>
                  <span className="inline-flex items-center gap-2">
                    <AppIcon name="download" size={16} />
                    {t("pf.downloadCv")}
                  </span>
                </ThemedButton>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={`mx-auto px-6 ${maxW} ${spacing}`}>
        {theme.sections.order.map((sectionId) =>
          renderSection(sectionId, {
            personalInfo,
            projects,
            skills,
            theme,
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
      </div>

      {theme.features.showFooter && (
        <footer
          className="border-t py-8 text-center text-sm"
          style={{ borderColor: `${theme.colors.textMuted}20`, color: theme.colors.textMuted }}
        >
          {t("pf.builtWith")}{" "}
          <a href="/" style={{ color: theme.colors.primary }}>
            Portfolia
          </a>
        </footer>
      )}
    </div>
  );
}

function renderSection(
  sectionId: SectionId,
  ctx: {
    personalInfo: PersonalInfo;
    projects: Project[];
    skills: Skill[];
    theme: PortfolioTheme;
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
  const { personalInfo, projects, skills, theme, headingFont, radius, resumeUrl, cvDownloadUrl, slug, locale, t, sectionLabel } = ctx;

  const style = theme.sectionStyles[sectionId];
  const title = getSectionTitle(sectionId, theme, locale, sectionLabel);

  switch (sectionId) {
    case "about":
      if (!personalInfo.bio && !personalInfo.professionalSummary) return null;
      return (
        <SectionShell key="about" id="about" theme={theme} style={style} headingFont={headingFont} title={title}>
          {personalInfo.professionalSummary && (
            <p className="text-lg leading-relaxed mb-4">{personalInfo.professionalSummary}</p>
          )}
          {personalInfo.bio && (
            <p className="leading-relaxed whitespace-pre-line" style={{ color: theme.colors.textMuted }}>
              {personalInfo.bio}
            </p>
          )}
        </SectionShell>
      );

    case "experience":
      if (!theme.content.experience.length) return null;
      return (
        <SectionShell key="experience" id="experience" theme={theme} style={style} headingFont={headingFont} title={title}>
          <ExperienceBlock items={theme.content.experience} theme={theme} radius={radius} layout={style.layout || "timeline"} />
        </SectionShell>
      );

    case "stats":
      if (!theme.content.stats.length) return null;
      return (
        <SectionShell key="stats" id="stats" theme={theme} style={style} headingFont={headingFont} title={title}>
          <StatsBlock items={theme.content.stats} theme={theme} radius={radius} layout={style.layout || "row"} />
        </SectionShell>
      );

    case "skills":
      if (!skills.length) return null;
      return (
        <SectionShell key="skills" id="skills" theme={theme} style={style} headingFont={headingFont} title={title}>
          {personalInfo.skillsOverview && (
            <p className="mb-6" style={{ color: theme.colors.textMuted }}>
              {personalInfo.skillsOverview}
            </p>
          )}
          <SkillsBlock skills={skills} theme={theme} radius={radius} />
        </SectionShell>
      );

    case "projects":
      if (!projects.length) return null;
      return (
        <SectionShell key="projects" id="projects" theme={theme} style={style} headingFont={headingFont} title={title}>
          <ProjectsBlock projects={projects} theme={theme} radius={radius} />
        </SectionShell>
      );

    case "contact":
      return (
        <SectionShell key="contact" id="contact" theme={theme} style={style} headingFont={headingFont} title={title}>
          <ContactBlock personalInfo={personalInfo} theme={theme} radius={radius} note={theme.content.contactNote} layout={style.layout || "cards"} />
        </SectionShell>
      );

    case "resume":
      if (!resumeUrl) return null;
      return (
        <SectionShell key="resume" id="resume" theme={theme} style={style} headingFont={headingFont} title={title}>
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
        <SectionShell key="contactform" id="contactform" theme={theme} style={style} headingFont={headingFont} title={title}>
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
        <SectionShell key="cta" id="cta" theme={theme} style={style} headingFont={headingFont} title={title}>
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
          <p className="text-3xl font-bold" style={{ color: theme.colors.primary }}>{stat.value}</p>
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
          <span key={skill.id} className={`px-4 py-2 text-sm font-medium border ${radius}`} style={{ backgroundColor: `${theme.colors.primary}20`, color: theme.colors.primary, borderColor: `${theme.colors.primary}30` }}>
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

function SkillCard({ skill, theme, radius, compact }: { skill: Skill; theme: PortfolioTheme; radius: string; compact?: boolean }) {
  return (
    <div className={`border p-5 ${radius}`} style={{ borderColor: `${theme.colors.textMuted}20`, backgroundColor: `${theme.colors.surface}80` }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold">{skill.skillName}</h3>
        {theme.features.showSkillLevels && skill.proficiencyLevel && (
          <span className="shrink-0 px-2.5 py-0.5 text-xs rounded-full" style={{ backgroundColor: `${theme.colors.primary}25`, color: theme.colors.primary }}>
            {skill.proficiencyLevel}
          </span>
        )}
      </div>
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
    <article className={`border overflow-hidden ${radius}`} style={{ borderColor: `${theme.colors.textMuted}20`, backgroundColor: `${theme.colors.surface}80` }}>
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
