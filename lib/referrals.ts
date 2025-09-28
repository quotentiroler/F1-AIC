import { readJSON, writeJSON } from "./storage";

export type Referral = {
  id: string; // uuid-ish
  name: string;
  linkedin?: string;
  joinedAt: number;
  initialFollowers: number;
  currentFollowers: number;
};

const RKEY = "referrals:v1";

export function getReferrals(): Referral[] {
  return readJSON<Referral[]>(RKEY, []);
}

export function addReferral(r: Omit<Referral, "id" | "joinedAt">) {
  const id = cryptoRandomId();
  const rec: Referral = {
    id,
    joinedAt: Date.now(),
    ...r,
  };
  const list = getReferrals();
  list.push(rec);
  writeJSON(RKEY, list);
  return rec;
}

export function updateReferral(id: string, patch: Partial<Referral>) {
  const list = getReferrals();
  const idx = list.findIndex((x) => x.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...patch };
    writeJSON(RKEY, list);
  }
}

export function totalGrowth(list = getReferrals()) {
  return list.reduce((acc, r) => acc + Math.max(0, r.currentFollowers - r.initialFollowers), 0);
}

// Impact points: 1 point per 10 followers grown cumulatively
export function impactPoints(list = getReferrals()) {
  return Math.floor(totalGrowth(list) / 10);
}

export const GROWTH_ACHIEVEMENTS = [
  { id: "connector", label: "Connector", threshold: 50 },
  { id: "networker", label: "Networker", threshold: 200 },
  { id: "super-connector", label: "Super Connector", threshold: 500 },
] as const;

export function achievedGrowthBadges(growth: number) {
  return GROWTH_ACHIEVEMENTS.filter((a) => growth >= a.threshold);
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const arr = new Uint32Array(4);
    crypto.getRandomValues(arr);
    return Array.from(arr, (n) => n.toString(16)).join("");
  }
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
