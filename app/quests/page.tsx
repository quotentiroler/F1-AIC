"use client";

import { useEffect, useMemo, useState } from "react";
import QuestCard from "../(components)/QuestCard";
import { groupQuestsByEvent, calcTotalPoints, QUESTS } from "@/lib/quests";
import { useAppStore } from "@/components/useAppStore";

export default function QuestsPage() {
  const progress = useAppStore((s) => s.progress);
  const accepted = useAppStore((s) => s.accepted);
  const markComplete = useAppStore((s) => s.markComplete);
  const acceptQuest = useAppStore((s) => s.acceptQuest);
  const total = useMemo(() => calcTotalPoints(progress), [progress]);

  const onComplete = (id: string) => {
    markComplete(id);
  };

  // Ensure auto-accepted quests are marked accepted
  useEffect(() => {
    for (const q of QUESTS) {
      if (q.autoAccept && !accepted[q.id]) acceptQuest(q.id, true);
    }
  }, [accepted, acceptQuest]);

  // Buckets: open (not accepted, not completed), accepted (accepted but not completed), completed
  const isCompleted = (id: string) => !!progress[id];
  const isAccepted = (id: string) => !!accepted[id];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold inline-flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 20l9-5-9-5-9 5 9 5z"/>
            <path d="M12 12l9-5-9-5-9 5 9 5z"/>
          </svg>
          Quests
        </h1>
      </div>
      <div className="mb-1 text-sm text-slate-600">Total points: <span className="font-semibold">{total}</span></div>
      {/* Open Quests (not accepted, not completed) */}
      {groupQuestsByEvent().map((group) => (
        <section key={group.event} className="mt-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{group.event} — Open</h2>
            {group.deadline && (
              <div className="text-xs text-slate-600">Latest deadline: {new Date(group.deadline).toLocaleString()}</div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {group.items.filter((q) => !isCompleted(q.id) && !isAccepted(q.id)).map((q) => (
              <QuestCard key={q.id} quest={q} completed={!!progress[q.id]} onComplete={onComplete} />
            ))}
          </div>
        </section>
      ))}

      {/* Accepted Quests (accepted but not completed) */}
      {groupQuestsByEvent().map((group) => (
        <section key={group.event + "-accepted"} className="mt-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{group.event} — Accepted</h2>
          </div>
          <div className="flex flex-col gap-3">
            {group.items.filter((q) => isAccepted(q.id) && !isCompleted(q.id)).map((q) => (
              <QuestCard key={q.id} quest={q} completed={!!progress[q.id]} onComplete={onComplete} />
            ))}
          </div>
        </section>
      ))}

      {/* Completed Quests */}
      {groupQuestsByEvent().map((group) => (
        <section key={group.event + "-completed"} className="mt-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{group.event} — Completed</h2>
          </div>
          <div className="flex flex-col gap-3">
            {group.items.filter((q) => isCompleted(q.id)).map((q) => (
              <QuestCard key={q.id} quest={q} completed={!!progress[q.id]} onComplete={onComplete} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
