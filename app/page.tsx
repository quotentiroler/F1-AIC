import Link from "next/link";
import ScrollGrid from "@/components/ScrollGrid";

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Full-screen background video */}
      <video
        className="fixed inset-0 h-screen w-screen object-cover"
        src="https://www.aicollective.com/images/index/background/background.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Dim overlay to improve text contrast */}
      <div className="fixed inset-0 bg-black/50" />

      {/* Centered hero content spanning the full viewport height */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center text-white px-6">
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
      </section>

      {/* Scroll-driven sticky grid effect */}
      <div className="relative z-10 text-white">
        <ScrollGrid />
      </div>

      {/* Post-grid CTA section */}
      <section className="relative z-10 flex min-h-[60vh] items-center justify-center px-6 text-center text-white bg-gradient-to-b from-transparent to-black/60">
        <div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Join the AI Collective</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl opacity-90">
            Team up with ambitious founders and builders. Ship faster with quests, unlock badges, and grow together.
          </p>
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="rounded-lg bg-white px-5 py-3 font-semibold text-slate-900 shadow hover:shadow-md"
            >
              Join the AI Collective
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
