import type { JobListing } from "./platform-data";

const JOBS_PS_RSS = "https://jobs.ps/rss";
const REMOTIVE_API = "https://remotive.com/api/remote-jobs";

function hashId(source: string, title: string, company: string): string {
  return `${source}-${title}-${company}`.toLowerCase().replace(/\s+/g, "-").slice(0, 80);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchJobsPs(): Promise<JobListing[]> {
  try {
    const res = await fetch(JOBS_PS_RSS, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const text = await res.text();
    const items: JobListing[] = [];
    const itemBlocks = text.match(/<item>[\s\S]*?<\/item>/g) || [];
    for (const block of itemBlocks.slice(0, 30)) {
      const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || block.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const link = block.match(/<link>(.*?)<\/link>/)?.[1] || "";
      const desc = block.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || "";
      const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      if (!title) continue;
      items.push({
        id: hashId("jobs.ps", title, "jobs.ps"),
        title: stripHtml(title),
        company: "jobs.ps",
        location: "Palestine",
        type: "onsite",
        url: link,
        source: "jobs.ps",
        description: stripHtml(desc).slice(0, 300),
        publishedAt: pubDate ? new Date(pubDate).toISOString() : undefined,
        tags: ["palestine"],
      });
    }
    return items;
  } catch {
    return [];
  }
}

async function fetchRemotive(): Promise<JobListing[]> {
  try {
    const res = await fetch(REMOTIVE_API, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { jobs?: Array<Record<string, unknown>> };
    return (data.jobs || []).slice(0, 40).map((job) => ({
      id: hashId("remotive", String(job.title), String(job.company_name)),
      title: String(job.title || ""),
      company: String(job.company_name || ""),
      location: String(job.candidate_required_location || "Remote"),
      type: "remote",
      url: String(job.url || ""),
      source: "remotive" as const,
      description: stripHtml(String(job.description || "")).slice(0, 300),
      publishedAt: job.publication_date ? String(job.publication_date) : undefined,
      tags: job.tags ? (job.tags as string[]) : ["remote"],
    }));
  } catch {
    return [];
  }
}

async function fetchAdzuna(): Promise<JobListing[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return [];
  try {
    const url = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=20&what=developer`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { results?: Array<Record<string, unknown>> };
    return (data.results || []).map((job) => ({
      id: hashId("adzuna", String(job.title), String((job.company as { display_name?: string })?.display_name)),
      title: String(job.title || ""),
      company: String((job.company as { display_name?: string })?.display_name || ""),
      location: String((job.location as { display_name?: string })?.display_name || ""),
      type: String(job.contract_type || "full-time"),
      url: String(job.redirect_url || ""),
      source: "adzuna" as const,
      description: stripHtml(String(job.description || "")).slice(0, 300),
      publishedAt: job.created ? String(job.created) : undefined,
    }));
  } catch {
    return [];
  }
}

export async function fetchAllJobs(): Promise<JobListing[]> {
  const [jobsPs, remotive, adzuna] = await Promise.all([
    fetchJobsPs(),
    fetchRemotive(),
    fetchAdzuna(),
  ]);
  const merged = [...jobsPs, ...remotive, ...adzuna];
  const seen = new Set<string>();
  return merged.filter((j) => {
    if (seen.has(j.id)) return false;
    seen.add(j.id);
    return true;
  });
}

export function filterJobs(
  jobs: JobListing[],
  opts: { q?: string; source?: string; type?: string; location?: string }
): JobListing[] {
  let list = jobs;
  if (opts.source) list = list.filter((j) => j.source === opts.source);
  if (opts.type) list = list.filter((j) => j.type.toLowerCase().includes(opts.type!.toLowerCase()));
  if (opts.location) {
    const loc = opts.location.toLowerCase();
    list = list.filter((j) => j.location.toLowerCase().includes(loc) || j.tags?.some((t) => t.includes(loc)));
  }
  if (opts.q) {
    const q = opts.q.toLowerCase();
    list = list.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q)
    );
  }
  return list;
}
