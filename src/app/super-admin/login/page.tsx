import { Suspense } from "react";
import Link from "next/link";
import { SuperAdminLoginForm } from "@/components/super-admin/SuperAdminLoginForm";

const defaultSuperAdminEmail =
  process.env.SEED_SUPER_ADMIN_EMAIL ?? "super@micilla.com";
const defaultSuperAdminPassword =
  process.env.SEED_SUPER_ADMIN_PASSWORD ?? "super123!";

export default function SuperAdminLoginPage() {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          MiCilla Super Admin
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Platform Sign In</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage schools, school admins, and public website access.
        </p>

        {isDev ? (
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Local dev account:{" "}
            <span className="font-semibold">{defaultSuperAdminEmail}</span> /{" "}
            <span className="font-semibold">{defaultSuperAdminPassword}</span>
          </p>
        ) : null}

        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-slate-500">Loading...</p>}>
            <SuperAdminLoginForm
              defaultEmail={defaultSuperAdminEmail}
              defaultPassword={isDev ? defaultSuperAdminPassword : ""}
            />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/admin/login" className="font-medium text-slate-700 hover:underline">
            School admin sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
