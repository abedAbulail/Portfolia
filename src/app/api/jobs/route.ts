import { NextResponse } from "next/server";
import { fetchAllJobs, filterJobs } from "@/lib/jobs-fetcher";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || undefined;
  const source = searchParams.get("source") || undefined;
  const type = searchParams.get("type") || undefined;
  const location = searchParams.get("location") || undefined;

  const jobs = await fetchAllJobs();
  const filtered = filterJobs(jobs, { q, source, type, location });
  return NextResponse.json({ jobs: filtered, total: filtered.length });
}
