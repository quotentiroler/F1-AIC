import Link from "next/link";
import { auth0 } from "@/lib/auth0";

export const metadata = {
  title: "Profile | AIC Quest",
};

export default async function ProfilePage() {
  const session = await auth0.getSession();
  const user = session?.user ?? null;

  if (!user) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-2 text-slate-600">You’re not signed in.</p>
        <Link href="/api/auth/login" className="btn mt-4 inline-block">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card">
          <div className="text-sm text-slate-500">Name</div>
          <div className="mt-1 font-medium">{user.name || "—"}</div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-500">Email</div>
          <div className="mt-1 font-medium">{user.email || "—"}</div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-500">Sub</div>
          <div className="mt-1 break-all font-mono text-xs">{user.sub}</div>
        </div>
      </div>
      <Link href="/api/auth/logout" className="btn mt-6 inline-block">Sign out</Link>
    </div>
  );
}
