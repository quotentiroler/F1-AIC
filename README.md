# AIC Quest – Growth via Gamification

A hackathon MVP for the AI Collective. Earn points by completing community quests, unlock badges, and climb the leaderboard. Share your referral link to invite others.

## Tech
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Optional server APIs with Vercel KV + Proxycurl

## Quick start

```powershell
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

Deploy via GitHub Actions to `quotentiroler/F1-AIC` (or your repo):

1. Push this project to GitHub.
2. In the GitHub repo, add secrets:
   - `VERCEL_TOKEN` – Vercel personal token
   - `VERCEL_ORG_ID` – Org ID
   - `VERCEL_PROJECT_ID` – Project ID
3. The workflow `.github/workflows/deploy-vercel.yml` will build and deploy on push to `main` (and manual dispatch).

Optional local deploy:

```powershell
npm i -g vercel
vercel pull --yes --environment=production --token $env:VERCEL_TOKEN
vercel build --prod --token $env:VERCEL_TOKEN
vercel deploy --prebuilt --prod --token $env:VERCEL_TOKEN
```

## Real referral tracking (optional)

To enable live LinkedIn follower counts and server-side attribution:

- Provision Vercel KV and set env vars:
  - `KV_REST_API_URL`, `KV_REST_API_TOKEN`
- Set `PROXYCURL_API_KEY` for LinkedIn profile lookups

The UI gracefully degrades if these aren’t set (local-only, no live follower fetches).

## Features
- Profile: save display name; share referral link `/?ref=YourName`
- Quests, points, and badges
- Leaderboard:
  - Growers (Points)
  - Showers (Reach) with “Referred by” column
- Referral Impact shows attributed visitors and cumulative follower growth

## Notes
- Replace OG image and favicon as desired.
