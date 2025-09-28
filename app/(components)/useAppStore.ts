"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ProgressMap = Record<string, boolean>;
export type AcceptedMap = Record<string, boolean>;

type AppState = {
  username: string;
  progress: ProgressMap;
  accepted: AcceptedMap;
  setUsername: (name: string) => void;
  markComplete: (id: string) => void;
  acceptQuest: (id: string, accepted?: boolean) => void;
  setProgress: (map: ProgressMap) => void;
  setAccepted: (map: AcceptedMap) => void;
  resetProgress: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      username: "",
      progress: {},
      accepted: {},
      setUsername: (username) => set({ username }),
      setProgress: (progress) => set({ progress }),
      setAccepted: (accepted) => set({ accepted }),
      markComplete: (id) => set((s) => ({ progress: { ...s.progress, [id]: true } })),
      acceptQuest: (id, val = true) => set((s) => ({ accepted: { ...s.accepted, [id]: val } })),
      resetProgress: () => set({ progress: {} }),
    }),
    {
      name: "aic-store",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ username: s.username, progress: s.progress, accepted: s.accepted }),
    }
  )
);
