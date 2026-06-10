import { getSession } from "@/lib/auth";
import { getPlatformData } from "@/lib/airtable";
import OnboardingWizard from "@/components/OnboardingWizard";

export default async function SetupPage() {
  const session = await getSession();
  if (!session) return null;

  const platform = await getPlatformData(session.personalInfoId);
  if (platform.onboarding?.complete) {
    const { redirect } = await import("next/navigation");
    redirect("/dashboard");
  }

  return <OnboardingWizard slug={session.slug} />;
}
