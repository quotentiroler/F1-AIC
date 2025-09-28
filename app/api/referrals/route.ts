import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";

type Profile = {
  id: string;
  url?: string;
  referrer: string;
  name?: string;
  visitorId?: string;
  status: "pending" | "active";
  initialFollowers: number | null;
  currentFollowers: number | null;
  joinedAt: number;
};

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function kvAvailable() {
  return !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
}

async function getKV() {
  if (!kvAvailable()) return null;
  const mod = await import("@vercel/kv");
  return mod.kv;
}

async function fetchLinkedInFollowers(url: string): Promise<number | null> {
  const key = process.env.PROXYCURL_API_KEY;
  if (!key) return null;
  const endpoint = new URL("https://api.proxycurl.com/v2/linkedin");
  endpoint.searchParams.set("url", url);
  const res = await fetch(endpoint.toString(), {
    headers: { Authorization: `Bearer ${key}` },
    // Proxycurl requires server-side; avoid caching to keep it fresh in demo
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as Record<string, any>;
  // Try multiple likely fields
  const count =
    data.follower_count ??
    data.followers_count ??
    data.num_followers ??
    data.network_followers ??
    null;
  return typeof count === "number" ? count : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { profileUrl?: string; referrer?: string; name?: string; visitorId?: string };
    const profileUrl = (body.profileUrl || "").trim();
    const referrer = (body.referrer || "").trim();
    const name = (body.name || "").trim();
    const visitorId = (body.visitorId || "").trim();
    if (!referrer) {
      return NextResponse.json({ error: "Missing referrer" }, { status: 400 });
    }
    const kv = await getKV();
    if (!kv) {
      return NextResponse.json({ error: "kv_not_configured" }, { status: 501 });
    }
    const keySource = (profileUrl || visitorId || crypto.randomUUID()) + "|" + referrer.toLowerCase();
    const id = sha256(keySource);
    const now = Date.now();
    const existing = ((await kv.get(`profile:${id}`)) as Profile | null) || null;
    let initialFollowers: number | null = existing?.initialFollowers ?? null;
    let currentFollowers: number | null = existing?.currentFollowers ?? null;
    let url = existing?.url;
    let status: Profile["status"] = existing?.status ?? "pending";
    if (profileUrl) {
      url = profileUrl;
      const followers = await fetchLinkedInFollowers(profileUrl);
      if (followers !== null) {
        if (initialFollowers === null) initialFollowers = followers;
        currentFollowers = followers;
        status = "active";
      }
    }
    const profile: Profile = {
      id,
      url,
      referrer,
      name: name || existing?.name,
      visitorId: visitorId || existing?.visitorId,
      status,
      initialFollowers,
      currentFollowers,
      joinedAt: existing?.joinedAt ?? now,
    };
    await kv.set(`profile:${id}`, profile);
    await kv.sadd(`referrer:${referrer.toLowerCase()}`, id);
    return NextResponse.json(profile);
  } catch (e: any) {
    return NextResponse.json({ error: "server_error", detail: e?.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const referrer = (searchParams.get("referrer") || "").trim();
    if (!referrer) {
      return NextResponse.json({ error: "Missing referrer" }, { status: 400 });
    }
    const kv = await getKV();
    if (!kv) {
      return NextResponse.json({ error: "kv_not_configured" }, { status: 501 });
    }
    const ids: string[] = ((await kv.smembers(`referrer:${referrer.toLowerCase()}`)) as any) || [];
    const profiles: Profile[] = [];
    for (const id of ids) {
      const p = (await kv.get(`profile:${id}`)) as Profile | null;
      if (!p) continue;
      // live refresh to show growth if we have URL
      if (p.url) {
        const latest = (await fetchLinkedInFollowers(p.url)) ?? p.currentFollowers;
        if (typeof latest === "number" && latest !== p.currentFollowers) {
          p.currentFollowers = latest;
          await kv.set(`profile:${id}`, p);
        }
      }
      profiles.push(p);
    }
    return NextResponse.json({ profiles });
  } catch (e: any) {
    return NextResponse.json({ error: "server_error", detail: e?.message }, { status: 500 });
  }
}
