import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getThemeSettings, saveThemeSettings } from "@/lib/airtable";
import { parseThemeSettings } from "@/lib/portfolio-theme";
import type { PortfolioTheme } from "@/lib/portfolio-theme";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const theme = await getThemeSettings(session.personalInfoId);
  return NextResponse.json({ theme });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as PortfolioTheme;
    const theme = parseThemeSettings(JSON.stringify(body));
    await saveThemeSettings(session.personalInfoId, theme);
    return NextResponse.json({ theme });
  } catch (error) {
    console.error("Theme save error:", error);
    return NextResponse.json({ error: "Failed to save theme." }, { status: 500 });
  }
}
