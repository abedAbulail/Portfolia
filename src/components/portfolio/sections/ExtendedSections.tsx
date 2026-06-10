import type { PortfolioTheme, PortfolioContent } from "@/lib/portfolio-theme";
import { getRadiusClass } from "@/lib/portfolio-theme";
import { AppIcon } from "@/components/icons/AppIcons";

export function TimelineSection({ content, theme }: { content: PortfolioContent; theme: PortfolioTheme }) {
  const radius = getRadiusClass(theme.layout.borderRadius);
  const items = [
    ...content.experience.map((e) => ({ ...e, type: "work" as const, title: e.role, subtitle: e.company })),
    ...content.education.map((e) => ({ ...e, type: "edu" as const, title: e.degree, subtitle: e.school })),
  ];
  if (!items.length) return null;

  return (
    <div className="relative space-y-0">
      <div className="absolute left-4 top-2 bottom-2 w-0.5 pf-timeline-line" style={{ background: `${theme.colors.primary}30` }} />
      {items.map((item) => (
        <div key={item.id} className="relative pl-10 pb-8 last:pb-0 group">
          <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 transition-transform group-hover:scale-125" style={{ borderColor: theme.colors.primary, background: theme.colors.background }} />
          <div className={`pf-card-hover border p-5 ${radius} transition-colors group-hover:border-opacity-60`} style={{ borderColor: `${theme.colors.textMuted}20`, backgroundColor: `${theme.colors.surface}60` }}>
            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}>
              {item.type === "work" ? "Experience" : "Education"}
            </span>
            <h3 className="font-semibold text-lg mt-2">{item.title}</h3>
            <p className="text-sm" style={{ color: theme.colors.primary }}>{item.subtitle} · {item.period}</p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.colors.textMuted }}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TechStackSection({ content, theme }: { content: PortfolioContent; theme: PortfolioTheme }) {
  const radius = getRadiusClass(theme.layout.borderRadius);
  if (!content.techStack.length) return null;
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {content.techStack.map((tech) => (
        <div key={tech.id} className={`pf-tech-icon flex flex-col items-center gap-2 p-4 border ${radius} min-w-[90px]`} style={{ borderColor: `${theme.colors.primary}30`, background: `${theme.colors.surface}80` }}>
          <span
            className="text-xs font-semibold tracking-wide w-10 h-10 flex items-center justify-center rounded-md"
            style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}
          >
            {tech.icon || tech.name.slice(0, 2)}
          </span>
          <span className="text-xs font-medium" style={{ color: theme.colors.text }}>{tech.name}</span>
        </div>
      ))}
    </div>
  );
}

export function CaseStudySection({ content, theme }: { content: PortfolioContent; theme: PortfolioTheme }) {
  const radius = getRadiusClass(theme.layout.borderRadius);
  if (!content.caseStudies.length) return null;
  return (
    <div className="space-y-6">
      {content.caseStudies.map((cs) => (
        <article key={cs.id} className={`pf-card-hover border overflow-hidden ${radius}`} style={{ borderColor: `${theme.colors.textMuted}20` }}>
          {cs.imageUrl && <img src={cs.imageUrl} alt={cs.title} className="w-full h-48 object-cover" />}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold">{cs.title}</h3>
              <p className="text-sm" style={{ color: theme.colors.primary }}>{cs.client}</p>
            </div>
            <div><p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.colors.textMuted }}>Challenge</p><p className="text-sm">{cs.challenge}</p></div>
            <div><p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.colors.textMuted }}>Solution</p><p className="text-sm">{cs.solution}</p></div>
            <div className={`p-4 ${radius}`} style={{ background: `${theme.colors.primary}15` }}>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.colors.primary }}>Results</p>
              <p className="font-medium">{cs.results}</p>
            </div>
            <div className="flex flex-wrap gap-2">{cs.tags.map((tag) => <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}>{tag}</span>)}</div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ServicesSection({
  content,
  theme,
  columns,
}: {
  content: PortfolioContent;
  theme: PortfolioTheme;
  columns?: string;
}) {
  const radius = getRadiusClass(theme.layout.borderRadius);
  if (!content.services.length) return null;
  const gridClass =
    columns === "2"
      ? "grid sm:grid-cols-2 gap-4"
      : columns === "1"
        ? "grid grid-cols-1 gap-4 max-w-md mx-auto"
        : "grid sm:grid-cols-2 lg:grid-cols-3 gap-4";
  return (
    <div className={gridClass}>
      {content.services.map((svc) => (
        <div key={svc.id} className={`pf-card-hover border p-6 text-center ${radius}`} style={{ borderColor: `${theme.colors.textMuted}20`, background: `${theme.colors.surface}80` }}>
          <span
            className="text-xs font-semibold tracking-wide w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-md"
            style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}
          >
            {svc.icon || svc.title.slice(0, 2)}
          </span>
          <h3 className="font-semibold mb-2">{svc.title}</h3>
          <p className="text-sm mb-3" style={{ color: theme.colors.textMuted }}>{svc.description}</p>
          {svc.price && <p className="text-sm font-medium" style={{ color: theme.colors.primary }}>{svc.price}</p>}
        </div>
      ))}
    </div>
  );
}

export function BlogSection({ content, theme }: { content: PortfolioContent; theme: PortfolioTheme }) {
  const radius = getRadiusClass(theme.layout.borderRadius);
  if (!content.articles.length) return null;
  return (
    <div className="space-y-4">
      {content.articles.map((art) => (
        <a key={art.id} href={art.url} target="_blank" rel="noopener noreferrer" className={`block border p-5 ${radius} hover:border-opacity-60 transition-colors`} style={{ borderColor: `${theme.colors.textMuted}20`, background: `${theme.colors.surface}60` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold hover:underline" style={{ color: theme.colors.text }}>{art.title}</h3>
              <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>{art.excerpt}</p>
            </div>
            <span className="text-xs shrink-0" style={{ color: theme.colors.textMuted }}>{art.date}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

export function OpenSourceSection({ content, theme }: { content: PortfolioContent; theme: PortfolioTheme }) {
  const radius = getRadiusClass(theme.layout.borderRadius);
  if (!content.openSource.length) return null;
  return (
    <div className="space-y-3">
      {content.openSource.map((repo) => (
        <a key={repo.id} href={repo.url} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-between border p-4 ${radius}`} style={{ borderColor: `${theme.colors.textMuted}20`, background: `${theme.colors.surface}80` }}>
          <div>
            <h3 className="font-semibold" style={{ color: theme.colors.primary }}>{repo.name}</h3>
            <p className="text-sm" style={{ color: theme.colors.textMuted }}>{repo.description}</p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <p className="text-sm">{repo.stars} stars</p>
            <p className="text-xs" style={{ color: theme.colors.textMuted }}>{repo.language}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

export function AwardsSection({ content, theme }: { content: PortfolioContent; theme: PortfolioTheme }) {
  const radius = getRadiusClass(theme.layout.borderRadius);
  if (!content.awards.length) return null;
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {content.awards.map((awd) => (
        <div key={awd.id} className={`flex items-center gap-4 border p-4 ${radius}`} style={{ borderColor: `${theme.colors.textMuted}20`, background: `${theme.colors.surface}80` }}>
          <AppIcon name="trophy" size={28} style={{ color: theme.colors.primary }} />
          <div>
            <h3 className="font-semibold">{awd.title}</h3>
            <p className="text-sm" style={{ color: theme.colors.textMuted }}>{awd.issuer} · {awd.year}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LanguagesSection({ content, theme }: { content: PortfolioContent; theme: PortfolioTheme }) {
  if (!content.languages.length) return null;
  const levels: Record<string, number> = { Native: 100, Fluent: 85, Advanced: 70, Intermediate: 55, Basic: 35 };
  return (
    <div className="space-y-4 max-w-md mx-auto">
      {content.languages.map((lang) => (
        <div key={lang.id}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{lang.name}</span>
            <span style={{ color: theme.colors.textMuted }}>{lang.level}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: `${theme.colors.textMuted}20` }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${levels[lang.level] || 50}%`, background: theme.colors.primary }} />
          </div>
        </div>
      ))}
    </div>
  );
}
