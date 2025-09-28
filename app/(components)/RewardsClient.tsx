"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { calcTotalPoints, QUESTS, groupQuestsByEvent } from "@/lib/quests";
import { impactPoints } from "@/lib/referrals";
import { useAppStore } from "@/components/useAppStore";

const TIERS: { points: number; title: string; desc: string }[] = [
  { points: 50, title: "Sticker Pack", desc: "AIC holographic sticker pack delivered to your inbox (well, your mailbox)." },
  { points: 120, title: "Swag Drop", desc: "Exclusive AIC t‑shirt – flex your questing prowess." },
  { points: 220, title: "VIP Showcase", desc: "Pitch your build in a live session with mentors and founders." },
  { points: 1000, title: "Launch Boost", desc: "Signal boost from partner accounts + featured in newsletter." },
  { points: 1000000000, title: "Grand Choice", desc: "Pick ONE: Ride a Waymo with Elon Musk OR ride a buggy with Sam Altman." },
];

// Points are computed from Zustand progress + impact points inside the component hook

function formatPts(n: number) {
  return `${n.toLocaleString()} pts`;
}

function formatDue(iso?: string) {
  if (!iso) return "No deadline";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";
function tierRarity(points: number): Rarity {
  if (points >= 1_000_000_000) return "Mythic";
  if (points >= 1_000) return "Legendary";
  if (points >= 220) return "Epic";
  if (points >= 120) return "Rare";
  return "Common";
}

export default function RewardsClient() {
  // Client-only state to avoid SSR/client hydration mismatch
  const [total, setTotal] = useState(0);
  const progress = useAppStore((s) => s.progress);
  const [nextMissions, setNextMissions] = useState<typeof QUESTS>([]);
  const [suggestedPts, setSuggestedPts] = useState(0);
  const [activeEvents, setActiveEvents] = useState<string[]>([]);
  const [eventGroups, setEventGroups] = useState<{ event: string; deadline?: string; items: typeof QUESTS }[]>([]);

  useEffect(() => {
    // Compute client-side values after mount and whenever progress changes
    const t = calcTotalPoints(progress) + impactPoints();
    setTotal(t);
    const incomplete = QUESTS.filter((q) => !progress[q.id]);
    const upcoming = incomplete
      .map((q) => ({
        ...q,
        dueMs: q.deadline ? new Date(q.deadline).getTime() : Number.POSITIVE_INFINITY,
      }))
      .sort((a, b) => a.dueMs - b.dueMs);
    const nm = upcoming.slice(0, 4);
    setNextMissions(nm as any);
    setSuggestedPts(nm.reduce((acc, q) => acc + q.points, 0));
    setActiveEvents(Array.from(new Set(incomplete.map((q) => q.event).filter(Boolean))) as string[]);
    const eg = groupQuestsByEvent()
      .map((g) => ({
        event: g.event,
        deadline: g.deadline,
        items: g.items.filter((q) => !progress[q.id]).slice(0, 3),
      }))
      .filter((g) => g.items.length > 0);
    setEventGroups(eg as any);
  }, [progress]);

  const max = TIERS[TIERS.length - 1].points;
  const pct = Math.min(100, Math.round((total / max) * 100));

  const nextTier = TIERS.find((t) => total < t.points);
  const currentTierIndex = Math.max(0, (nextTier ? TIERS.indexOf(nextTier) : TIERS.length) - 1);
  const pointsToNext = Math.max(0, (nextTier?.points ?? total) - total);

  return (
    <div className="container relative py-6">
      {/* Subtle tactical grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(2, 132, 199, 0.15) 1px, transparent 1px), radial-gradient(circle at 1px 1px, rgba(14, 165, 233, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px, 48px 48px",
        }}
      />

      {/* Header / Ops Briefing */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-sky-600/10 text-sky-600 ring-1 ring-sky-600/20">
              {/* Target icon */}
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m13 0a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Rewards Plan
          </h1>
          <p className="mt-1 text-slate-600">Push the front line. Rack up points. Secure the rewards.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                <path d="M12 17l-5 2 2-5 9-9a2.828 2.828 0 114 4l-9 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Current Points
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-900">{total.toLocaleString()}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                <path d="M17 3l4 4-9 9-4 1 1-4 9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Next Unlock
            </div>
            <div className="mt-1 text-sm text-slate-900">
              {nextTier ? (
                <>
                  <span className="font-semibold">{nextTier.title}</span>
                  <span className="ml-2 text-slate-500">in {pointsToNext.toLocaleString()} pts</span>
                  {suggestedPts > 0 && (
                    <div className="mt-0.5 text-xs text-slate-500">
                      Suggested missions net {suggestedPts.toLocaleString()} pts
                    </div>
                  )}
                </>
              ) : (
                <span className="font-semibold text-green-700">All rewards unlocked</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Strategic progress rail */}
      <div className="mt-6">
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-sky-500"
            style={{
              width: `${pct}%`,
              backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 6px, transparent 6px, transparent 12px)",
            }}
          />
        </div>
        <div className="mt-1 text-sm text-slate-600">{total.toLocaleString()} / {max.toLocaleString()} pts</div>
      </div>

      {/* Mission Timeline */}
      <div className="mt-8 grid gap-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="card sticky top-4 border-sky-200 bg-white/70 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Operation</div>
                <div className="mt-0.5 text-lg font-semibold">AIC Reward Offensive</div>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-sky-600/10 px-2 py-1 text-sky-700 ring-1 ring-sky-600/20">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-xs font-medium">Sector Progress</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">Advance through sectors to secure supply drops, VIP access, and the final grand choice. Complete quests and deploy referrals to push the line.</p>

            {activeEvents.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Active Events:</span>
                {activeEvents.map((e) => (
                  <span key={e} className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-700 ring-1 ring-sky-200">
                    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {e}
                  </span>
                ))}
              </div>
            )}

            {nextMissions.length > 0 && (
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Next Missions</div>
                <ul className="mt-2 space-y-2">
                  {nextMissions.map((m) => (
                    <li key={m.id} className="group flex items-start justify-between gap-3 rounded-md border border-slate-200 bg-white/60 p-2 ring-1 ring-transparent transition hover:ring-sky-200">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {m.event && (
                            <span className="rounded bg-violet-600/10 px-1.5 py-0.5 text-[11px] font-medium text-violet-700 ring-1 ring-violet-600/20">{m.event}</span>
                          )}
                          <a href={m.link} target="_blank" rel="noreferrer" className="truncate font-medium text-slate-900 underline decoration-sky-300 decoration-2 underline-offset-2 group-hover:text-sky-700">
                            {m.title}
                          </a>
                        </div>
                        <div className="mt-0.5 text-xs text-slate-600">Due: {formatDue(m.deadline)}</div>
                      </div>
                      <div className="shrink-0 self-center rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white">+{m.points} pts</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {eventGroups.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Event Missions</div>
                  <Link href="/quests" className="text-xs font-medium text-sky-700 hover:underline">View all quests</Link>
                </div>
                <div className="mt-2 space-y-3">
                  {eventGroups.map((g) => (
                    <div key={g.event} className="rounded-md border border-slate-200 bg-white/60 p-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{g.event}</div>
                        {g.deadline && (
                          <div className="text-xs text-slate-600">Latest deadline: {formatDue(g.deadline)}</div>
                        )}
                      </div>
                      <ul className="mt-2 space-y-1">
                        {g.items.map((q) => (
                          <li key={q.id} className="flex items-center justify-between gap-3">
                            <div className="min-w-0 truncate text-sm">
                              <a href={q.link} target="_blank" rel="noreferrer" className="truncate text-slate-900 hover:underline">{q.title}</a>
                              <span className="ml-2 text-xs text-slate-500">Due: {formatDue(q.deadline)}</span>
                            </div>
                            <span className="shrink-0 rounded-md bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">+{q.points} pts</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-3">
          <ul className="relative space-y-4 pl-6 before:absolute before:left-3 before:top-0 before:h-full before:w-px before:bg-gradient-to-b before:from-sky-300 before:via-slate-200 before:to-slate-200">
            {TIERS.map((t, idx) => {
              const achieved = total >= t.points;
              const isCurrent = !achieved && (nextTier ? nextTier.points === t.points : false);
              const rarity = tierRarity(t.points);
              return (
                <li key={t.points} className="relative">
                  {/* Node */}
                  <span
                    className={
                      "absolute left-[-2px] top-2 inline-flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full ring-2 " +
                      (achieved
                        ? "bg-green-500 ring-green-200"
                        : isCurrent
                        ? "bg-sky-500 ring-sky-200 animate-pulse"
                        : "bg-slate-300 ring-slate-200")
                    }
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>

                  {/* Card */}
                  <div
                    className={
                      "card relative ml-4 flex flex-col gap-2 border " +
                      (achieved
                        ? "border-green-300 bg-green-50"
                        : isCurrent
                        ? "border-sky-300 bg-sky-50 shadow-[0_0_0_2px_rgba(56,189,248,0.3)]"
                        : "border-slate-200 bg-white/70 backdrop-blur")
                    }
                  >
                    {isCurrent && (
                      <span className="pointer-events-none absolute -inset-px -z-10 rounded-xl bg-gradient-to-r from-sky-400/20 via-fuchsia-400/10 to-amber-400/20 blur"></span>
                    )}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-20 text-right">
                        <div className="text-[11px] uppercase tracking-wide text-slate-500">Tier</div>
                        <div className="text-lg font-extrabold tabular-nums">{t.points.toLocaleString()}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold">{t.title}</div>
                          <span
                            className={
                              "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ring-1 " +
                              (rarity === "Mythic"
                                ? "bg-fuchsia-600/10 text-fuchsia-700 ring-fuchsia-600/20"
                                : rarity === "Legendary"
                                ? "bg-amber-500/10 text-amber-700 ring-amber-500/20"
                                : rarity === "Epic"
                                ? "bg-violet-600/10 text-violet-700 ring-violet-600/20"
                                : rarity === "Rare"
                                ? "bg-sky-600/10 text-sky-700 ring-sky-600/20"
                                : "bg-slate-600/10 text-slate-700 ring-slate-600/20")
                            }
                          >
                            {rarity}
                          </span>
                          {achieved && (
                            <span className="inline-flex items-center gap-1 rounded bg-green-600/10 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-600/20">
                              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                                <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              Unlocked
                            </span>
                          )}
                          {isCurrent && !achieved && (
                            <span className="inline-flex items-center gap-1 rounded bg-sky-600/10 px-2 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-sky-600/20">
                              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              In progress
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-slate-700">{t.desc}</div>

                        {/* Special showcase for Grand Choice */}
                        {t.points === 1000000000 && (
                          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-md border border-slate-200 p-3">
                              <div className="font-medium">Option A: Ride a Waymo with Elon Musk</div>
                              <div className="mt-1 text-sm text-slate-600">Self‑driving flex. No hands.</div>
                              <div className="mt-2">
                                <Image src="/waymomusk.png" alt="Elon Musk Waymo preview" width={640} height={360} className="w-full rounded-md border" />
                              </div>
                            </div>
                            <div className="rounded-md border border-slate-200 p-3">
                              <div className="font-medium">Option B: Ride a buggy with Sam Altman</div>
                              <div className="mt-1 text-sm text-slate-600">Open‑road vibes. Bring safety goggles.</div>
                              <div className="mt-2">
                                <Image src="/SamAltmanBuggie.png" alt="Sam Altman buggy preview" width={640} height={360} className="w-full rounded-md border" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer: status & CTA */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-500">
                        {achieved ? (
                          <span className="inline-flex items-center gap-1 text-green-700">
                            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                              <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Secured
                          </span>
                        ) : isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-sky-700">
                            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {pointsToNext.toLocaleString()} pts to go
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                              <path d="M4 7h16M4 12h10M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Recon pending
                          </span>
                        )}
                      </div>

                      {!achieved && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="rounded-md bg-slate-900 px-2 py-1 font-medium text-white">{formatPts(total)}</span>
                          <span className="text-slate-500">→</span>
                          <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700">{formatPts(t.points)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
