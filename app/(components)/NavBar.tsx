"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

const tabs: { href: Route; label: string }[] = [
  { href: "/", label: "Dashboard" },
  { href: "/quests", label: "Quests" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={
              "rounded-md px-3 py-1.5 text-sm font-medium hover:bg-slate-100 " +
              (active ? "bg-slate-100 text-slate-900" : "text-slate-600")
            }
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
