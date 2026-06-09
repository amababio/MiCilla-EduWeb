import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getAdminDashboardStats } from "@/lib/get-admin-dashboard-stats";

const summaryCards = [
  { key: "programs", label: "Programs", hint: "Active school levels" },
  { key: "photos", label: "Photos", hint: "Featured gallery photos" },
  { key: "notices", label: "Notices", hint: "Published announcements" },
  { key: "achievements", label: "Achievements", hint: "Published highlights" },
  { key: "files", label: "Files", hint: "Published downloads" },
] as const;

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const stats = await getAdminDashboardStats(session.schoolId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Welcome, {session.name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Manage your school website for{" "}
          <span className="font-semibold text-slate-800">
            {session.schoolName}
          </span>
          . Use the menu to update content when those sections are ready.
        </p>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-mauve-700">
          Website Summary
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {summaryCards.map((card) => (
            <article
              key={card.key}
              className="rounded-2xl border border-mauve-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-600">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-mauve-700">
                {stats[card.key]}
              </p>
              <p className="mt-2 text-xs text-slate-500">{card.hint}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-mauve-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">Next steps</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Content editing tools for School Profile, Homepage, Programs, Photos,
          Achievements, Notices, and Files will be added in the next phases. For
          now, preview your public website to see the current demo content.
        </p>
      </section>
    </div>
  );
}
