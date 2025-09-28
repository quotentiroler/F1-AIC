import { calcTotalPoints, readProgress } from "./quests";
import { readString } from "./storage";
import { getReferrals, impactPoints, totalGrowth } from "./referrals";

export type Leader = { name: string; points: number; topReferral?: string };

const SAMPLE: Leader[] = [
  { name: "Zara", points: 180 },
  { name: "Kai", points: 140 },
  { name: "Ivy", points: 110 },
  { name: "Noah", points: 90 },
];

export function getLeaderboard(): Leader[] {
  const you = readString("username", "");
  const growth = totalGrowth();
  const topReferral = getTopReferralName();
  const yours = {
    name: growth > 0 ? `${you || "You"} (+${growth} followers)` : you || "You",
    points: calcTotalPoints(readProgress()) + impactPoints(),
    topReferral,
  };
  const combined = [...SAMPLE, yours];
  return combined
    .sort((a, b) => b.points - a.points)
    .map((l, i) => ({ ...l, name: i === 0 ? `🥇 ${l.name}` : l.name }));
}

function getTopReferralName(): string | undefined {
  const list = getReferrals();
  if (!list.length) return undefined;
  const top = [...list].sort((a, b) => {
    const da = Math.max(0, a.currentFollowers - a.initialFollowers);
    const db = Math.max(0, b.currentFollowers - b.initialFollowers);
    if (db !== da) return db - da;
    return b.joinedAt - a.joinedAt;
  })[0];
  return top?.name;
}
