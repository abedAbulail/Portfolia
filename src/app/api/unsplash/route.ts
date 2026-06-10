import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "portfolio";
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return NextResponse.json({ photos: [], message: "Unsplash not configured" });
  }
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=20`,
      { headers: { Authorization: `Client-ID ${key}` }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return NextResponse.json({ photos: [] });
    const data = (await res.json()) as { results?: Array<Record<string, unknown>> };
    const photos = (data.results || []).map((p) => ({
      id: p.id,
      url: (p.urls as { regular?: string })?.regular,
      thumb: (p.urls as { small?: string })?.small,
      alt: (p.alt_description as string) || "",
      author: (p.user as { name?: string })?.name,
    }));
    return NextResponse.json({ photos });
  } catch {
    return NextResponse.json({ photos: [] });
  }
}
