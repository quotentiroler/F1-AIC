"use client";

import { useState } from "react";
import type { Quest } from "@/lib/quests";

export default function QuestCard({
  quest,
  completed,
  onComplete,
}: {
  quest: Quest;
  completed: boolean;
  onComplete: (id: string) => void;
}) {
  const [opening, setOpening] = useState(false);

  const openLink = () => {
    setOpening(true);
    window.open(quest.link, "_blank", "noopener,noreferrer");
    setTimeout(() => setOpening(false), 400);
  };

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{quest.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{quest.description}</p>
        </div>
        <div className="badge">+{quest.points} pts</div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={openLink} className="btn" disabled={opening}>
          {opening ? "Opening…" : "Open"}
        </button>
        <button
          onClick={() => onComplete(quest.id)}
          className="btn btn-primary"
          disabled={completed}
          aria-disabled={completed}
        >
          {completed ? "Completed" : "Mark Complete"}
        </button>
      </div>
    </div>
  );
}
