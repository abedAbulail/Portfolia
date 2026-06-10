import { notFound } from "next/navigation";
import { getPortfolioBySlug, recordPortfolioVisit } from "@/lib/airtable";
import { getPageBySlug } from "@/lib/platform-data";
import PortfolioClient from "@/components/PortfolioClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; pageSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, pageSlug } = await params;
  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) return { title: "Portfolio not found" };
  const page = getPageBySlug(portfolio.platform?.pages || [], pageSlug);
  return {
    title: `${portfolio.personalInfo.name} — ${page?.title || pageSlug}`,
    description: portfolio.personalInfo.professionalSummary || portfolio.personalInfo.bio,
  };
}

export default async function PortfolioSubPage({ params }: Props) {
  const { slug, pageSlug } = await params;
  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) notFound();

  const page = getPageBySlug(portfolio.platform?.pages || [], pageSlug);
  if (!page || !page.visible) notFound();

  await recordPortfolioVisit(slug);

  return (
    <PortfolioClient
      data={portfolio}
      slug={slug}
      pageSlug={pageSlug}
      sectionOrder={page.sectionOrder}
    />
  );
}
