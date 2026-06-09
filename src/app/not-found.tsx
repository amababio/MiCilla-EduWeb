import Link from "next/link";
import { getDefaultSchoolSlug, getSchoolPublicPath } from "@/lib/school-slug";

export default function NotFound() {
  const defaultPath = getSchoolPublicPath(getDefaultSchoolSlug());

  return (
    <main className="flex min-h-screen items-center justify-center bg-mauve-50 px-4">
      <div className="max-w-md rounded-2xl border border-mauve-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-mauve-700">
          MiCilla EduWeb
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          The page you requested is not available. Return to the demo school
          website or sign in to the admin area.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={defaultPath}
            className="inline-flex items-center justify-center rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-600"
          >
            Go to demo school
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center rounded-full border border-mauve-300 px-6 py-3 text-sm font-semibold text-mauve-700 transition hover:bg-mauve-50"
          >
            Admin login
          </Link>
        </div>
      </div>
    </main>
  );
}
