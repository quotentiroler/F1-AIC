import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative h-[calc(100vh-140px)] w-full overflow-hidden rounded-xl border border-slate-200">{/* header+footer height approx */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="https://www.aicollective.com/images/index/background/background.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">Growers vs Showers</h1>
        <p className="mt-4 max-w-2xl text-lg sm:text-xl opacity-90">
          Join AIC Quest: complete quests, earn badges, invite friends, and climb the leaderboards.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-white px-5 py-3 font-semibold text-slate-900 shadow hover:shadow-md"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/leaderboard"
            className="rounded-lg bg-slate-900/70 px-5 py-3 font-semibold text-white ring-1 ring-white/30 hover:bg-slate-900/80"
          >
            View Leaderboards
          </Link>
        </div>
      </div>
    </div>
  );
}
