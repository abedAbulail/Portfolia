"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function SetupGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/dashboard/setup")) {
      setReady(true);
      return;
    }

    fetch("/api/dashboard/onboarding")
      .then((r) => r.json())
      .then((d) => {
        if (d.onboarding && !d.onboarding.complete) {
          router.replace("/dashboard/setup");
        } else {
          setReady(true);
        }
      })
      .catch(() => setReady(true));
  }, [pathname, router]);

  if (!ready && !pathname.startsWith("/dashboard/setup")) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--app-bg)" }}>
        <p style={{ color: "var(--app-text-muted)" }}>Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
