import { Suspense } from "react";
import DashboardClient from "@/components/DashboardClient";
import { auth0 } from "@/lib/auth0";

export default auth0.withPageAuthRequired(async () => {
  return (
    <Suspense>
      <DashboardClient />
    </Suspense>
  );
});
