"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <footer className="relative z-10 py-8 text-center text-sm text-white/80 bg-black">
        Built for F1 Hackathon • Deployed on Vercel
      </footer>
    );
  }

  return (
    <footer className="w-full py-8 text-center text-sm text-slate-300 bg-black">
      Built for F1 Hackathon • Deployed on Vercel
    </footer>
  );
}
