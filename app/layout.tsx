import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainFrame from "@/components/MainFrame";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
        <Header />
        <MainFrame>{children}</MainFrame>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
