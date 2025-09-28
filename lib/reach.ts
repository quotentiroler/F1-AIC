import { listProfiles } from "./social";

export type ReachRow = {
  name: string;
  referrer?: string;
  reach: number;
};

// Simple aggregation with weights; tweakable
const WEIGHTS = {
  linkedin: 1.0,
  twitter: 0.7,
  youtube: 1.2,
  newsletter: 1.5,
};

export function computeReach(): ReachRow[] {
  const profiles = listProfiles();
  const rows: ReachRow[] = profiles.map((p) => {
    const linkedin = p.currentFollowers ?? 0;
    const twitter = p.twitterFollowers ?? 0;
    const youtube = p.youtubeSubs ?? 0;
    const newsletter = p.newsletterSubs ?? 0;
    const reach =
      linkedin * WEIGHTS.linkedin +
      twitter * WEIGHTS.twitter +
      youtube * WEIGHTS.youtube +
      newsletter * WEIGHTS.newsletter;
    return {
      name: p.name,
      referrer: p.referrer,
      reach: Math.round(reach),
    };
  });
  return rows.sort((a, b) => b.reach - a.reach);
}
