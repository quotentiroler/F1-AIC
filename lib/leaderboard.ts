import { calcTotalPoints, readProgress } from "./quests";
import { readString } from "./storage";
import { impactPoints, totalGrowth } from "./referrals";

export type Leader = { name: string; points: number };

const SAMPLE: Leader[] = [
  { name: "Zara", points: 180 },
  { name: "Kai", points: 140 },
  { name: "Ivy", points: 110 },
  { name: "Noah", points: 90 },
];

export function getLeaderboard(): Leader[] {
  const you = readString("username", "");
  const growth = totalGrowth();
  const yours = {
    name: growth > 0 ? `${you || "You"} (+${growth} followers)` : you || "You",
    points: calcTotalPoints(readProgress()) + impactPoints(),
  };
  const combined = [...SAMPLE, yours];
  return combined
    .sort((a, b) => b.points - a.points)
    .map((l, i) => ({ ...l, name: i === 0 ? `🥇 ${l.name}` : l.name }));
}
