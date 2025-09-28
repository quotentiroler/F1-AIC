"use client";

import { getLeaderboard } from "@/lib/leaderboard";
import { computeReach } from "@/lib/reach";
import { useEffect, useState } from "react";

type Tab = "growers" | "showers";

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>("growers");
  const [rows, setRows] = useState<{ name: string; points: number }[]>([]);
  const [reach, setReach] = useState<ReturnType<typeof computeReach>>([]);

  useEffect(() => {
    setRows(getLeaderboard());
    setReach(computeReach());
  }, []);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Leaderboard</h2>
        <div className="flex gap-2">
          <button
            className={`btn ${tab === "growers" ? "btn-primary" : ""}`}
            onClick={() => setTab("growers")}
          >
            Growers (Points)
          </button>
          <button
            className={`btn ${tab === "showers" ? "btn-primary" : ""}`}
            onClick={() => setTab("showers")}
          >
            Showers (Reach)
          </button>
        </div>
      </div>

      {tab === "growers" ? (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2">Rank</th>
                <th className="py-2">Name</th>
                <th className="py-2">Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-slate-200">
                  <td className="py-2">{i + 1}</td>
                  <td className="py-2">{r.name}</td>
                  <td className="py-2 font-semibold">{r.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2">Rank</th>
                <th className="py-2">Name</th>
                <th className="py-2">Referred by</th>
                <th className="py-2">Reach</th>
                <th className="py-2">Breakdown</th>
              </tr>
            </thead>
            <tbody>
              {reach.map((r, i) => (
                <tr key={i} className="border-t border-slate-200">
                  <td className="py-2">{i + 1}</td>
                  <td className="py-2">{r.name}</td>
                  <td className="py-2 text-slate-600">{r.referrer ?? "—"}</td>
                  <td className="py-2 font-semibold">{r.reach.toLocaleString()}</td>
                  <td className="py-2 text-slate-600">
                    LI {r.breakdown.linkedin.toLocaleString()} · X {r.breakdown.twitter.toLocaleString()} · YT {r.breakdown.youtube.toLocaleString()} · NL {r.breakdown.newsletter.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
