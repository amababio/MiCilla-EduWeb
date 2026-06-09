import { SchoolsManager } from "@/components/super-admin/SchoolsManager";
import { getSchoolsForSuperAdmin } from "@/lib/actions/super-admin";

export default async function SuperAdminDashboardPage() {
  const schools = await getSchoolsForSuperAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Schools</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Create schools, assign school admins, reset passwords, and control whether
          each public website is live.
        </p>
      </div>

      <SchoolsManager schools={schools} />
    </div>
  );
}
