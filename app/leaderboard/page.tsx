"use client";

import { getLeaderboard } from "@/lib/leaderboard";
import { computeReach } from "@/lib/reach";
import { getProfileByName } from "@/lib/social";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [rows, setRows] = useState<ReturnType<typeof getLeaderboard>>([]);
  const [reach, setReach] = useState<ReturnType<typeof computeReach>>([]);

  useEffect(() => {
    setRows(getLeaderboard().slice(0, 10));
    setReach(computeReach().slice(0, 10));
  }, []);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold inline-flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M8 21V10M12 21V3M16 21v-6"/>
          </svg>
          Leaderboard
        </h2>
      </div>

      {/* Growers (Points) */}
      <div className="mt-3">
        <div className="mb-2 text-sm font-medium text-slate-600">Growers (Points)</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2">#</th>
                <th className="py-2">Name</th>
                <th className="py-2">Top Referral</th>
                <th className="py-2 inline-flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M12 2l3 7h7l-5.5 4.5L18 22l-6-4-6 4 1.5-8.5L2 9h7z"/>
                  </svg>
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-slate-200">
                  <td className="py-2">{i + 1}</td>
                  <td className="py-2">{r.name}</td>
                  <td className="py-2 text-slate-600">{r.topReferral ?? "—"}</td>
                  <td className="py-2 font-semibold">{r.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Showers (Reach) */}
      <div className="mt-8">
        <div className="mb-2 text-sm font-medium text-slate-600">Showers (Reach)</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2">#</th>
                <th className="py-2">Name</th>
                <th className="py-2">Referred by</th>
                <th className="py-2">Joined Date</th>
                <th className="py-2">Reach Diff (%)</th>
                <th className="py-2 inline-flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/>
                  </svg>
                  Reach
                </th>
              </tr>
            </thead>
            <tbody>
              {reach.map((r, i) => {
                const p = getProfileByName(r.name);
                const base = p?.baselineFollowers ?? 0;
                const curr = p?.currentFollowers ?? 0;
                const diffPct = base > 0 ? Math.round(((curr - base) / base) * 100) : 0;
                const joinedDate = p?.joinedAt ? new Date(p.joinedAt).toLocaleDateString() : "—";
                return (
                <tr key={i} className="border-t border-slate-200">
                  <td className="py-2">{i + 1}</td>
                  <td className="py-2">{r.name}</td>
                  <td className="py-2 text-slate-600">{r.referrer ?? "—"}</td>
                  <td className="py-2 text-slate-600">{joinedDate}</td>
                  <td className="py-2 text-slate-600">{diffPct}%</td>
                  <td className="py-2 font-semibold">{r.reach.toLocaleString()}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
