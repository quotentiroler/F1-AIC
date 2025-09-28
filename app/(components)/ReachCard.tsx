"use client";

import { useEffect, useMemo, useState } from "react";
import { listProfiles, upsertProfile, getProfileByName } from "@/lib/social";

type Row = {
  label: string;
  value: number;
};

export default function ReachCard({ displayName }: { displayName: string }) {
  const [li, setLi] = useState(0);
  const [tw, setTw] = useState(0);
  const [yt, setYt] = useState(0);
  const [nl, setNl] = useState(0);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [newsletterName, setNewsletterName] = useState("");

  useEffect(() => {
    const p = getProfileByName(displayName);
    if (!p) return;
    setLi(p.currentFollowers || 0);
    setTw(p.twitterFollowers || 0);
    setYt(p.youtubeSubs || 0);
    setNl(p.newsletterSubs || 0);
    setLinkedinUrl(p.linkedin || "");
    setTwitterHandle(p.twitter || "");
    setYoutubeUrl(p.youtube || "");
    setNewsletterName(p.newsletter || "");
  }, [displayName]);

  const total = useMemo(() => li + tw + yt + nl, [li, tw, yt, nl]);

  const rows: Row[] = [
    { label: "LinkedIn", value: li },
    { label: "X / Twitter", value: tw },
    { label: "YouTube", value: yt },
    { label: "Newsletter", value: nl },
  ];

  const save = () => {
    const record = {
      name: displayName || "You",
      linkedin: linkedinUrl || undefined,
      currentFollowers: li,
      baselineFollowers: Math.max(0, li - 1), // harmless baseline
      twitter: twitterHandle || undefined,
      twitterFollowers: tw,
      youtube: youtubeUrl || undefined,
      youtubeSubs: yt,
      newsletter: newsletterName || undefined,
      newsletterSubs: nl,
    };
    upsertProfile(record);
  };

  return (
    <section className="card">
      <h2 className="text-lg font-semibold">Your Reach</h2>
      <div className="mt-2 text-2xl font-bold">{total.toLocaleString()}</div>
      <div className="mt-2 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        {rows.map((r) => (
          <div key={r.label} className="rounded-md border border-slate-200 p-2">
            <div className="text-slate-600">{r.label}</div>
            <div className="text-lg font-semibold">{r.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="text-xs text-slate-600">LinkedIn URL</label>
          <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://www.linkedin.com/in/your-handle" />
        </div>
        <div>
          <label className="text-xs text-slate-600">X / Twitter handle</label>
          <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} placeholder="@handle" />
        </div>
        <div>
          <label className="text-xs text-slate-600">YouTube channel URL</label>
          <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/@channel" />
        </div>
        <div>
          <label className="text-xs text-slate-600">Newsletter (name or URL)</label>
          <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" value={newsletterName} onChange={(e) => setNewsletterName(e.target.value)} placeholder="Substack, Beehiiv, etc." />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div>
          <label className="text-xs text-slate-600">LinkedIn followers</label>
          <input type="number" className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" value={li} onChange={(e) => setLi(parseInt(e.target.value || "0", 10))} />
        </div>
        <div>
          <label className="text-xs text-slate-600">Twitter followers</label>
          <input type="number" className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" value={tw} onChange={(e) => setTw(parseInt(e.target.value || "0", 10))} />
        </div>
        <div>
          <label className="text-xs text-slate-600">YouTube subs</label>
          <input type="number" className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" value={yt} onChange={(e) => setYt(parseInt(e.target.value || "0", 10))} />
        </div>
        <div>
          <label className="text-xs text-slate-600">Newsletter subs</label>
          <input type="number" className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" value={nl} onChange={(e) => setNl(parseInt(e.target.value || "0", 10))} />
        </div>
      </div>

      <div className="mt-3">
        <button className="btn" onClick={save}>Save reach</button>
      </div>
    </section>
  );
}
