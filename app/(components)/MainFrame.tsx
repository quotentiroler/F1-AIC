"use client";

import { usePathname } from "next/navigation";

export default function MainFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  if (isHome) {
    return <main className="py-0">{children}</main>;
  }
  return (
    <main>
      <div className="container py-6">{children}</div>
    </main>
  );
}
