"use client";

import { Auth0Provider } from "@auth0/nextjs-auth0";
import { usePathname } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  // Avoid mounting the provider on the landing page to prevent an initial
  // /auth/profile fetch (401 when unauthenticated) and console noise.
  if (isHome) return children;
  return <Auth0Provider>{children}</Auth0Provider>;
}
