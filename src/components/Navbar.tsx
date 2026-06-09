"use client";

import Link from "next/link";

interface NavbarProps {
  variant?: "landing" | "dashboard";
  slug?: string;
}

export default function Navbar({ variant = "landing", slug }: NavbarProps) {
  const isLanding = variant === "landing";

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md border-b ${
        isLanding
          ? "border-violet-100 bg-white/90"
          : "border-white/10 bg-[#0c0f1a]/80"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
            P
          </span>
          <span
            className={`font-display text-xl font-semibold transition-colors ${
              isLanding
                ? "text-slate-900 group-hover:text-violet-700"
                : "text-white group-hover:text-violet-300"
            }`}
          >
            Portfolia
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {variant === "dashboard" ? (
            <>
              {slug && (
                <Link
                  href={`/portfolio/${slug}`}
                  target="_blank"
                  className="hidden sm:inline-flex text-sm text-slate-400 hover:text-white transition-colors"
                >
                  View portfolio
                </Link>
              )}
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  window.location.href = "/";
                }}
                className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-slate-600 hover:text-violet-700 transition-colors px-3 py-1.5"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
