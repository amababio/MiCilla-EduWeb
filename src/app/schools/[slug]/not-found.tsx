import Link from "next/link";
import { getDefaultSchoolSlug, getSchoolPublicPath } from "@/lib/school-slug";

export default function SchoolNotFound() {
  const defaultPath = getSchoolPublicPath(getDefaultSchoolSlug());

  return (
    <main className="flex min-h-screen items-center justify-center bg-mauve-50 px-4">
      <div className="max-w-md rounded-2xl border border-mauve-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-mauve-700">
          MiCilla EduWeb
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">School not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          We could not find a public website for this school link. Check the
          address or return to the demo school homepage.
        </p>
        <Link
          href={defaultPath}
          className="mt-6 inline-flex rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-600"
        >
          Go to demo school
        </Link>
      </div>
    </main>
  );
}
