import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updatePersonalInfo, getThemeSettings, saveThemeSettings } from "@/lib/airtable";
import { mergeTheme } from "@/lib/portfolio-theme";

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { profileI18n, ...profileFields } = body;
    const personalInfo = await updatePersonalInfo(session.personalInfoId, profileFields);

    if (profileI18n) {
      const theme = await getThemeSettings(session.personalInfoId);
      await saveThemeSettings(
        session.personalInfoId,
        mergeTheme(theme, { profileI18n })
      );
    }

    return NextResponse.json({ personalInfo });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
