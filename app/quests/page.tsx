"use client";

import { useEffect, useMemo } from "react";
import QuestCard from "../(components)/QuestCard";
import { groupQuestsByEvent, calcTotalPoints, QUESTS } from "@/lib/quests";
import { useAppStore } from "@/components/useAppStore";

export default function QuestsPage() {
  const progress = useAppStore((s) => s.progress);
  const accepted = useAppStore((s) => s.accepted);
  const joined = useAppStore((s) => s.joinedEvents);
  const markComplete = useAppStore((s) => s.markComplete);
  const acceptQuest = useAppStore((s) => s.acceptQuest);
  const joinEvent = useAppStore((s) => s.joinEvent);
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
      {groupQuestsByEvent().map((group) => {
        const open = group.items.filter((q) => !isCompleted(q.id) && !isAccepted(q.id));
        const acceptedOnly = group.items.filter((q) => isAccepted(q.id) && !isCompleted(q.id));
        const completed = group.items.filter((q) => isCompleted(q.id));
        return (
          <section key={group.event} className="mt-2 rounded-xl bg-gradient-to-br from-indigo-50 to-sky-50 p-4 ring-1 ring-indigo-100">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-indigo-900">{group.event}</h2>
                {joined[group.event] ? (
                  <span className="rounded-full bg-emerald-100/70 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">Joined</span>
                ) : (
                  <button className="btn btn-xs" onClick={() => joinEvent(group.event)}>
                    <span className="inline-flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Join Event
                    </span>
                  </button>
                )}
              </div>
              {group.deadline && (
                <div className="text-xs text-slate-600">Latest deadline: {new Date(group.deadline).toLocaleString()}</div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {/* Open */}
              <div className="rounded-lg bg-white/70 p-3 ring-1 ring-sky-100">
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                  Open
                </div>
                <div className="flex flex-col gap-3">
                  {open.length === 0 ? (
                    <div className="text-xs text-slate-500">All caught up here.</div>
                  ) : (
                    open.map((q) => (
                      <QuestCard key={q.id} quest={q} completed={!!progress[q.id]} onComplete={onComplete} />
                    ))
                  )}
                </div>
              </div>

              {/* Accepted */}
              <div className="rounded-lg bg-white/70 p-3 ring-1 ring-emerald-100">
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Accepted
                </div>
                <div className="flex flex-col gap-3">
                  {acceptedOnly.length === 0 ? (
                    <div className="text-xs text-slate-500">No accepted quests yet.</div>
                  ) : (
                    acceptedOnly.map((q) => (
                      <QuestCard key={q.id} quest={q} completed={!!progress[q.id]} onComplete={onComplete} />
                    ))
                  )}
                </div>
              </div>

              {/* Completed */}
              <div className="rounded-lg bg-white/70 p-3 ring-1 ring-violet-100">
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400"></span>
                  Completed
                </div>
                <div className="flex flex-col gap-3">
                  {completed.length === 0 ? (
                    <div className="text-xs text-slate-500">Nothing completed yet.</div>
                  ) : (
                    completed.map((q) => (
                      <QuestCard key={q.id} quest={q} completed={!!progress[q.id]} onComplete={onComplete} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
