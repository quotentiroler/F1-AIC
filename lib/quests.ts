export type Quest = {
  id: string;
  title: string;
  description: string;
  points: number;
  link: string;
  event?: string; // e.g., "F1 Hackathon"
  deadline?: string; // ISO date string
  autoAccept?: boolean; // main quests are auto-accepted
  /**
   * Quest classification to support event join auto-accept rules
   * - main: core quest for the overall program (auto-accepted)
   * - side: optional non-event quest
   * - event: quest tied to an event (auto-accept when joining the event)
   * - event-side: optional event quest (do NOT auto-accept when joining)
   */
  kind?: "main" | "side" | "event" | "event-side";
};

type QuestProgress = Record<string, boolean>;

export const QUESTS: Quest[] = [
  {
    id: "virtual-theater",
    title: "Visit Virtual Theater in Roam",
    description: "Open the Virtual Theater and explore the kickoff content.",
    link: "https://ro.am/r/#/d/24L7rtuBSr6nL88R3C85ow/GrGEU_byoG4v7FnSvdj9DQ",
    points: 20,
    event: "F1 Hackathon",
    deadline: "2025-10-05T23:59:59Z",
    kind: "event",
  },
  {
    id: "judge-links",
    title: "Review Judge Profiles",
    description: "Open judge links and learn about evaluation focus.",
    link: "https://ro.am/r/#/d/PtcPAL-cREC_AYtQE0avdg/2np4YwjOwVlIPIH0_T6SPQ",
    points: 15,
    event: "F1 Hackathon",
    deadline: "2025-10-05T23:59:59Z",
    kind: "event",
  },
  {
    id: "open-rooms-1",
    title: "Join an Open Room",
    description: "Hop into an open ROAM room to connect with builders.",
    link: "https://ro.am/r/#/d/LM7sKJ_ySxKmUu2Nk4xnTQ/hF4ycbCPVPcpIGsct7VApA",
    points: 25,
    event: "F1 Hackathon",
    deadline: "2025-10-05T23:59:59Z",
    kind: "event",
  },
  {
    id: "open-rooms-2",
    title: "Explore Another Room",
    description: "Find teams and ideas in a different ROAM room.",
    link: "https://ro.am/r/#/d/j-kdhSrhT5a4mAMXNVggRQ/4MGwXdgJcoTQT3ikoLMPiA",
    points: 25,
    event: "F1 Hackathon",
    deadline: "2025-10-05T23:59:59Z",
    kind: "event-side",
  },
  {
    id: "submission-form",
    title: "Open Submission Form",
    description: "Review the submission form requirements.",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSc-eDTMvfz1dh7PFm7pBshSAupaBK3PPixzKEbfqa0PN2P0Lg/viewform?usp=dialog",
    points: 15,
    event: "F1 Hackathon",
    deadline: "2025-10-06T23:59:59Z",
    autoAccept: true,
    kind: "main",
  },
  {
    id: "teams-room",
    title: "Visit a Team Page",
    description: "Get inspired by an existing team space.",
    link: "https://ro.am/r/#/d/5CA9IbYAToqzErmRvCNTpw/l0bK5TQGEEmtmAMAvEnCxQ",
    points: 20,
    event: "F1 Hackathon",
    deadline: "2025-10-06T23:59:59Z",
    kind: "event",
  },
];

export type QuestGroup = { event: string; deadline?: string; items: Quest[] };

export function groupQuestsByEvent(qs: Quest[] = QUESTS): QuestGroup[] {
  const map = new Map<string, Quest[]>();
  for (const q of qs) {
    const k = q.event || "General";
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(q);
  }
  const groups: QuestGroup[] = Array.from(map.entries()).map(([event, items]) => {
    const latestDeadline = items
      .map((i) => (i.deadline ? new Date(i.deadline).getTime() : 0))
      .reduce((a, b) => Math.max(a, b), 0);
    return { event, deadline: latestDeadline ? new Date(latestDeadline).toISOString() : undefined, items };
  });
  // Sort groups by deadline descending (most urgent/late first), fallback to event name
  groups.sort((a, b) => {
    const da = a.deadline ? new Date(a.deadline).getTime() : 0;
    const db = b.deadline ? new Date(b.deadline).getTime() : 0;
    if (db !== da) return db - da;
    return a.event.localeCompare(b.event);
  });
  // Sort items inside group by deadline descending too
  for (const g of groups) {
    g.items.sort((a, b) => {
      const da = a.deadline ? new Date(a.deadline).getTime() : 0;
      const db = b.deadline ? new Date(b.deadline).getTime() : 0;
      if (db !== da) return db - da;
      return a.title.localeCompare(b.title);
    });
  }
  return groups;
}

export const BADGES = [
  { id: "rookie", label: "Rookie", threshold: 50 },
  { id: "contender", label: "Contender", threshold: 120 },
  { id: "champion", label: "Champion", threshold: 220 },
] as const;

export type Badge = typeof BADGES[number];

export function summarizeBadge(total: number): Badge {
  let current: Badge = BADGES[0];
  for (const b of BADGES) {
    if (total >= b.threshold) current = b;
  }
  return current;
}

// Legacy local storage key (kept to avoid breaking existing users before full migration to Zustand-only)
const QKEY = "quests:v1";

import { readJSON, writeJSON } from "./storage";

export function readProgress(): QuestProgress {
  return readJSON<QuestProgress>(QKEY, {});
}

export function toggleComplete(id: string, done: boolean) {
  const prog = readProgress();
  prog[id] = done;
  writeJSON(QKEY, prog);
}

export function calcTotalPoints(prog: QuestProgress) {
  return QUESTS.reduce((acc, q) => acc + (prog[q.id] ? q.points : 0), 0);
}
