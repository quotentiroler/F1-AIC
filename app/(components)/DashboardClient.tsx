"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { BADGES, calcTotalPoints, readProgress, summarizeBadge } from "@/lib/quests";
import { readString, writeString } from "@/lib/storage";
import { ensureSeedProfiles } from "@/lib/social";
import { getReferrals, totalGrowth, impactPoints, achievedGrowthBadges, GROWTH_ACHIEVEMENTS } from "@/lib/referrals";
import ReachCard from "./ReachCard";
import { useAppStore } from "@/components/useAppStore";
import { useUser } from "@auth0/nextjs-auth0";

export default function DashboardClient() {
  const params = useSearchParams();
  const ref = params.get("ref");

  const username = useAppStore((s) => s.username);
  const setUsername = useAppStore((s) => s.setUsername);
  const { user } = useUser();
  const [points, setPoints] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [impact, setImpact] = useState(0);
  const [referrals, setReferrals] = useState<ReturnType<typeof getReferrals>>([]);
  // Removed manual mock form; registration happens via referral banner
  const [achUnlocked, setAchUnlocked] = useState<string[]>([]);
  const [refLinkedIn, setRefLinkedIn] = useState("");
  const [refRegistered, setRefRegistered] = useState(false);

  useEffect(() => {
    ensureSeedProfiles();
  // Initialize points from local quests progress (legacy); will migrate to Zustand in Quests page
  setPoints(calcTotalPoints(readProgress()));
    setReferrals(getReferrals());
    const g = totalGrowth();
    setGrowth(g);
    setImpact(impactPoints());
    setAchUnlocked(achievedGrowthBadges(g).map((a) => a.id));
  }, []);

  const badge = useMemo(() => summarizeBadge(points), [points]);
  const refId = useMemo(() => {
    // Prefer Auth0 profile; fall back to stored username
    const base = (user?.nickname || user?.name || user?.email?.split("@")[0] || user?.sub || username || "").toString();
    const token = base.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-").slice(0, 32);
    return token || user?.sub?.split("|").pop() || username || "you";
  }, [user, username]);

  const referralUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return refId ? `${origin}/?ref=${encodeURIComponent(refId)}` : "";
  }, [refId]);

  const saveName = () => writeString("username", username.trim());

  async function registerReferral(profileUrl: string) {
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileUrl, referrer: (ref || refId || "You").toString().trim() }),
      });
  if (!res.ok) throw new Error("Failed to register referral");
      await refreshReferrals(refId);
    } catch (e) {
      // fallback to local-only if server not configured
      console.warn("Referral API unavailable, staying local", e);
    }
  }

  async function refreshReferrals(referrerOverride?: string) {
    try {
      const refName = (referrerOverride ?? refId ?? "You").toString().trim();
      const referrer = encodeURIComponent(refName);
      const res = await fetch(`/api/referrals?referrer=${referrer}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const profiles: Array<{ id: string; currentFollowers: number | null; initialFollowers: number | null; url?: string; name?: string }> = data.profiles ?? [];
      setReferrals(
        profiles.map((p) => ({
          id: p.id,
          name: p.name || p.url || "Visitor",
          linkedin: p.url,
          initialFollowers: (p.initialFollowers ?? 0) as number,
          currentFollowers: (p.currentFollowers ?? 0) as number,
          joinedAt: Date.now(),
        }))
      );
      const g = profiles.reduce((acc, p) => acc + Math.max(0, (p.currentFollowers ?? 0) - (p.initialFollowers ?? 0)), 0);
      setGrowth(g);
      setImpact(Math.floor(g / 10));
      setAchUnlocked(achievedGrowthBadges(g).map((a) => a.id));
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {ref && (
        <div className="rounded-md border border-primary/30 bg-sky-50 p-3 text-sm text-slate-700">
          <div>
            Welcome! You arrived via referral from <span className="font-semibold">{ref}</span>.
          </div>
          <div className="mt-2 text-slate-800">
            Help attribute credit by adding your LinkedIn profile URL:
          </div>
          <div className="mt-2 flex gap-2">
            <input
              className="w-full rounded-md border border-sky-300 px-3 py-1.5 text-sm"
              placeholder="https://www.linkedin.com/in/your-handle"
              value={refLinkedIn}
              onChange={(e) => setRefLinkedIn(e.target.value)}
            />
            <button
              className="btn"
              onClick={async () => {
                const url = refLinkedIn.trim().startsWith("http")
                  ? refLinkedIn.trim()
                  : refLinkedIn.trim()
                  ? `https://www.linkedin.com/in/${refLinkedIn.trim().replace(/^@/, "")}`
                  : "";
                if (!url) return;
                await registerReferral(url);
                setRefRegistered(true);
                setRefLinkedIn("");
                await refreshReferrals();
              }}
            >
              Register
            </button>
          </div>
          {refRegistered && (
            <div className="mt-2 text-xs text-green-700">Thanks! Your profile is registered.</div>
          )}
        </div>
      )}

      <section className="card">
        <h2 className="text-lg font-semibold inline-flex items-center gap-2">
          <Image src="/users-alt-svgrepo-com.svg" alt="" aria-hidden width={18} height={18} className="inline-block" />
          Invite friends
        </h2>
        <p className="mt-1 text-sm text-slate-600">Share your unique link (based on your profile). Visitors will see a referral banner.</p>
        <div className="mt-3 flex items-center gap-2">
          <input
            readOnly
            value={referralUrl}
            placeholder="Generating link…"
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
          <button
            className="btn"
            onClick={() => {
              if (!referralUrl) return;
              navigator.clipboard.writeText(referralUrl);
            }}
          >
            Copy
          </button>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold inline-flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Z"/>
            <path d="M2 22c0-4.418 4.477-8 10-8s10 3.582 10 8"/>
          </svg>
          Your Profile
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm text-slate-600">Display name</label>
            <div className="mt-1 flex gap-2">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Max"
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
              />
              <button className="btn" onClick={saveName}>Save</button>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-sm text-slate-600">Points</div>
            <div className="text-2xl font-bold">{points + impact}</div>
            <div className="mt-1 text-xs text-slate-500">Quests: {points} • Impact: +{impact}</div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-sm text-slate-600">Badge</div>
            <div className="badge mt-1">{badge.label}</div>
            <div className="mt-1 text-xs text-slate-500">Next at {BADGES.find(b=>b.threshold>badge.threshold)?.threshold ?? "—"} pts</div>
          </div>
        </div>
      </section>

  <ReachCard displayName={(user?.name as string) || (user?.nickname as string) || username || "You"} />

      <section className="card">
        <h2 className="text-lg font-semibold inline-flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M3 3v6h6"/>
            <path d="M21 21v-6h-6"/>
            <path d="M3 9l7-7"/>
            <path d="M21 15l-7 7"/>
          </svg>
          Referral Impact
        </h2>
        <p className="mt-1 text-sm text-slate-600">Cumulative LinkedIn followers gained by people you brought in.</p>
        <div className="mt-2 flex items-baseline gap-4">
          <div>
            <div className="text-sm text-slate-600">Network growth</div>
            <div className="text-2xl font-bold">+{growth}</div>
          </div>
          <div className="text-xs text-slate-500">Earn 1 point per 10 followers grown. Impact points: +{impact}</div>
        </div>

        {achUnlocked.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {achievedGrowthBadges(growth).map((a) => (
              <span key={a.id} className="badge bg-purple-600/10 text-purple-700">
                {a.label}
              </span>
            ))}
          </div>
        )}
        {referrals.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium">Your referrals</div>
            <ul className="mt-2 divide-y divide-slate-200 text-sm">
              {referrals.map((r) => (
                <li key={r.id} className="py-2 flex items-center justify-between">
                  <span>{r.name}</span>
                  <span className="text-slate-600">+{Math.max(0, (r.currentFollowers ?? 0) - (r.initialFollowers ?? 0))} followers</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      

      <section className="card">
        <h2 className="text-lg font-semibold inline-flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M8 6h13"/>
            <path d="M8 12h13"/>
            <path d="M8 18h13"/>
            <path d="M3 6h.01"/>
            <path d="M3 12h.01"/>
            <path d="M3 18h.01"/>
          </svg>
          How it works
        </h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
          <li>Complete quests to earn points.</li>
          <li>Climb the leaderboard and unlock badges.</li>
          <li>Share your referral link to spread the word.</li>
        </ul>
      </section>
    </div>
  );
}
