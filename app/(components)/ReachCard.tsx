"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { listProfiles, upsertProfile, getProfileByName, submitReachUpdate } from "@/lib/social";

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

  const [submitted, setSubmitted] = useState<"idle" | "pending" | "done">("idle");
  const save = () => {
    // create a pending submission for moderator verification
    submitReachUpdate(displayName || "You", {
      linkedin: linkedinUrl || undefined,
      currentFollowers: li,
      twitter: twitterHandle || undefined,
      twitterFollowers: tw,
      youtube: youtubeUrl || undefined,
      youtubeSubs: yt,
      newsletter: newsletterName || undefined,
      newsletterSubs: nl,
    });
    setSubmitted("done");
  };

  return (
    <section className="card">
      <h2 className="text-lg font-semibold inline-flex items-center gap-2">
        <Image src="/network-svgrepo-com.svg" width={18} height={18} alt="" aria-hidden className="inline-block" />
        Your Reach
      </h2>
      <div className="mt-2 text-2xl font-bold">{total.toLocaleString()}</div>
      <div className="mt-2 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        {rows.map((r) => (
          <div key={r.label} className="rounded-md border border-slate-200 p-2">
            <div className="text-slate-600 inline-flex items-center gap-2">
              {r.label === "LinkedIn" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-sky-600" aria-hidden>
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4zM8.5 8h3.8v2.2h.1c.5-.9 1.8-2.2 3.7-2.2 4 0 4.7 2.6 4.7 6V24h-4v-7.2c0-1.7 0-3.9-2.4-3.9s-2.8 1.8-2.8 3.8V24h-4z" />
                </svg>
              )}
              {r.label === "X / Twitter" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-slate-700" aria-hidden>
                  <path d="M18.244 2H21.5l-7.6 8.69L22.5 22h-7.3l-5.7-6.6L3.8 22H.5l8.1-9.27L1 2h7.5l5.2 6 4.544-6Z"/>
                </svg>
              )}
              {r.label === "YouTube" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-red-600" aria-hidden>
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6a3 3 0 0 0-2.1 2.1C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1C4.4 20.5 12 20.5 12 20.5s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 16 24 12 24 12s0-4-.5-5.8zM9.5 15.5v-7l6 3.5-6 3.5z"/>
                </svg>
              )}
              {r.label === "Newsletter" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600" aria-hidden>
                  <path d="M20 4H4a2 2 0 0 0-2 2v1l10 5 10-5V6a2 2 0 0 0-2-2z"/>
                  <path d="M22 8l-10 5L2 8v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8z"/>
                </svg>
              )}
              {r.label}
            </div>
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

      <div className="mt-3 flex items-center gap-3">
        <button className="btn" onClick={save}>Update reach</button>
        {submitted === "done" && (
          <span className="text-sm text-slate-600">Submitted for review. Changes go live after moderator approval.</span>
        )}
      </div>
    </section>
  );
}
