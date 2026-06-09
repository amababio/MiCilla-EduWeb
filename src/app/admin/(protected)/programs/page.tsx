import { redirect } from "next/navigation";
import { ProgramsManager } from "@/components/admin/ProgramsManager";
import { getProgramsForAdmin } from "@/lib/actions/programs";
import { getAdminSession } from "@/lib/auth";

export default async function ProgramsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const programs = await getProgramsForAdmin(session.schoolId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Programs</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Manage the school levels shown on your public website. You can add,
          edit, hide, reorder, or remove programs.
        </p>
      </div>

      <ProgramsManager programs={programs} />
    </div>
  );
}
