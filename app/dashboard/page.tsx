import { Suspense } from "react";
import DashboardClient from "@/components/DashboardClient";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect("/api/auth/login");
  }
  return (
    <Suspense>
      <DashboardClient />
    </Suspense>
  );
}
