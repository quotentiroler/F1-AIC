import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "AIC Quest – Growth via Gamification",
  description: "Gamified engagement for AI Collective (Hackathon MVP)",
  metadataBase: new URL("https://example.com"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "AIC Quest",
    description: "Gamified engagement for AI Collective (Hackathon MVP)",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="container flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image src="/favicon.svg" alt="AIC" width={24} height={24} />
              <span>AIC Quest</span>
            </Link>
            <NavBar />
          </div>
        </header>
        <main className="py-6">
          <div className="container">{children}</div>
        </main>
        <footer className="container py-8 text-center text-sm text-slate-500">
          Built for F1 Hackathon • Deployed on Vercel
        </footer>
      </body>
    </html>
  );
}
