import { notFound } from "next/navigation";
import { getPortfolioBySlug, recordPortfolioVisit } from "@/lib/airtable";
import PortfolioClient from "@/components/PortfolioClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) return { title: "Portfolio not found" };

  return {
    title: `${portfolio.personalInfo.name} — Portfolio`,
    description:
      portfolio.personalInfo.professionalSummary ||
      portfolio.personalInfo.bio ||
      `Professional portfolio of ${portfolio.personalInfo.name}`,
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);

  if (!portfolio) notFound();

  await recordPortfolioVisit(slug);

  return <PortfolioClient data={portfolio} slug={slug} />;
}
