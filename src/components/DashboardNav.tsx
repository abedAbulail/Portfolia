"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/skills", label: "Skills" },
  { href: "/dashboard/editor", label: "Page Editor" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 border-b border-white/10 pb-4 mb-8">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-violet-600/20 text-violet-300"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
