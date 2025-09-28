"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ProgressMap = Record<string, boolean>;
export type AcceptedMap = Record<string, boolean>;
export type JoinedEventsMap = Record<string, boolean>;

type AppState = {
  username: string;
  progress: ProgressMap;
  accepted: AcceptedMap;
  joinedEvents: JoinedEventsMap;
  setUsername: (name: string) => void;
  markComplete: (id: string) => void;
  acceptQuest: (id: string, accepted?: boolean) => void;
  setProgress: (map: ProgressMap) => void;
  setAccepted: (map: AcceptedMap) => void;
  joinEvent: (event: string) => void;
  leaveEvent: (event: string) => void;
  resetProgress: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      username: "",
      progress: {},
      accepted: {},
      joinedEvents: {},
      setUsername: (username) => set({ username }),
      setProgress: (progress) => set({ progress }),
      setAccepted: (accepted) => set({ accepted }),
      markComplete: (id) => set((s) => ({ progress: { ...s.progress, [id]: true } })),
      acceptQuest: (id, val = true) => set((s) => ({ accepted: { ...s.accepted, [id]: val } })),
      joinEvent: (event) => {
        // Mark event as joined
        const { accepted } = get();
        // Auto-accept all event quests except those marked as 'event-side'
        try {
          // Import lazily to avoid circular deps at module init
          const { QUESTS } = require("@/lib/quests");
          const nextAccepted = { ...accepted } as AcceptedMap;
          for (const q of QUESTS as Array<{ id: string; event?: string; kind?: string }>) {
            if (q.event === event) {
              const isSide = q.kind === "event-side";
              if (!isSide) nextAccepted[q.id] = true;
            }
          }
          set((s) => ({ accepted: nextAccepted, joinedEvents: { ...s.joinedEvents, [event]: true } }));
        } catch (e) {
          // Fallback: still flag joined
          set((s) => ({ joinedEvents: { ...s.joinedEvents, [event]: true } }));
        }
      },
      leaveEvent: (event) => set((s) => ({ joinedEvents: { ...s.joinedEvents, [event]: false } })),
      resetProgress: () => set({ progress: {} }),
    }),
    {
      name: "aic-store",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ username: s.username, progress: s.progress, accepted: s.accepted, joinedEvents: s.joinedEvents }),
    }
  )
);
