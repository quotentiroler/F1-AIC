import { isBrowser, readJSON, writeJSON } from "./storage";

export type SocialProfile = {
  name: string;
  linkedin?: string;
  baselineFollowers: number; // LinkedIn baseline
  currentFollowers: number; // LinkedIn current
  twitter?: string; // handle or URL
  twitterFollowers?: number;
  youtube?: string; // channel URL/ID
  youtubeSubs?: number;
  newsletter?: string; // provider/name/url
  newsletterSubs?: number;
  referrer?: string; // who referred this user
  joinedAt: number;
};

const KEY = "social:profiles:v1";

export function listProfiles(): SocialProfile[] {
  const list = readJSON<SocialProfile[]>(KEY, []);
  return list;
}

export function upsertProfile(p: Omit<SocialProfile, "joinedAt"> & { joinedAt?: number }) {
  const list = listProfiles();
  const idx = list.findIndex((x) => x.name.toLowerCase() === p.name.toLowerCase());
  const rec: SocialProfile = {
    joinedAt: p.joinedAt ?? Date.now(),
    ...p,
  };
  if (idx >= 0) list[idx] = { ...list[idx], ...rec };
  else list.push(rec);
  writeJSON(KEY, list);
  return rec;
}

export function getProfileByName(name: string): SocialProfile | undefined {
  const n = name.trim().toLowerCase();
  if (!n) return undefined;
  return listProfiles().find((x) => x.name.toLowerCase() === n);
}

export function ensureSeedProfiles() {
  if (!isBrowser()) return;
  const existing = listProfiles();
  if (existing.length) return;
  const seed: SocialProfile[] = [
    { name: "Ada", linkedin: "ada", baselineFollowers: 1200, currentFollowers: 1320, twitterFollowers: 600, youtubeSubs: 1200, newsletterSubs: 900, joinedAt: Date.now() - 86400e3 },
    { name: "Linus", linkedin: "linus", baselineFollowers: 800, currentFollowers: 1040, twitterFollowers: 1500, youtubeSubs: 0, newsletterSubs: 300, joinedAt: Date.now() - 3 * 86400e3 },
    { name: "Grace", linkedin: "grace", baselineFollowers: 1500, currentFollowers: 1585, twitterFollowers: 400, youtubeSubs: 2200, newsletterSubs: 0, joinedAt: Date.now() - 5 * 86400e3 },
  ];
  writeJSON(KEY, seed);
}

export function followersDelta(name: string) {
  const p = listProfiles().find((x) => x.name.toLowerCase() === name.toLowerCase());
  if (!p) return 0;
  return Math.max(0, p.currentFollowers - p.baselineFollowers);
}
