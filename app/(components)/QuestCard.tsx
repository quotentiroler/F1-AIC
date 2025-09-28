"use client";

import { useState } from "react";
import type { Quest } from "@/lib/quests";
import { useAppStore } from "@/components/useAppStore";

export default function QuestCard({
  quest,
  completed,
  onComplete,
}: {
  quest: Quest;
  completed: boolean;
  onComplete: (id: string) => void;
}) {
  const isAccepted = useAppStore((s) => !!s.accepted[quest.id]);
  const acceptQuest = useAppStore((s) => s.acceptQuest);
  const [opening, setOpening] = useState(false);

  const openLink = () => {
    setOpening(true);
    window.open(quest.link, "_blank", "noopener,noreferrer");
    setTimeout(() => setOpening(false), 400);
  };

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-md bg-sky-50 p-2 text-sky-600 ring-1 ring-sky-200">
            {/* Task/quest icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight">{quest.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{quest.description}</p>
            {quest.deadline && (
              <div className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
                Due: {new Date(quest.deadline).toLocaleString()}
              </div>
            )}
          </div>
        </div>
        <div className="badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600" aria-hidden>
            <path d="M12 2l2.39 4.84L20 8l-4 3.9.94 5.5L12 15.77 7.06 17.4 8 11.9 4 8l5.61-1.16L12 2z"/>
          </svg>
          +{quest.points} pts
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={openLink} className="btn" disabled={opening}>
          {!opening ? (
            <span className="inline-flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <path d="M15 3h6v6"/>
                <path d="M10 14L21 3"/>
              </svg>
              Open
            </span>
          ) : (
            "Opening…"
          )}
        </button>
        {!completed && (
          isAccepted ? (
            <button className="btn" onClick={() => acceptQuest(quest.id, false)}>
              <span className="inline-flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
                Unaccept
              </span>
            </button>
          ) : (
            <button className="btn" onClick={() => acceptQuest(quest.id, true)}>
              <span className="inline-flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Accept
              </span>
            </button>
          )
        )}
        <button
          onClick={() => onComplete(quest.id)}
          className="btn btn-primary"
          disabled={completed}
          aria-disabled={completed}
        >
          <span className="inline-flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            {completed ? "Completed" : "Mark Complete"}
          </span>
        </button>
      </div>
      {quest.autoAccept && !completed && (
        <div className="text-xs text-slate-500">Auto‑accepted main quest</div>
      )}
    </div>
  );
}
