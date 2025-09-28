"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <header
      className={
        (isHome ? "absolute top-0 left-0 right-0 bg-white/80 backdrop-blur " : "relative bg-white ") +
        "border-b border-slate-200"
      }
    >
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/favicon.svg" alt="AIC" width={24} height={24} />
          <span>AIC Quest</span>
        </Link>
        <NavBar />
      </div>
    </header>
  );
}
