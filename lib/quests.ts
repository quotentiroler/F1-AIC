export type Quest = {
  id: string;
  title: string;
  description: string;
  points: number;
  link: string;
};

type QuestProgress = Record<string, boolean>;

export const QUESTS: Quest[] = [
  {
    id: "virtual-theater",
    title: "Visit Virtual Theater in Roam",
    description: "Open the Virtual Theater and explore the kickoff content.",
    link: "https://ro.am/r/#/d/24L7rtuBSr6nL88R3C85ow/GrGEU_byoG4v7FnSvdj9DQ",
    points: 20,
  },
  {
    id: "judge-links",
    title: "Review Judge Profiles",
    description: "Open judge links and learn about evaluation focus.",
    link: "https://ro.am/r/#/d/PtcPAL-cREC_AYtQE0avdg/2np4YwjOwVlIPIH0_T6SPQ",
    points: 15,
  },
  {
    id: "open-rooms-1",
    title: "Join an Open Room",
    description: "Hop into an open ROAM room to connect with builders.",
    link: "https://ro.am/r/#/d/LM7sKJ_ySxKmUu2Nk4xnTQ/hF4ycbCPVPcpIGsct7VApA",
    points: 25,
  },
  {
    id: "open-rooms-2",
    title: "Explore Another Room",
    description: "Find teams and ideas in a different ROAM room.",
    link: "https://ro.am/r/#/d/j-kdhSrhT5a4mAMXNVggRQ/4MGwXdgJcoTQT3ikoLMPiA",
    points: 25,
  },
  {
    id: "submission-form",
    title: "Open Submission Form",
    description: "Review the submission form requirements.",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSc-eDTMvfz1dh7PFm7pBshSAupaBK3PPixzKEbfqa0PN2P0Lg/viewform?usp=dialog",
    points: 15,
  },
  {
    id: "teams-room",
    title: "Visit a Team Page",
    description: "Get inspired by an existing team space.",
    link: "https://ro.am/r/#/d/5CA9IbYAToqzErmRvCNTpw/l0bK5TQGEEmtmAMAvEnCxQ",
    points: 20,
  },
];

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

// Local storage keys
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
