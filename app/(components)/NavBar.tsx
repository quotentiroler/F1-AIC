"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";

const tabs: { href: Route; label: string }[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/quests", label: "Quests" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/rewards", label: "Rewards" },
  { href: "/profile", label: "Profile" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  return (
    <nav className="flex items-center gap-2">
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
      <span className="mx-2 h-5 w-px bg-slate-200" />
      {isLoading ? (
        <span className="text-sm text-slate-500">Loading…</span>
      ) : user ? (
        <>
          <span className="text-sm text-slate-700">{user.name || user.email}</span>
          <Link
            href="/api/auth/logout"
            prefetch={false}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Sign out
          </Link>
        </>
      ) : (
        <Link
          href="/api/auth/login"
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Sign in
        </Link>
      )}
    </nav>
  );
}
