import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LocaleProvider } from "@/context/LocaleContext";
import { AppThemeProvider } from "@/context/AppThemeContext";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <AppThemeProvider>
      <LocaleProvider>
        <DashboardShell slug={session.slug}>{children}</DashboardShell>
      </LocaleProvider>
    </AppThemeProvider>
  );
}
