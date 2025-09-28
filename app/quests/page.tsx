"use client";

import { useEffect, useState } from "react";
import QuestCard from "../(components)/QuestCard";
import { QUESTS, readProgress, toggleComplete, calcTotalPoints } from "@/lib/quests";

export default function QuestsPage() {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const prog = readProgress();
    setProgress(prog);
    setTotal(calcTotalPoints(prog));
  }, []);

  const onComplete = (id: string) => {
    toggleComplete(id, true);
    const next = { ...progress, [id]: true };
    setProgress(next);
    setTotal(calcTotalPoints(next));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-1 text-sm text-slate-600">Total points: <span className="font-semibold">{total}</span></div>
      {QUESTS.map((q) => (
        <QuestCard key={q.id} quest={q} completed={!!progress[q.id]} onComplete={onComplete} />
      ))}
    </div>
  );
}
