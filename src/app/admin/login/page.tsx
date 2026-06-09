import { Suspense } from "react";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

const defaultAdminEmail =
  process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
const defaultAdminPassword =
  process.env.SEED_ADMIN_PASSWORD ?? "admin123!";

export default function AdminLoginPage() {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-gradient-to-br from-mauve-50 via-white to-mauve-100 px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-mauve-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-mauve-600">
          MiCilla EduWeb
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          School Admin Sign In
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to manage your school website.
        </p>

        {isDev ? (
          <p className="mt-4 rounded-xl bg-mauve-50 px-4 py-3 text-sm text-mauve-800">
            Local dev account:{" "}
            <span className="font-semibold">{defaultAdminEmail}</span> /{" "}
            <span className="font-semibold">{defaultAdminPassword}</span>
          </p>
        ) : null}

        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-slate-500">Loading...</p>}>
            <AdminLoginForm
              defaultEmail={defaultAdminEmail}
              defaultPassword={isDev ? defaultAdminPassword : ""}
            />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="font-medium text-mauve-700 hover:underline">
            Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
