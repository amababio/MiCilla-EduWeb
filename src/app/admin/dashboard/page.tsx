import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { getAdminSession } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-full bg-mauve-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-mauve-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-mauve-600">
          School Admin Area
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Welcome, {session.name}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          You are signed in to manage{" "}
          <span className="font-semibold text-slate-800">
            {session.schoolName}
          </span>
          . The full dashboard layout will be added in the next phase.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-600"
          >
            Preview Website
          </Link>
          <AdminLogoutButton />
        </div>

        <p className="mt-8 rounded-2xl bg-mauve-50 px-4 py-3 text-sm text-mauve-800">
          Signed in as {session.email}
        </p>
      </div>
    </div>
  );
}
